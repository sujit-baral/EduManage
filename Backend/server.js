import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import validateEnv from "./src/utils/envCheck.js";
import logger from "./src/utils/logger.js";

// Issue #1: Validate required env vars before starting
validateEnv();

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  const server = app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
  });

  // Issue #14: Graceful shutdown on SIGTERM/SIGINT
  const gracefulShutdown = (signal) => {
    logger.info(`${signal} received, shutting down gracefully`);
    server.close(() => {
      logger.info("HTTP server closed");
      import("mongoose").then(({ default: mongoose }) => {
        mongoose.connection.close(false).then(() => {
          logger.info("MongoDB connection closed");
          process.exit(0);
        });
      });
    });

    // Force close after 10 seconds
    setTimeout(() => {
      logger.error("Forced shutdown after timeout");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
});
