import logger from "./logger.js";

/**
 * Validate that all required environment variables are present.
 * Crashes the process early if any are missing — prevents running with insecure defaults.
 */

const REQUIRED_ENV_VARS = ["JWT_SECRET", "MONGO_URI"];

const validateEnv = () => {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    logger.error("Missing required environment variables", { missing });
    console.error(`FATAL: Missing required env vars: ${missing.join(", ")}`);
    process.exit(1);
  }

  if (process.env.JWT_SECRET === "change_this_secret_before_production" && process.env.NODE_ENV === "production") {
    logger.error("JWT_SECRET is set to the default example value in production");
    console.error("FATAL: JWT_SECRET must be changed from the default before deploying to production");
    process.exit(1);
  }

  logger.info("Environment variables validated");
};

export default validateEnv;
