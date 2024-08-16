export default interface UserDeploymentOptions {
  clusterName: string
  artifactRegistryName: string
  nodePoolName: string
  nodeCount: number
  cloudBuildConnectionName: string
  cloudBuildRepoName: string
  cloudBuildTriggerName: string
  branchName: string
}