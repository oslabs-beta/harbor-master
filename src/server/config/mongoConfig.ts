import mongoose, { Schema } from "mongoose";
import config from './envConfig'
import UserSchema from '../db/UserSchema';
import ProjectConfigSchema from '../db/ProjectConfigSchema';
import VertexSchema from "../db/VertexSchema";
import EdgeSchema from "../db/EdgeSchema";

const { mongoURI } = config;

mongoose.connect(mongoURI!, {
  dbName: 'harborMaster'
})
  .then(() => console.log('Connected to Harbor Master database.'))
  .catch((err: Error) => console.log(err));


export const UserModel = mongoose.model('user', UserSchema);
export const ProjectModel = mongoose.model('project', ProjectConfigSchema);
export const VertexModel = mongoose.model('vertex', VertexSchema);
export const EdgeModel = mongoose.model('edge', EdgeSchema);