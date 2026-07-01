import express from "express";
import {
  createAssignment,
  createMaterial,
  deleteMaterial,
  getAssignments,
  getAttendance,
  getGrades,
  getMaterials,
  getSubmissions,
  gradeSubmission,
  saveAttendance,
  submitAssignment,
} from "../controllers/academicController.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { validateObjectId } from "../middleware/validateObjectId.js";
import validate from "../middleware/validate.js";
import {
  saveAttendanceSchema,
  createAssignmentSchema,
  createMaterialSchema,
  submitAssignmentSchema,
  gradeSubmissionSchema,
} from "../validators/schemas.js";

const router = express.Router();

router
  .route("/attendance")
  .get(protect, asyncHandler(getAttendance))
  .post(protect, authorize("faculty", "admin"), validate(saveAttendanceSchema), asyncHandler(saveAttendance));
router.get("/grades", protect, asyncHandler(getGrades));
router
  .route("/assignments")
  .get(protect, asyncHandler(getAssignments))
  .post(protect, authorize("faculty", "admin"), validate(createAssignmentSchema), asyncHandler(createAssignment));
router
  .route("/materials")
  .get(protect, asyncHandler(getMaterials))
  .post(protect, authorize("faculty", "admin"), validate(createMaterialSchema), asyncHandler(createMaterial));
router.delete("/materials/:id", protect, authorize("faculty", "admin"), validateObjectId(), asyncHandler(deleteMaterial));
router.route("/submissions").get(protect, asyncHandler(getSubmissions)).post(protect, authorize("student"), validate(submitAssignmentSchema), asyncHandler(submitAssignment));
router.patch("/submissions/:id/grade", protect, authorize("faculty", "admin"), validateObjectId(), validate(gradeSubmissionSchema), asyncHandler(gradeSubmission));

export default router;
