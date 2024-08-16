import ServiceAccountCredentials from "./ServiceAccountCredentials"
import UserDeploymentOptions from "./UserDeploymentOptions"

export default interface DeploymentProperties extends UserDeploymentOptions {
  appInstallationId: string
  gcpProjectId: string
  gcpProjectNumber: number
  gcpServiceAcctEmail: string
  gcpRegion: string
  gcpComputeZone: string
  gcpServiceAccounts: ServiceAccountCredentials[]
  githubToken: string
  githubUrl: string
}