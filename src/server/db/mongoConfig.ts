import mongoose, { Schema } from "mongoose";

const UserSchema: mongoose.Schema = require('./schemas/userSchema');
const ProjectSchema: mongoose.Schema = require('./schemas/projectSchema');
const VertexSchema: mongoose.Schema = require('./schemas/vertexSchema');
const EdgeSchema: mongoose.Schema = require('./schemas/edgeSchema');

const { MONGO_URI } = process.env;

mongoose.connect(MONGO_URI!, {
  dbName: 'harborMaster'
})
  .then(() => console.log('Connected to Harbor Master database.'))
  .catch((err: Error) => console.log(err));


const UserModel = mongoose.model('user', UserSchema);
const ProjectModel = mongoose.model('project', ProjectSchema);
const VertexModel = mongoose.model('vertex', VertexSchema);
const EdgeModel = mongoose.model('edge', EdgeSchema);

module.exports = {
  UserModel,
  ProjectModel,
  VertexModel,
  EdgeModel
};