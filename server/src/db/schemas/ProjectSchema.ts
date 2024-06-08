import mongoose from 'mongoose';
import Project from 'interfaces/Project';

const Schema = mongoose.Schema;
const VertexSchema = require('./VertexSchema');
const EdgeSchema = require('./EdgeSchema');

const ProjectSchema = new Schema<Project>({
  userId: String,
  googleCloudId: String,
  createdAt: String,
  googleRegion: String,
  vertices: [VertexSchema],
  edges: [EdgeSchema]
});

module.exports = ProjectSchema;