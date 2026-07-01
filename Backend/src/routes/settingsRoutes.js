import express from "express";
import { getSettings, updateSettings } from "../controllers/settingsController.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import { updateSettingsSchema } from "../validators/schemas.js";

const router = express.Router();

router
  .route("/")
  .get(protect, authorize("admin"), asyncHandler(getSettings))
  .patch(protect, authorize("admin"), validate(updateSettingsSchema), asyncHandler(updateSettings));

export default router;
