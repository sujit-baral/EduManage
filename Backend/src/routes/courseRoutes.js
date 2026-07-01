import express from "express";
import {
  createCourse,
  createSubject,
  deleteCourse,
  deleteSubject,
  getCourses,
  getSubjects,
} from "../controllers/courseController.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { validateObjectId } from "../middleware/validateObjectId.js";
import validate from "../middleware/validate.js";
import { createCourseSchema, createSubjectSchema } from "../validators/schemas.js";

const router = express.Router();

router
  .route("/subjects")
  .get(protect, asyncHandler(getSubjects))
  .post(protect, authorize("admin"), validate(createSubjectSchema), asyncHandler(createSubject));
router.route("/subjects/:id").delete(protect, authorize("admin"), validateObjectId(), asyncHandler(deleteSubject));
router
  .route("/")
  .get(protect, asyncHandler(getCourses))
  .post(protect, authorize("admin"), validate(createCourseSchema), asyncHandler(createCourse));
router.route("/:id").delete(protect, authorize("admin"), validateObjectId(), asyncHandler(deleteCourse));

export default router;
