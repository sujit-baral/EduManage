import express from "express";
import { login, me, registerStudent } from "../controllers/authController.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { protect } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import { loginSchema, registerStudentSchema } from "../validators/schemas.js";

const router = express.Router();

router.post("/register", validate(registerStudentSchema), asyncHandler(registerStudent));
router.post("/login", validate(loginSchema), asyncHandler(login));
router.get("/me", protect, asyncHandler(me));

export default router;
