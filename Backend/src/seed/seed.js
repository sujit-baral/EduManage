import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Assignment from "../models/Assignment.js";
import Attendance from "../models/Attendance.js";
import Course from "../models/Course.js";
import DigitalResource from "../models/DigitalResource.js";
import Event from "../models/Event.js";
import EventRegistration from "../models/EventRegistration.js";
import Grade from "../models/Grade.js";
import LeaveRequest from "../models/LeaveRequest.js";
import LibraryBook from "../models/LibraryBook.js";
import LibraryLoan from "../models/LibraryLoan.js";
import Material from "../models/Material.js";
import Subject from "../models/Subject.js";
import Submission from "../models/Submission.js";
import SystemSettings from "../models/SystemSettings.js";
import User from "../models/User.js";

dotenv.config();

const seed = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany(),
    Course.deleteMany(),
    Subject.deleteMany(),
    Attendance.deleteMany(),
    Grade.deleteMany(),
    Assignment.deleteMany(),
    Event.deleteMany(),
    EventRegistration.deleteMany(),
    Material.deleteMany(),
    Submission.deleteMany(),
    LeaveRequest.deleteMany(),
    LibraryBook.deleteMany(),
    LibraryLoan.deleteMany(),
    DigitalResource.deleteMany(),
    SystemSettings.deleteMany(),
  ]);

  const users = await User.create([
    {
      name: "Alex Johnson",
      email: "alex.johnson@student.edu",
      password: "password",
      role: "student",
      studentId: "CS2021001",
      course: "Computer Science",
      semester: 6,
      phone: "+1-555-0123",
      address: "123 Campus Drive, University City",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    },
    {
      name: "Sarah Williams",
      email: "sarah.williams@student.edu",
      password: "password",
      role: "student",
      studentId: "CS2021002",
      course: "Computer Science",
      semester: 6,
      phone: "+1-555-0124",
      address: "456 University Ave, College Town",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1b5?w=100&h=100&fit=crop&crop=face",
    },
    {
      name: "Dr. Michael Brown",
      email: "michael.brown@faculty.edu",
      password: "password",
      role: "faculty",
      facultyId: "FAC001",
      department: "Computer Science",
      designation: "Professor",
      phone: "+1-555-0200",
      subjects: ["Data Structures", "Algorithms", "Database Systems"],
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
    {
      name: "Jennifer Davis",
      email: "jennifer.davis@admin.edu",
      password: "password",
      role: "admin",
      adminId: "ADM001",
      department: "Administration",
      permissions: ["user_management", "course_management", "reports"],
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    },
  ]);

  const [cs, it] = await Course.create([
    {
      name: "Computer Science",
      code: "CS",
      duration: 4,
      description: "Bachelor of Science in Computer Science",
    },
    {
      name: "Information Technology",
      code: "IT",
      duration: 4,
      description: "Bachelor of Technology in Information Technology",
    },
  ]);

  const [dataStructures, algorithms, databases] = await Subject.create([
    { name: "Data Structures", code: "CS301", credits: 4, semester: 3, courseId: cs._id },
    { name: "Algorithms", code: "CS302", credits: 4, semester: 4, courseId: cs._id },
    { name: "Database Systems", code: "CS401", credits: 3, semester: 4, courseId: cs._id },
  ]);

  const [alex, sarah] = users;

  await Attendance.create([
    { studentId: alex._id, subjectId: dataStructures._id, date: "2024-01-15", status: "present" },
    { studentId: alex._id, subjectId: dataStructures._id, date: "2024-01-16", status: "absent" },
    { studentId: alex._id, subjectId: algorithms._id, date: "2024-01-15", status: "present" },
  ]);

  await Grade.create([
    { studentId: alex._id, subjectId: dataStructures._id, type: "assignment", score: 85, maxScore: 100, date: "2024-01-10" },
    { studentId: alex._id, subjectId: dataStructures._id, type: "midterm", score: 78, maxScore: 100, date: "2024-01-20" },
    { studentId: alex._id, subjectId: algorithms._id, type: "assignment", score: 92, maxScore: 100, date: "2024-01-12" },
  ]);

  const [bst, sorting] = await Assignment.create([
    {
      title: "Binary Search Tree Implementation",
      description: "Implement a binary search tree with insertion, deletion, and traversal operations.",
      subjectId: dataStructures._id,
      dueDate: "2024-02-15",
      maxScore: 100,
      fileUrl: "/assignments/bst-assignment.pdf",
    },
    {
      title: "Sorting Algorithms Analysis",
      description: "Compare the performance of different sorting algorithms with time complexity analysis.",
      subjectId: algorithms._id,
      dueDate: "2024-02-20",
      maxScore: 100,
    },
  ]);

  const [aiWorkshop] = await Event.create([
    {
      title: "AI/ML Workshop",
      description: "Introduction to Machine Learning and Artificial Intelligence concepts.",
      date: "2024-02-25",
      time: "10:00",
      location: "Auditorium A",
      type: "workshop",
      maxParticipants: 50,
      registeredCount: 23,
      status: "upcoming",
    },
    {
      title: "Tech Fest 2024",
      description: "Annual technology festival with competitions and exhibitions.",
      date: "2024-03-15",
      time: "09:00",
      location: "Main Campus",
      type: "cultural",
      maxParticipants: 200,
      registeredCount: 145,
      status: "upcoming",
    },
  ]);

  await EventRegistration.create({
    eventId: aiWorkshop._id,
    studentId: alex._id,
    registeredAt: "2024-02-01",
  });

  await Material.create([
    { title: "Introduction to Data Structures", type: "lecture", subjectId: dataStructures._id, fileSize: "2.3 MB", uploadDate: "2024-01-15", downloads: 45 },
    { title: "BST Implementation Assignment", type: "assignment", subjectId: dataStructures._id, fileSize: "1.1 MB", uploadDate: "2024-01-20", downloads: 32 },
    { title: "Sorting Algorithms Reference", type: "reference", subjectId: algorithms._id, fileSize: "5.7 MB", uploadDate: "2024-01-18", downloads: 67 },
  ]);

  await Submission.create([
    {
      studentId: alex._id,
      assignmentId: bst._id,
      submittedAt: "2024-02-10T14:30:00Z",
      status: "graded",
      grade: 85,
      maxGrade: 100,
      feedback: "Good implementation, but could improve documentation.",
    },
    {
      studentId: sarah._id,
      assignmentId: bst._id,
      submittedAt: "2024-02-12T09:15:00Z",
      status: "submitted",
      maxGrade: 100,
    },
  ]);

  await LeaveRequest.create([
    {
      studentId: alex._id,
      type: "Medical Leave",
      startDate: "2024-01-20",
      endDate: "2024-01-22",
      reason: "Fever and flu symptoms",
      status: "approved",
      submittedAt: "2024-01-18",
      reviewedBy: users[3]._id,
      reviewedAt: "2024-01-19",
    },
    {
      studentId: alex._id,
      type: "Personal Leave",
      startDate: "2024-02-05",
      endDate: "2024-02-05",
      reason: "Family function",
      status: "pending",
      submittedAt: "2024-01-30",
    },
  ]);

  const [algorithmsBook, cleanCode, designPatterns, dbConcepts, networks] = await LibraryBook.create([
    {
      title: "Introduction to Algorithms",
      author: "Thomas H. Cormen",
      isbn: "978-0262033848",
      category: "Computer Science",
      availability: "available",
    },
    {
      title: "Clean Code",
      author: "Robert C. Martin",
      isbn: "978-0132350884",
      category: "Programming",
      availability: "issued",
      issuedTo: alex._id,
      dueDate: "2024-02-15",
    },
    {
      title: "Design Patterns",
      author: "Gang of Four",
      isbn: "978-0201633612",
      category: "Software Engineering",
      availability: "available",
    },
    {
      title: "Database System Concepts",
      author: "Abraham Silberschatz",
      isbn: "978-0073523323",
      category: "Database",
      availability: "reserved",
      reservedBy: alex._id,
    },
    {
      title: "Computer Networks",
      author: "Andrew S. Tanenbaum",
      isbn: "978-0132126953",
      category: "Networking",
      availability: "available",
    },
  ]);

  await LibraryLoan.create([
    {
      bookId: cleanCode._id,
      studentId: alex._id,
      title: cleanCode.title,
      author: cleanCode.author,
      issueDate: "2024-01-15",
      dueDate: "2024-02-15",
      status: "active",
    },
    {
      bookId: dbConcepts._id,
      studentId: alex._id,
      title: dbConcepts.title,
      author: dbConcepts.author,
      issueDate: "2024-01-10",
      dueDate: "2024-02-10",
      status: "overdue",
    },
  ]);

  await DigitalResource.create([
    { name: "IEEE Digital Library", type: "Database", url: "https://ieeexplore.ieee.org" },
    { name: "ACM Digital Library", type: "Database", url: "https://dl.acm.org" },
    { name: "Springer eBooks", type: "eBooks", url: "https://link.springer.com" },
    { name: "O'Reilly Learning", type: "Learning Platform", url: "https://learning.oreilly.com" },
  ]);

  await SystemSettings.create({ key: "default" });

  console.log("Database seeded successfully");
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
