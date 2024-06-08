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

// TO-DO: figure out if creating new Project document automatically adds _id field to its new vertices and edges
  // if so, need temporary id for each vertex and edge on front end until project saved
  // if not, need permanent id generated for each vertex and edge on creation; in this case, VertexSchema and EdgeSchema may not be necessary

module.exports = ProjectSchema;