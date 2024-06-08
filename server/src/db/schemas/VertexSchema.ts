import mongoose from 'mongoose';
import Vertex from 'interfaces/Vertex';

const Schema = mongoose.Schema;

const VertexSchema = new Schema<Vertex>({
  resourceType: { type: String, required: true },
  position: { type: [Number], required: true },
  // will figure out vertex data as we go
  data: { type: Object, required: true }
});

module.exports = VertexSchema;