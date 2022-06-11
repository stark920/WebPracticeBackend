const Console = require('../utils/Console');

// sync
process.on('uncaughtException', (err) => {
  Console.error('Uncaught Exception:\n', err);
  process.exit(1);
});
// async
process.on('unhandledRejection', (reason, promise) => {
  Console.error('Unhandled Rejection!');
  Console.error(reason);
  Console.error(promise);
  process.exit(1);
});
