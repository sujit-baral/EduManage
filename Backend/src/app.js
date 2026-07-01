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

const defaultOrigins = [
  "http://localhost:5173",
  "https://edu-manage-seven-pearl.vercel.app",
  "https://college-management-frontend.onrender.com"
];

const allowedOrigins = [...defaultOrigins];

if (process.env.CLIENT_URL) {
  process.env.CLIENT_URL.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
    .forEach((origin) => {
      if (!allowedOrigins.includes(origin)) {
        allowedOrigins.push(origin);
      }
    });
}

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
