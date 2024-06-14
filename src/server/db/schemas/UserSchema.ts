import mongoose from 'mongoose';
import User from 'interfaces/User';

const Schema = mongoose.Schema;

const userSchema = new Schema<User>({
  githubHandle: String,
  email: String,
  googleIamSecretKey: String
});

module.exports = userSchema;