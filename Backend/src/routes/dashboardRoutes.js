import express from "express";
import { getSummary } from "../controllers/dashboardController.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/summary", protect, asyncHandler(getSummary));

export default router;
