import mongoose from 'mongoose';
import User from 'interfaces/User';

const Schema = mongoose.Schema;

const UserSchema = new Schema<User>({
  githubHandle: String,
  email: String,
});

export default UserSchema;