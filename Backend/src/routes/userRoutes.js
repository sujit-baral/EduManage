import express from "express";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
  updateProfile,
} from "../controllers/userController.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { validateObjectId } from "../middleware/validateObjectId.js";
import validate from "../middleware/validate.js";
import { createUserSchema, updateUserSchema, updateProfileSchema } from "../validators/schemas.js";

const router = express.Router();

router.patch("/profile", protect, validate(updateProfileSchema), asyncHandler(updateProfile));
router
  .route("/")
  .get(protect, asyncHandler(getUsers))
  .post(protect, authorize("admin"), validate(createUserSchema), asyncHandler(createUser));
router
  .route("/:id")
  .patch(protect, authorize("admin"), validateObjectId(), validate(updateUserSchema), asyncHandler(updateUser))
  .delete(protect, authorize("admin"), validateObjectId(), asyncHandler(deleteUser));

export default router;
