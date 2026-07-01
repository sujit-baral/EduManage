import express from "express";
import {
  createEvent,
  deleteEvent,
  getEvents,
  getMyEventRegistrations,
  registerForEvent,
} from "../controllers/eventController.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { validateObjectId } from "../middleware/validateObjectId.js";
import validate from "../middleware/validate.js";
import { createEventSchema } from "../validators/schemas.js";

const router = express.Router();

router.route("/").get(protect, asyncHandler(getEvents)).post(protect, authorize("admin", "faculty"), validate(createEventSchema), asyncHandler(createEvent));
router.get("/registrations/me", protect, asyncHandler(getMyEventRegistrations));
router.route("/:id").delete(protect, authorize("admin", "faculty"), validateObjectId(), asyncHandler(deleteEvent));
router.post("/:id/register", protect, validateObjectId(), asyncHandler(registerForEvent));

export default router;
