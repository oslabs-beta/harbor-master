import Edge from 'interfaces/Edge';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const VertexSchema = require('./VertexSchema');

const EdgeSchema = new Schema<Edge>({
  endpointVertices: { type: [VertexSchema], required: true }
});

module.exports = EdgeSchema;