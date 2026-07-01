import Course from "../models/Course.js";
import Subject from "../models/Subject.js";

export const getCourses = async (req, res) => {
  res.json(await Course.find().sort({ name: 1 }));
};

export const createCourse = async (req, res) => {
  const course = await Course.create(req.body);
  res.status(201).json(course);
};

export const deleteCourse = async (req, res) => {
  await Subject.deleteMany({ courseId: req.params.id });
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }
  res.json({ message: "Course deleted" });
};

export const getSubjects = async (req, res) => {
  res.json(await Subject.find().sort({ semester: 1, name: 1 }));
};

export const createSubject = async (req, res) => {
  const subject = await Subject.create(req.body);
  res.status(201).json(subject);
};

export const deleteSubject = async (req, res) => {
  const subject = await Subject.findByIdAndDelete(req.params.id);
  if (!subject) {
    res.status(404);
    throw new Error("Subject not found");
  }
  res.json({ message: "Subject deleted" });
};
