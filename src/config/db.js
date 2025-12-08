const mongoose = require('mongoose');
const env = require('./env');

// Centralized MongoDB connection helper.
// Uses the URI defined in environment variables and exposes a reusable promise-based connection.
async function connectDB(uriOverride) {
  const uri = uriOverride || env.MONGODB_URI || process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('Defina a variável de ambiente MONGODB_URI para conectar ao banco.');
  }

  // serverSelectionTimeoutMS evita esperas longas em ambientes sem banco configurado.
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });

  return mongoose.connection;
}

module.exports = connectDB;
