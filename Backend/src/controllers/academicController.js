import Assignment from "../models/Assignment.js";
import Attendance from "../models/Attendance.js";
import Grade from "../models/Grade.js";
import Material from "../models/Material.js";
import Submission from "../models/Submission.js";

export const getAttendance = async (req, res) => {
  const filter = req.user?.role === "student" ? { studentId: req.user.id } : {};
  res.json(await Attendance.find(filter).sort({ date: -1 }));
};

export const saveAttendance = async (req, res) => {
  const { subjectId, date, attendance } = req.body;
  const operations = attendance.map((record) => ({
    updateOne: {
      filter: { studentId: record.studentId, subjectId, date: new Date(date) },
      update: { $set: { status: record.status } },
      upsert: true,
    },
  }));
  if (operations.length) await Attendance.bulkWrite(operations);
  res.status(201).json({ message: "Attendance saved" });
};

export const getGrades = async (req, res) => {
  const filter = req.user?.role === "student" ? { studentId: req.user.id } : {};
  res.json(await Grade.find(filter).sort({ date: -1 }));
};

export const getAssignments = async (req, res) => {
  res.json(await Assignment.find().sort({ dueDate: 1 }));
};

export const createAssignment = async (req, res) => {
  res.status(201).json(await Assignment.create(req.body));
};

export const getMaterials = async (req, res) => {
  res.json(await Material.find().sort({ uploadDate: -1 }));
};

export const createMaterial = async (req, res) => {
  const material = await Material.create(req.body);
  res.status(201).json(material);
};

export const deleteMaterial = async (req, res) => {
  const material = await Material.findByIdAndDelete(req.params.id);
  if (!material) {
    res.status(404);
    throw new Error("Material not found");
  }
  res.json({ message: "Material deleted" });
};

export const getSubmissions = async (req, res) => {
  const filter = req.user?.role === "student" ? { studentId: req.user.id } : {};
  res.json(await Submission.find(filter).sort({ submittedAt: -1 }));
};

export const submitAssignment = async (req, res) => {
  if (req.user?.role === "student" && req.body.studentId && req.body.studentId !== req.user.id) {
    res.status(403);
    throw new Error("Cannot submit assignment for another student");
  }
  
  const studentId = req.user?.role === "student" ? req.user.id : req.body.studentId;
  const submission = await Submission.create({
    ...req.body,
    studentId,
  });
  res.status(201).json(submission);
};

export const gradeSubmission = async (req, res) => {
  const submission = await Submission.findByIdAndUpdate(
    req.params.id,
    { ...req.body, status: "graded" },
    { new: true, runValidators: true }
  );
  if (!submission) {
    res.status(404);
    throw new Error("Submission not found");
  }
  res.json(submission);
};
