import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const EdgeSchema = new Schema({
  endpointVertexIds: { type: [String], required: true }
});

module.exports = EdgeSchema;