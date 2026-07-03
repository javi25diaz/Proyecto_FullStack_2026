const mongoose = require('mongoose');

let connectionPromise = null;

const conectarDB = async () => {
  if (connectionPromise) return connectionPromise;

  connectionPromise = mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('MongoDB conectado correctamente');
  }).catch((error) => {
    console.error('Error de conexión MongoDB:', error);
    connectionPromise = null;
    if (require.main === module) {
      process.exit(1);
    }
    throw error;
  });

  return connectionPromise;
};

module.exports = conectarDB;