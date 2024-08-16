import { Schema } from 'mongoose';
import Project from 'interfaces/ProjectProperties';
import Vertex from 'interfaces/Vertex';
import Edge from 'interfaces/Edge';
import ServiceAccountCredentials from 'interfaces/ServiceAccountCredentials';

const ProjectConfigSchema = new Schema<Project>({
  userId: String,
  appInstallationId: String,
  gcpProjectId: String,
  gcpProjectNumber: Number,
  gcpServiceAcctEmail: String,
  gcpRegion: String,
  gcpComputeZone: String,
  gcpServiceAccounts: Array<ServiceAccountCredentials>,
  deploymentOptions: Object,
  terraformState: Object,
  githubToken: String,
  githubUrl: String,
  createdAt: String,
  vertices: Array<Vertex>,
  edges: Array<Edge>
});

export default ProjectConfigSchema;