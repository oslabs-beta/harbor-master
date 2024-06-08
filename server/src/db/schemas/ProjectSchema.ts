import mongoose from 'mongoose';
import Project from 'interfaces/Project';

const Schema = mongoose.Schema;
const VertexSchema = require('./VertexSchema');
const EdgeSchema = require('./EdgeSchema');

const ProjectSchema = new Schema<Project>({
  userId: { type: String, required: true },
  googleCloudId: { type: String, required: true },
  createdAt: { type: String, required: true },
  googleRegion: { type: String, required: true },
  vertices: { type: [VertexSchema], required: true },
  edges: { type: [EdgeSchema], required: true }
});

module.exports = ProjectSchema;