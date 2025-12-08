const mongoose = require('mongoose');

async function connectDB(uri) {
  if (!uri) {
    throw new Error('URI do MongoDB não fornecida.');
  }

  mongoose.set('strictQuery', false);

  return mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

module.exports = connectDB;
