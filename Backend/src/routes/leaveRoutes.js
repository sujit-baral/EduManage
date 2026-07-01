import express from "express";
import {
  createLeaveRequest,
  getLeaveRequests,
  reviewLeaveRequest,
} from "../controllers/leaveController.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { validateObjectId } from "../middleware/validateObjectId.js";
import validate from "../middleware/validate.js";
import { createLeaveRequestSchema, reviewLeaveRequestSchema } from "../validators/schemas.js";

const router = express.Router();

router
  .route("/")
  .get(protect, asyncHandler(getLeaveRequests))
  .post(protect, authorize("student"), validate(createLeaveRequestSchema), asyncHandler(createLeaveRequest));
router.patch(
  "/:id/review",
  protect,
  authorize("admin", "faculty"),
  validateObjectId(),
  validate(reviewLeaveRequestSchema),
  asyncHandler(reviewLeaveRequest)
);

export default router;
