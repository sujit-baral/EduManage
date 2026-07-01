import mongoose from "mongoose";

const DEFAULT_DB_NAME = "college_management";

const buildMongoUri = () => {
  const rawUri =
    process.env.MONGO_URI || `mongodb://127.0.0.1:27017/${DEFAULT_DB_NAME}`;
  const dbName = (process.env.MONGO_DB_NAME || DEFAULT_DB_NAME).replace(/^\/+/, "");

  if (rawUri.includes("mongodb.net/") && !rawUri.includes("mongodb.net/?")) {
    return rawUri.replace(/mongodb\.net\/+([^?]*)/, (_, path) => {
      const cleanPath = path.replace(/^\/+/, "") || dbName;
      return `mongodb.net/${cleanPath}`;
    });
  }

  if (rawUri.includes("mongodb.net/?") || rawUri.endsWith("mongodb.net/")) {
    return rawUri.replace("mongodb.net/", `mongodb.net/${dbName}`);
  }

  if (rawUri.endsWith("mongodb.net")) {
    return `${rawUri}/${dbName}`;
  }

  return rawUri;
};

const connectDB = async () => {
  try {
    const mongoUri = buildMongoUri();
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
