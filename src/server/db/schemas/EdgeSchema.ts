import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const VertexSchema = require('./VertexSchema');

const EdgeSchema = new Schema({
  vertices: [VertexSchema]
});

module.exports = EdgeSchema;