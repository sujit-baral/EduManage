import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import routes from "./routes/index.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

// Apply Security Headers
app.use(helmet());

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

// Use morgan only in development
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Rate limiting middleware to prevent brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests from this IP, please try again after 15 minutes" },
});
app.use("/api", limiter);

app.get("/", (req, res) => {
  res.json({ message: "College Management API is running" });
});

app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

export default app;
