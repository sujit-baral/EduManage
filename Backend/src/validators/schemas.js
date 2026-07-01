import { z } from "zod";

// ─── Shared Helpers ───────────────────────────────────────────────────
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const objectId = z.string().regex(objectIdRegex, "Invalid ObjectId format");

// ─── Auth Schemas ─────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["student", "faculty", "admin"], { message: "Role must be student, faculty, or admin" }),
});

export const registerStudentSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  studentId: z.string().min(1, "Student ID is required").optional(),
  course: z.string().optional(),
  semester: z.number().int().min(1).max(12).optional(),
  phone: z.string().optional(),
});

// ─── User Schemas ─────────────────────────────────────────────────────
export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["student", "faculty", "admin"]),
  phone: z.string().optional(),
  address: z.string().optional(),
  studentId: z.string().optional(),
  facultyId: z.string().optional(),
  adminId: z.string().optional(),
  course: z.string().optional(),
  semester: z.number().int().min(1).max(12).optional().nullable(),
  department: z.string().optional(),
  designation: z.string().optional(),
  subjects: z.array(z.string()).optional(),
  permissions: z.array(z.string()).optional(),
  status: z.enum(["active", "inactive"]).optional(),
  avatar: z.string().optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(["student", "faculty", "admin"]).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  studentId: z.string().optional(),
  facultyId: z.string().optional(),
  adminId: z.string().optional(),
  course: z.string().optional(),
  semester: z.number().int().min(1).max(12).optional().nullable(),
  department: z.string().optional(),
  designation: z.string().optional(),
  subjects: z.array(z.string()).optional(),
  permissions: z.array(z.string()).optional(),
  status: z.enum(["active", "inactive"]).optional(),
  avatar: z.string().optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  department: z.string().optional(),
  designation: z.string().optional(),
  subjects: z.array(z.string()).optional(),
  avatar: z.string().optional(),
});

// ─── Course Schemas ───────────────────────────────────────────────────
export const createCourseSchema = z.object({
  name: z.string().min(1, "Course name is required").max(200),
  code: z.string().min(1, "Course code is required").max(20),
  duration: z.number().int().positive().optional(),
  description: z.string().max(1000).optional(),
});

export const createSubjectSchema = z.object({
  name: z.string().min(1, "Subject name is required").max(200),
  code: z.string().min(1, "Subject code is required").max(20),
  credits: z.number().int().positive("Credits must be positive"),
  semester: z.number().int().min(1, "Semester is required"),
  courseId: objectId,
});

// ─── Academic Schemas ─────────────────────────────────────────────────
export const saveAttendanceSchema = z.object({
  subjectId: objectId,
  date: z.string().min(1, "Date is required"),
  attendance: z
    .array(
      z.object({
        studentId: objectId,
        status: z.enum(["present", "absent", "late"]),
      })
    )
    .min(1, "At least one attendance record is required"),
});

export const createAssignmentSchema = z.object({
  title: z.string().min(1, "Title is required").max(300),
  description: z.string().max(2000).optional(),
  subjectId: objectId,
  dueDate: z.string().min(1, "Due date is required"),
  maxScore: z.number().positive().optional(),
  fileUrl: z.string().optional(),
});

export const createMaterialSchema = z.object({
  title: z.string().min(1, "Title is required").max(300),
  type: z.enum(["lecture", "assignment", "reference", "exam"]).optional(),
  subjectId: objectId,
  fileName: z.string().optional(),
  fileSize: z.string().optional(),
});

export const submitAssignmentSchema = z.object({
  assignmentId: objectId,
  studentId: objectId.optional(),
  fileName: z.string().optional(),
});

export const gradeSubmissionSchema = z.object({
  grade: z.number().min(0).optional(),
  maxGrade: z.number().positive().optional(),
  feedback: z.string().max(2000).optional(),
});

// ─── Event Schemas ────────────────────────────────────────────────────
export const createEventSchema = z.object({
  title: z.string().min(1, "Title is required").max(300),
  description: z.string().max(2000).optional(),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(1, "Location is required").max(200),
  type: z.enum(["workshop", "seminar", "cultural", "sports"]).optional(),
  maxParticipants: z.number().int().positive().optional().nullable(),
  status: z.enum(["upcoming", "ongoing", "completed", "cancelled"]).optional(),
  createdBy: z.string().optional(),
});

// ─── Leave Request Schemas ────────────────────────────────────────────
export const createLeaveRequestSchema = z.object({
  type: z.string().min(1, "Leave type is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  reason: z.string().min(1, "Reason is required").max(1000),
});

export const reviewLeaveRequestSchema = z.object({
  status: z.enum(["approved", "rejected"], { message: "Status must be approved or rejected" }),
  reviewNote: z.string().max(1000).optional(),
});

// ─── Settings Schema ──────────────────────────────────────────────────
export const updateSettingsSchema = z.object({
  systemName: z.string().max(200).optional(),
  systemEmail: z.string().email().optional(),
  timezone: z.string().optional(),
  dateFormat: z.string().optional(),
  passwordMinLength: z.number().int().min(4).max(32).optional(),
  sessionTimeout: z.number().int().min(5).max(1440).optional(),
  twoFactorAuth: z.boolean().optional(),
  loginAttempts: z.number().int().min(1).max(10).optional(),
  emailNotifications: z.boolean().optional(),
  smsNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  attendanceAlerts: z.boolean().optional(),
  gradeAlerts: z.boolean().optional(),
  eventReminders: z.boolean().optional(),
  academicYear: z.string().optional(),
  semesterSystem: z.boolean().optional(),
  gradingScale: z.string().optional(),
  attendanceThreshold: z.number().int().min(0).max(100).optional(),
  maxAbsences: z.number().int().min(0).max(365).optional(),
});

// ─── Report Schema ────────────────────────────────────────────────────
export const exportReportSchema = z.object({
  reportType: z.string().min(1, "Report type is required"),
  start: z.string().optional(),
  end: z.string().optional(),
});
