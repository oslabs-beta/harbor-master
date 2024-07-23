terraform {
  required_providers {
    google = {
      source  = "registry.terraform.io/hashicorp/google"
      version = ">= 5.36.0"
    }
     kubectl = {
      source  = "gavinbunney/kubectl"
      version = ">= 1.7.0"
    }
     docker = {
      source  = "kreuzwerker/docker"
      version = "3.0.2"
    }
    local = {
      source = "hashicorp/local"
      version = "2.5.1"
    }
  }
}
locals {
  services = [
    "cloudresourcemanager.googleapis.com",
    "gkehub.googleapis.com",
    "cloudbuild.googleapis.com",
    "secretmanager.googleapis.com",
    "container.googleapis.com",
    "artifactregistry.googleapis.com",
  ]
}
resource "local_file" "deploy" {
  content  = <<-EOF
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: nodeappdeployment
      namespace: default
      labels:
        app: nodeapp
        type: backend
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: nodeapp
          type: backend
      strategy:
        rollingUpdate:
          maxSurge: 25%
          maxUnavailable: 25%
        type: RollingUpdate
      template:
        metadata:
          annotations:
            kubectl.kubernetes.io/restartedAt: '2024-07-07T18:50:51-04:00'
          labels:
            app: nodeapp
            type: backend
        spec:
          containers:
            - name: nodeappcontainer
              image: us.gcr.io/"local.envs.PROJECT_ID"/terraform/solo:latest
              imagePullPolicy: Always
              ports:
                - containerPort: 80
                  protocol: TCP
              volumeMounts:
                - name: docker-socket
                  mountPath: /var/run/docker.sock
                  readOnly: false
          volumes:
            - name: docker-socket
              hostPath:
                path: /var/run/docker.sock
                type: Socket
          EOF
  filename = "${path.module}/k8s/deploy.yml"
}

resource "local_file" "cloudbuild" {
  depends_on = [local_file.deploy]
  content  = <<-EOF
    options:
      logging: CLOUD_LOGGING_ONLY

    service_account: "projects/local.envs.PROJECT_ID/serviceAccounts/local.envs.SA_EMAIL"

    steps:
      - name: 'gcr.io/cloud-builders/docker'
        id: 'docker-build'
        args:
          - 'build'
          - '-t'
          - 'us.gcr.io/local.envs.PROJECT_ID/terraform/solo:latest'
          - '.'

      - name: 'gcr.io/cloud-builders/docker'
        id: 'docker-push'
        args:
          - 'push'
          - 'us.gcr.io/local.envs.PROJECT_ID/terraform/solo:latest'

      - name: 'gcr.io/cloud-builders/gke-deploy'
        id: 'prepare-deploy'
        args:
          - 'prepare'
          - '--filename=${local_file.deploy.filename}'
          - '--image=us.gcr.io/local.envs.PROJECT_ID/terraform/solo:latest'

      - name: 'gcr.io/cloud-builders/gke-deploy'
        id: 'apply-deploy'
        args:
          - 'apply'
          - '--filename=output/expanded'
          - '--cluster=primary'
          - '--location=local.envs.COMPUTE_REGION'
          - '--namespace=default'
  EOF
  filename = "${path.module}/cloudbuild.yaml"
}

provider "google" {
  project="local.envs.PROJECT_ID"
  credentials = <<-EOF
  local.envs.SA_credentials
EOF

  region="local.envs.COMPUTE_REGION"
  zone = "local.envs.COMPUTE_ZONE"
}

data "google_client_config" "provider" {}

provider "docker" {
  host = "unix:///var/run/docker.sock"
  registry_auth {
    address  = "us.gcr.io"
    username = "oauth2accesstoken"
    password = data.google_client_config.provider.access_token
  }
}

resource "docker_image" "image" {
  name = "us.gcr.io/local.envs.PROJECT_ID/terraform/solo:latest"
  build {
    context = ""
    remote_context = "local.envs.GH_URL"
  }
}

resource "google_project_service" "enabled_service" {
  for_each = toset(local.services)
  project = "local.envs.PROJECT_ID"
  service = each.key
  disable_dependent_services = true
}

