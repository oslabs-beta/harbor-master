import Edge from "interfaces/Edge";
import ProjectProperties from "interfaces/ProjectProperties";
import ServiceAccountCredentials from "interfaces/ServiceAccountCredentials";
import UserDeploymentOptions from "interfaces/UserDeploymentOptions";
import Vertex from "interfaces/Vertex";

export default class EmptyProject implements ProjectProperties {
  id: string
  userId: string
  appInstallationId: string
  gcpProjectId: string
  gcpProjectNumber: number
  gcpServiceAcctEmail: string
  gcpRegion: string
  gcpComputeZone: string
  gcpServiceAccounts: ServiceAccountCredentials[]
  deploymentOptions: UserDeploymentOptions
  terraformState: object
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
    this.deploymentOptions = {} as UserDeploymentOptions;
    this.terraformState = {};
    this.githubToken = '';
    this.githubUrl = '';
    this.createdAt = '';
    this.vertices = [];
    this.edges = [];
  }
}