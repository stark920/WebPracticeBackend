const Console = {
  isDev: process.env.NODE_ENV,
  log(...args) {
    if (this.isDev) {
      global.console.log(...args);
    }
  },
  error(...args) {
    if (this.isDev) {
      global.console.error(...args);
    }
  },
};

module.exports = Console;
