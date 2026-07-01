import logger from "../utils/logger.js";

export const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Log the full error server-side
  logger.error("Request error", {
    statusCode,
    message: err.message,
    url: req.originalUrl,
    method: req.method,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });

  // In production, hide internal error details from the client
  const isServerError = statusCode >= 500;
  const clientMessage =
    process.env.NODE_ENV === "production" && isServerError
      ? "Internal server error"
      : err.message;

  res.status(statusCode).json({
    message: clientMessage,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
