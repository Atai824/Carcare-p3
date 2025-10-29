require('dotenv').config();

const {
  MONGO_URI = 'mongodb://127.0.0.1:27017/carcare_p3',
  SESSION_SECRET = '9c1f3b7a2e5b4c1f0a7d9e8c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7',
  NODE_ENV = 'development',
  PORT = 4000,
  CLIENT_ORIGIN = 'http://localhost:5173',
} = process.env;

const IN_PROD = process.env.IN_PROD === 'true';

module.exports = { MONGO_URI, SESSION_SECRET, NODE_ENV, PORT, CLIENT_ORIGIN, IN_PROD };
