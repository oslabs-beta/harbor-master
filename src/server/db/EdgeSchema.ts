import mongoose from 'mongoose';
import VertexSchema from './VertexSchema';

const Schema = mongoose.Schema;

const EdgeSchema = new Schema({
  endpointVertexIds: { type: [String], required: true }
});

export default EdgeSchema;