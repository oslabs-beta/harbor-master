import mongoose from 'mongoose';
import Vertex from 'interfaces/Vertex';

const Schema = mongoose.Schema;

const VertexSchema = new Schema<Vertex>({
  resourceType: String,
  position: [Number],
  data: Object
});

export default VertexSchema;