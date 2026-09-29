require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/config/database');
const { validateConfig } = require('./src/config/environment');
const mongoose = require('mongoose');

const start = async () => {
  const config = validateConfig();
  await connectDB(config.MONGODB_URI);

  const server = app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
  });

  const shutdown = (signal) => {
    console.log(`${signal} received; shutting down`);
    server.close(async () => {
      await mongoose.disconnect();
      process.exitCode = 0;
    });
  };

  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));
};

if (require.main === module) {
  start().catch((error) => {
    // El mensaje indica qué configuración falta; no incluye valores secretos
    console.error('Server startup failed:', error.name, error.message);
    process.exitCode = 1;
  });
}

module.exports = { start };
