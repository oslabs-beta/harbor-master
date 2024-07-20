import Vertex from "interfaces/Vertex";
import Edge from "interfaces/Edge";
import ServiceAccountCredentials from "interfaces/ServiceAccountCredentials";

export default interface Project {
  id: string
  userId: string
  appInstallationId: string
  gcpProjectId: string
  gcpProjectNumber: number
  gcpServiceAcctEmail: string
  gcpRegion: string
  gcpComputeZone: string
  gcpServiceAccounts: ServiceAccountCredentials[]
  githubToken: string
  githubUrl: string
  createdAt: string
  vertices: Vertex[]
  edges: Edge[]
}