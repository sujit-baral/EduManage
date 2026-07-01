import express from "express";
import { exportReport } from "../controllers/reportController.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import { exportReportSchema } from "../validators/schemas.js";

const router = express.Router();

router.post("/export", protect, authorize("admin"), validate(exportReportSchema), asyncHandler(exportReport));

export default router;
