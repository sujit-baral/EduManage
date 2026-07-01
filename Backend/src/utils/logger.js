/**
 * Lightweight structured logger.
 * Outputs JSON in production, pretty text in development.
 */

const isProd = process.env.NODE_ENV === "production";

const formatMessage = (level, message, meta = {}) => {
  if (isProd) {
    return JSON.stringify({ level, message, ...meta, timestamp: new Date().toISOString() });
  }
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
  return `[${level.toUpperCase()}] ${message}${metaStr}`;
};

const logger = {
  info: (message, meta) => console.log(formatMessage("info", message, meta)),
  warn: (message, meta) => console.warn(formatMessage("warn", message, meta)),
  error: (message, meta) => console.error(formatMessage("error", message, meta)),
  debug: (message, meta) => {
    if (!isProd) console.debug(formatMessage("debug", message, meta));
  },
};

export default logger;
