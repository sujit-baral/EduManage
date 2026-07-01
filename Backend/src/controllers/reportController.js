import Attendance from "../models/Attendance.js";
import Event from "../models/Event.js";
import Grade from "../models/Grade.js";
import User from "../models/User.js";

export const exportReport = async (req, res) => {
  const { reportType, start, end } = req.body;
  const dateFilter = {};
  if (start || end) {
    dateFilter.$gte = start ? new Date(start) : undefined;
    dateFilter.$lte = end ? new Date(end) : undefined;
    Object.keys(dateFilter).forEach((key) => dateFilter[key] === undefined && delete dateFilter[key]);
  }

  const [students, faculty, attendance, grades, events] = await Promise.all([
    User.countDocuments({ role: "student" }),
    User.countDocuments({ role: "faculty" }),
    Attendance.find(Object.keys(dateFilter).length ? { date: dateFilter } : {}),
    Grade.find(Object.keys(dateFilter).length ? { date: dateFilter } : {}),
    Event.find(Object.keys(dateFilter).length ? { date: dateFilter } : {}),
  ]);

  res.json({
    reportType,
    period: { start, end },
    generatedAt: new Date().toISOString(),
    summary: {
      students,
      faculty,
      attendanceRecords: attendance.length,
      gradeRecords: grades.length,
      events: events.length,
      registrations: events.reduce((sum, event) => sum + event.registeredCount, 0),
    },
    message: "Report generated successfully",
  });
};
