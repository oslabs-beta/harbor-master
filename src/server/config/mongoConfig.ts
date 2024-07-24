import mongoose, { Schema } from "mongoose";
import config from './envConfig'
import UserSchema from '../db/UserSchema';
import ProjectConfigSchema from '../db/ProjectConfigSchema';

const { mongoURI } = config;

mongoose.connect(mongoURI!, {
  dbName: 'harborMaster'
})
  .then(() => console.log('Connected to Harbor Master database.'))
  .catch((err: Error) => console.log(err));

export const UserModel = mongoose.model('user', UserSchema);
export const ProjectModel = mongoose.model('project', ProjectConfigSchema);