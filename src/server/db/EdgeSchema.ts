import mongoose from 'mongoose';
import VertexSchema from './VertexSchema';

const Schema = mongoose.Schema;

const EdgeSchema = new Schema({
  vertices: [VertexSchema]
});

export default EdgeSchema;