class Logger {
  logWithLevel(level, message, args = "") {
    // eslint-disable-next-line no-console
    console[level](`[${level.toUpperCase()}] ${message} ${args ? args : ""}`);
  }

  info(message, args) {
    this.logWithLevel("info", message, args);
  }

  warn(message, args) {
    this.logWithLevel("warn", message, args);
  }

  error(message, args) {
    this.logWithLevel("error", message, args);
  }
}

export const logger = new Logger();
