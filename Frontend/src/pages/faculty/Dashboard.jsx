import React from "react";
import {
  Users,
  BookOpen,
  Calendar,
  TrendingUp,
  Clock,
  FileText,
} from "lucide-react";
import Card from "../../components/common/Card";
import { useApiResource } from "../../hooks/useApiResource";
import { api } from "../../services/api";

const FacultyDashboard = () => {
  const { data: students } = useApiResource(() => api.getUsers().then((users) => users.filter((user) => user.role === "student")));
  const { data: subjects } = useApiResource(api.getSubjects);
  const mySubjects = subjects.slice(0, 3);
  const upcomingClasses = [
    { subject: "Data Structures", time: "09:00 AM", students: 45 },
    { subject: "Algorithms", time: "11:00 AM", students: 40 },
    { subject: "Database Systems", time: "02:00 PM", students: 38 },
  ];

  const recentSubmissions = [
    {
      student: "Alex Johnson",
      assignment: "Binary Search Tree Implementation",
      submitted: "2 hours ago",
    },
    {
      student: "Sarah Williams",
      assignment: "Sorting Algorithms Analysis",
      submitted: "5 hours ago",
    },
  ];

  const attendanceStats = {
    totalClasses: 15,
    avgAttendance: 87,
    highAttendance: 12,
    lowAttendance: 3,
  };

  return (
    <div className="space-y-8 font-sans antialiased">
      {/* Welcome Block */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-display">
          Faculty Dashboard
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          Welcome back! Here's your teaching overview.
        </p>
      </div>

      {/* ---------------------------------------Stats Grid --------------------------------------*/}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">My Subjects</p>
              <p className="text-3xl font-bold text-slate-900 font-display">
                {mySubjects.length}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50/80 text-indigo-650 border border-indigo-100/30">
              <BookOpen className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Students</p>
              <p className="text-3xl font-bold text-slate-900 font-display">
                {students.length}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50/80 text-emerald-600 border border-emerald-100/30">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Avg Attendance</p>
              <p className="text-3xl font-bold text-slate-900 font-display">
                {attendanceStats.avgAttendance}%
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50/80 text-violet-600 border border-violet-100/30">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Classes Today</p>
              <p className="text-3xl font-bold text-slate-900 font-display">
                {upcomingClasses.length}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50/80 text-amber-600 border border-amber-100/30">
              <Calendar className="h-6 w-6" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/*---------------------------------- Today's Schedule -------------------------------------*/}
        <Card
          title="Today's Classes"
          subtitle="Your scheduled classes for today"
        >
          <div className="space-y-4">
            {upcomingClasses.map((cls, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm sm:text-base">{cls.subject}</p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      {cls.students} students enrolled
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5 text-slate-500 font-medium">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span className="text-xs">{cls.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/*------------------------------- Recent Submissions ---------------------------------------*/}
        <Card
          title="Recent Submissions"
          subtitle="Latest assignment submissions"
        >
          <div className="space-y-4">
            {recentSubmissions.map((submission, index) => (
              <div
                key={index}
                className="flex items-start space-x-3.5 p-4 bg-slate-50/50 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <FileText className="h-5 w-5 text-emerald-600 mt-0.5" />
                <div className="flex-grow space-y-0.5">
                  <p className="font-semibold text-slate-900 text-sm sm:text-base">
                    {submission.student}
                  </p>
                  <p className="text-xs text-slate-500 leading-normal">
                    {submission.assignment}
                  </p>
                  <p className="text-xxs text-slate-400 font-medium mt-0.5">
                    {submission.submitted}
                  </p>
                </div>
                <button className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition cursor-pointer shadow-md shadow-indigo-500/10">
                  Review
                </button>
              </div>
            ))}
            <div className="text-center pt-2">
              <button className="text-indigo-600 text-xs font-bold hover:text-indigo-850 transition cursor-pointer">
                View all submissions →
              </button>
            </div>
          </div>
        </Card>

        {/*--------------------------------- My Subjects--------------------------------- */}
        <Card
          title="My Subjects"
          subtitle="Subjects you're teaching this semester"
        >
          <div className="space-y-3">
            {mySubjects.map((subject) => (
              <div
                key={subject.id}
                className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div>
                  <p className="font-semibold text-slate-900 text-sm sm:text-base">{subject.name}</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    {subject.code} • {subject.credits} credits • Semester{" "}
                    {subject.semester}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition cursor-pointer shadow-md shadow-emerald-500/10">
                    Attendance
                  </button>
                  <button className="px-3.5 py-1.5 bg-indigo-650 hover:bg-indigo-755 text-white text-xs font-semibold rounded-xl transition cursor-pointer shadow-md shadow-indigo-500/10">
                    Materials
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/*--------------------------------- Quick Actions---------------------------------- */}
        <Card title="Quick Actions" subtitle="Common tasks you can perform">
          <div className="grid grid-cols-2 gap-4">
            <button className="group relative flex flex-col items-center justify-center p-5 rounded-2xl border border-slate-150 bg-white hover:bg-indigo-50/20 hover:border-indigo-200 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-650 group-hover:scale-105 transition duration-200">
                <Users className="h-5.5 w-5.5" />
              </div>
              <span className="text-sm font-semibold text-slate-800 group-hover:text-indigo-950">
                Mark Attendance
              </span>
            </button>
            <button className="group relative flex flex-col items-center justify-center p-5 rounded-2xl border border-slate-150 bg-white hover:bg-emerald-50/20 hover:border-emerald-200 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-650 group-hover:scale-105 transition duration-200">
                <FileText className="h-5.5 w-5.5" />
              </div>
              <span className="text-sm font-semibold text-slate-800 group-hover:text-emerald-955">
                Upload Materials
              </span>
            </button>
            <button className="group relative flex flex-col items-center justify-center p-5 rounded-2xl border border-slate-150 bg-white hover:bg-violet-50/20 hover:border-violet-200 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-650 group-hover:scale-105 transition duration-200">
                <TrendingUp className="h-5.5 w-5.5" />
              </div>
              <span className="text-sm font-semibold text-slate-800 group-hover:text-violet-955">
                Grade Assignments
              </span>
            </button>
            <button className="group relative flex flex-col items-center justify-center p-5 rounded-2xl border border-slate-150 bg-white hover:bg-amber-50/20 hover:border-amber-200 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-650 group-hover:scale-105 transition duration-200">
                <Calendar className="h-5.5 w-5.5" />
              </div>
              <span className="text-sm font-semibold text-slate-800 group-hover:text-amber-955">
                Schedule Event
              </span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FacultyDashboard;
