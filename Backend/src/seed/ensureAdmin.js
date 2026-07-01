import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const ensureAdmin = async () => {
  await connectDB();

  const email = process.env.DEFAULT_ADMIN_EMAIL || "jennifer.davis@admin.edu";
  const password = process.env.DEFAULT_ADMIN_PASSWORD || "password";

  const existingAdmin = await User.findOne({ email });
  if (existingAdmin) {
    console.log(`Admin already exists: ${email}`);
    process.exit(0);
  }

  const admin = await User.create({
    name: "Jennifer Davis",
    email,
    password,
    role: "admin",
    adminId: "ADM001",
    department: "Administration",
    permissions: ["user_management", "course_management", "reports"],
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  });

  console.log(`Admin created: ${admin.email}`);
  process.exit(0);
};

ensureAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});
