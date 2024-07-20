import dotenv from 'dotenv';

dotenv.config();

const { NODE_ENV, PORT, MONGO_URI, SECRET_KEY, SECRET_IV, ENCRYPTION_METHOD } = process.env;

export default {
  env: NODE_ENV,
  port: PORT,
  mongoURI: MONGO_URI,
  secretKey: SECRET_KEY,
  secretIV: SECRET_IV,
  encryptionMethod: ENCRYPTION_METHOD
};