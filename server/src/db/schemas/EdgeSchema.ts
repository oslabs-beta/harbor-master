import Edge from 'interfaces/Edge';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const EdgeSchema = new Schema<Edge>({
  endpointVertexIds: { type: [String], required: true }
});

module.exports = EdgeSchema;