resource "google_container_cluster" "primary" {
  depends_on = [google_project_service.enabled_service]
  name     = "primary"
  location = "local.envs.COMPUTE_REGION"
  # We can't create a cluster with no node pool defined, but we want to only use
  # separately managed node pools. So we create the smallest possible default
  # node pool and immediately delete it.
  remove_default_node_pool = true
  initial_node_count       = 1
  deletion_protection = false
}

resource "google_container_node_pool" "primary_preemptible_nodes" {
  depends_on = [google_container_cluster.primary]
  name       = "my-node-pool"
  location   = "local.envs.COMPUTE_REGION"
  cluster    = google_container_cluster.primary.name
  node_count = 1

  node_config {
    preemptible  = true
    machine_type = "e2-medium"

    # Google recommends custom service accounts that have cloud-platform scope and permissions granted via IAM Roles.
    service_account = "local.envs.SA_EMAIL"
    oauth_scopes    = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]
  }
}
resource "google_secret_manager_secret" "github-token-secret" {
  depends_on = [google_project_service.enabled_service]
  secret_id = "github-token-secret"

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "github-token-secret-version" {
  depends_on = [google_secret_manager_secret.github-token-secret]
  secret = google_secret_manager_secret.github-token-secret.id
  secret_data = "local.envs.GH_TOKEN"
}

data "google_iam_policy" "p4sa-secretAccessor" {
  binding {
    role = "roles/secretmanager.secretAccessor"
    // Here, 123456789 is the Google Cloud project number for the project that contains the connection.
    members = ["serviceAccount:service-local.envs.PROJECT_NUMBER@gcp-sa-cloudbuild.iam.gserviceaccount.com"]
  }
}

resource "google_secret_manager_secret_iam_policy" "policy" {
  depends_on = [google_secret_manager_secret.github-token-secret,data.google_iam_policy.p4sa-secretAccessor]
  project = google_secret_manager_secret.github-token-secret.project
  secret_id = google_secret_manager_secret.github-token-secret.secret_id
  policy_data = data.google_iam_policy.p4sa-secretAccessor.policy_data
}

resource "google_artifact_registry_repository" "artifact" {
  depends_on = [google_project_service.enabled_service]
  location      = "us"
  repository_id = "us.gcr.io"
  description   = "docker repository for app"
  format        = "DOCKER"
}

resource "docker_registry_image" "image" {
  depends_on = [docker_image.image,google_artifact_registry_repository.artifact]
  name       = docker_image.image.name
  keep_remotely = true
}

resource "google_cloudbuildv2_connection" "my-connection" {
  depends_on = [google_secret_manager_secret_iam_policy.policy]
  location = "local.envs.COMPUTE_REGION"
  name = "my-connection"
  
  github_config {
    app_installation_id = "local.envs.APP_INSTALLATION_ID"
    authorizer_credential {
      oauth_token_secret_version = google_secret_manager_secret_version.github-token-secret-version.id
    }
  }
}

resource "google_cloudbuildv2_repository" "my-repository" {
  depends_on = [google_cloudbuildv2_connection.my-connection]
  name = "solo-project"
  location = "local.envs.COMPUTE_REGION"
  parent_connection = google_cloudbuildv2_connection.my-connection.name
  remote_uri = "local.envs.GH_URL"
}

resource "google_cloudbuild_trigger" "my-trigger" {
  location = "local.envs.COMPUTE_REGION"
  name     = "my-triggers"
  filename = local_file.cloudbuild.filename
  repository_event_config {
    repository = google_cloudbuildv2_repository.my-repository.id
    push {
      branch = "^main$"
    }
  }
  service_account = "projects/local.envs.PROJECT_ID/serviceAccounts/local.envs.SA_EMAIL"
}
provider "kubectl" {
  host = "https://${google_container_cluster.primary.endpoint}"
  token = data.google_client_config.provider.access_token
  cluster_ca_certificate = "${base64decode(google_container_cluster.primary.master_auth.0.cluster_ca_certificate)}"
  load_config_file = false
}

resource "kubectl_manifest" "deploy" {
  depends_on = [docker_registry_image.image]
  yaml_body = local_file.deploy.content
}

resource "kubectl_manifest" "service" {
  depends_on = [docker_registry_image.image]
    yaml_body = file("k8s/service.yml")
}

