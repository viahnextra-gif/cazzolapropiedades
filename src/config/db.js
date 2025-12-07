const mongoose = require('mongoose');

// Centralized MongoDB connection helper.
// Uses the URI defined in environment variables and exposes a reusable promise-based connection.
async function connectDB(uri) {
  if (!uri) {
    throw new Error('Defina a variável de ambiente MONGODB_URI para conectar ao banco.');
  }

  // serverSelectionTimeoutMS evita esperas longas em ambientes sem banco configurado.
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });
}

module.exports = connectDB;
