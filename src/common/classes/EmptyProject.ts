import Edge from "interfaces/Edge";
import Project from "interfaces/Project";
import ServiceAccountCredentials from "interfaces/ServiceAccountCredentials";
import Vertex from "interfaces/Vertex";

export default class EmptyProject implements Project {
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

  constructor() {
    this.id = '';
    this.userId = '';
    this.appInstallationId = '';
    this.gcpProjectId = '';
    this.gcpProjectNumber = 0;
    this.gcpServiceAcctEmail = '';
    this.gcpRegion = '';
    this.gcpComputeZone = '';
    this.gcpServiceAccounts = [];
    this.githubToken = '';
    this.githubUrl = '';
    this.createdAt = '';
    this.vertices = [];
    this.edges = [];
  }
}