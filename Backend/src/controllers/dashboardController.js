import Assignment from "../models/Assignment.js";
import Attendance from "../models/Attendance.js";
import Course from "../models/Course.js";
import Event from "../models/Event.js";
import Grade from "../models/Grade.js";
import Subject from "../models/Subject.js";
import User from "../models/User.js";

// Issue #5: Use MongoDB aggregation instead of loading entire collections into memory
export const getSummary = async (req, res) => {
  const [
    students,
    faculty,
    admins,
    courses,
    subjects,
    eventCount,
    assignments,
    attendanceStats,
    gradeStats,
    eventRegistrationStats,
  ] = await Promise.all([
    User.countDocuments({ role: "student" }),
    User.countDocuments({ role: "faculty" }),
    User.countDocuments({ role: "admin" }),
    Course.countDocuments(),
    Subject.countDocuments(),
    Event.countDocuments(),
    Assignment.countDocuments(),

    // Aggregate attendance stats in the database
    Attendance.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          present: {
            $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] },
          },
        },
      },
    ]),

    // Aggregate grade stats in the database
    Grade.aggregate([
      {
        $group: {
          _id: null,
          totalPercentage: {
            $sum: { $multiply: [{ $divide: ["$score", "$maxScore"] }, 100] },
          },
          count: { $sum: 1 },
        },
      },
    ]),

    // Aggregate event registration counts in the database
    Event.aggregate([
      {
        $group: {
          _id: null,
          totalRegistrations: { $sum: "$registeredCount" },
        },
      },
    ]),
  ]);

  const attendanceData = attendanceStats[0] || { total: 0, present: 0 };
  const attendancePercentage = attendanceData.total
    ? Math.round((attendanceData.present / attendanceData.total) * 100)
    : 0;

  const gradeData = gradeStats[0] || { totalPercentage: 0, count: 0 };
  const averageGrade = gradeData.count
    ? Math.round(gradeData.totalPercentage / gradeData.count)
    : 0;

  const registrationData = eventRegistrationStats[0] || { totalRegistrations: 0 };

  res.json({
    students,
    faculty,
    admins,
    users: students + faculty + admins,
    courses,
    subjects,
    events: eventCount,
    eventRegistrations: registrationData.totalRegistrations,
    assignments,
    attendancePercentage,
    averageGrade,
  });
};
