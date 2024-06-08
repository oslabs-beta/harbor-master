import mongoose from 'mongoose';
import User from 'interfaces/User';

const Schema = mongoose.Schema;

const userSchema = new Schema<User>({
  githubHandle: { type: String, required: true },
  email: {type: String, required: true },
  googleIamSecretKey: { type: String, required: true }
});

module.exports = userSchema;