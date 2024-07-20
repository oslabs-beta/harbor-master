import mongoose from 'mongoose';
import Project from 'interfaces/Project';
import VertexSchema from './VertexSchema';
import EdgeSchema from './EdgeSchema';

const Schema = mongoose.Schema;

const ProjectConfigSchema = new Schema<Project>({
  userId: String,
  appInstallationId: String,
  gcpProjectId: String,
  gcpProjectNumber: Number,
  gcpServiceAcctEmail: String,
  gcpRegion: String,
  gcpComputeZone: String,
  gcpServiceAccounts: [Object],
  githubToken: String,
  githubUrl: String,
  createdAt: String,
  vertices: [VertexSchema],
  edges: [EdgeSchema]
});

export default ProjectConfigSchema;