require('dotenv').config();

const {
  MONGO_URI = 'mongodb://127.0.0.1:27017/carcare_p3',
  SESSION_SECRET = 'dev_secret_change_me',
  NODE_ENV = 'development',
  PORT = 4000,
  CLIENT_ORIGIN = 'http://localhost:5173',
} = process.env;

const IN_PROD = NODE_ENV === 'production';

module.exports = { MONGO_URI, SESSION_SECRET, NODE_ENV, PORT, CLIENT_ORIGIN, IN_PROD };
