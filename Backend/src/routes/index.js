import express from "express";
import academicRoutes from "./academicRoutes.js";
import authRoutes from "./authRoutes.js";
import courseRoutes from "./courseRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import eventRoutes from "./eventRoutes.js";
import leaveRoutes from "./leaveRoutes.js";
import libraryRoutes from "./libraryRoutes.js";
import reportRoutes from "./reportRoutes.js";
import settingsRoutes from "./settingsRoutes.js";
import userRoutes from "./userRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/courses", courseRoutes);
router.use("/events", eventRoutes);
router.use("/academic", academicRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/leave-requests", leaveRoutes);
router.use("/library", libraryRoutes);
router.use("/settings", settingsRoutes);
router.use("/reports", reportRoutes);

export default router;
