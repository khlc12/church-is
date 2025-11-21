import app from './app.js';
import config from './config.js';

const server = app.listen(config.port, () => {
  console.log(`API server listening on port ${config.port}`);
});

process.on('SIGINT', () => {
  server.close(() => {
    process.exit(0);
  });
});
