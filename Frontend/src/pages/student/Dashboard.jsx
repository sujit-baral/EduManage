import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  FileText,
  TrendingUp,
  Clock,
  Users,
  ArrowUpRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Card from "../../components/common/Card";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";
import { api } from "../../services/api";

const StudentDashboard = () => {
  const navigate = useNavigate();

  // Issue #22: Fetch data using TanStack Query for caching and background synchronization
  const {
    data: attendance = [],
    isLoading: loadingAttendance,
    error: attendanceError,
    refetch: refetchAttendance,
  } = useQuery({
    queryKey: ["attendance"],
    queryFn: api.getAttendance,
  });

  const {
    data: grades = [],
    isLoading: loadingGrades,
    error: gradesError,
  } = useQuery({
    queryKey: ["grades"],
    queryFn: api.getGrades,
  });

  const {
    data: subjects = [],
    isLoading: loadingSubjects,
    error: subjectsError,
  } = useQuery({
    queryKey: ["subjects"],
    queryFn: api.getSubjects,
  });

  const {
    data: events = [],
    isLoading: loadingEvents,
    error: eventsError,
  } = useQuery({
    queryKey: ["events"],
    queryFn: api.getEvents,
  });

  // Handle errors
  const apiError = attendanceError || gradesError || subjectsError || eventsError;
  if (apiError) {
    return (
      <ErrorState
        message={apiError.message || "Failed to load dashboard data"}
        onRetry={refetchAttendance}
      />
    );
  }

  // Handle loading state
  const isLoading = loadingAttendance || loadingGrades || loadingSubjects || loadingEvents;
  if (isLoading) {
    return <LoadingState message="Loading your student dashboard metrics..." />;
  }

  // Calculate attendance percentage
  const totalClasses = attendance.length;
  const presentClasses = attendance.filter((a) => a.status === "present").length;
  const attendancePercentage =
    totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;

  // Calculate average grade
  const totalGrades = grades.reduce((sum, grade) => sum + (grade.score / grade.maxScore) * 100, 0);
  const averageGrade = totalGrades > 0 ? Math.round(totalGrades / grades.length) : 0;

  const upcomingEvents = events.slice(0, 3);

  // Issue #3 (Visual Analytics): Prepare grade performance data for the Recharts AreaChart
  const chartData = grades
    .slice(0, 6)
    .map((grade) => {
      const subject = subjects.find((s) => s.id === grade.subjectId);
      return {
        name: subject ? subject.name.slice(0, 12) + "..." : "Assessment",
        Percentage: Math.round((grade.score / grade.maxScore) * 100),
      };
    })
    .reverse();

  return (
    // Issue #3 (Transitions): Framer Motion fade-in transition
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-8 font-sans antialiased"
    >
      {/* Welcome Block */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-display">
          Dashboard
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          Welcome back! Here is a summary of your academic progress.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Average Grade</p>
              <p className="text-3xl font-bold text-slate-900 font-display">{averageGrade}%</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50/80 text-indigo-600 border border-indigo-100/30">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Attendance</p>
              <p className="text-3xl font-bold text-slate-900 font-display">{attendancePercentage}%</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50/80 text-emerald-650 border border-emerald-100/30">
              <Clock className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Subjects</p>
              <p className="text-3xl font-bold text-slate-900 font-display">{subjects.length}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50/80 text-violet-650 border border-violet-100/30">
              <BookOpen className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Events</p>
              <p className="text-3xl font-bold text-slate-900 font-display">{events.length}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50/80 text-amber-600 border border-amber-100/30">
              <Calendar className="h-6 w-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Charts & Actions Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Issue #3 (Visual Analytics): Grade Analytics Chart Area */}
        <div className="lg:col-span-2">
          <Card
            title="Grade Analytics"
            subtitle="Performance progression history across recent assessments"
          >
            <div className="h-72 w-full pt-4">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ left: -20, right: 10 }}>
                    <defs>
                      <linearGradient id="gradeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0891b2" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#0891b2" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="name"
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      domain={[0, 100]}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="Percentage"
                      stroke="#0891b2"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#gradeGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-400">
                  No grade history available.
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Quick Actions Panel */}
        <div>
          <Card title="Quick Actions" subtitle="Common tasks you can perform">
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => navigate("/student/assignments")}
                className="group relative flex items-center space-x-4 p-4 rounded-xl border border-slate-100 bg-white hover:bg-indigo-50/20 hover:border-indigo-200 transition-all duration-200 cursor-pointer"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-indigo-650 group-hover:scale-105 transition duration-200">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-indigo-950">
                    Upload Assignment
                  </p>
                  <p className="text-xs text-slate-400">Submit files to faculty</p>
                </div>
                <ArrowUpRight className="absolute top-4 right-4 h-4 w-4 text-slate-350 opacity-0 group-hover:opacity-100 transition duration-200" />
              </button>

              <button
                onClick={() => navigate("/student/events")}
                className="group relative flex items-center space-x-4 p-4 rounded-xl border border-slate-100 bg-white hover:bg-emerald-50/20 hover:border-emerald-200 transition-all duration-200 cursor-pointer"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-650 group-hover:scale-105 transition duration-200">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-emerald-950">
                    Register Event
                  </p>
                  <p className="text-xs text-slate-400">Join upcoming workshops</p>
                </div>
                <ArrowUpRight className="absolute top-4 right-4 h-4 w-4 text-slate-350 opacity-0 group-hover:opacity-100 transition duration-200" />
              </button>

              <button
                onClick={() => navigate("/student/library")}
                className="group relative flex items-center space-x-4 p-4 rounded-xl border border-slate-100 bg-white hover:bg-violet-50/20 hover:border-violet-200 transition-all duration-200 cursor-pointer"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-violet-50 text-violet-650 group-hover:scale-105 transition duration-200">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-violet-950">
                    Library Catalogue
                  </p>
                  <p className="text-xs text-slate-400">Search and reserve items</p>
                </div>
                <ArrowUpRight className="absolute top-4 right-4 h-4 w-4 text-slate-350 opacity-0 group-hover:opacity-100 transition duration-200" />
              </button>

              <button
                onClick={() => navigate("/student/leave")}
                className="group relative flex items-center space-x-4 p-4 rounded-xl border border-slate-100 bg-white hover:bg-amber-50/20 hover:border-amber-200 transition-all duration-200 cursor-pointer"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-50 text-amber-650 group-hover:scale-105 transition duration-200">
                  <Users className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-amber-950">
                    Request Leave
                  </p>
                  <p className="text-xs text-slate-400">Submit requests to mentors</p>
                </div>
                <ArrowUpRight className="absolute top-4 right-4 h-4 w-4 text-slate-350 opacity-0 group-hover:opacity-100 transition duration-200" />
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Grid: Recent Grades + Upcoming Events + Attendance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Recent Grades" subtitle="Your latest assessment results">
          <div className="space-y-3.5">
            {grades.slice(0, 3).map((grade) => {
              const subject = subjects.find((s) => s.id === grade.subjectId);
              const percentage = Math.round((grade.score / grade.maxScore) * 100);
              return (
                <div
                  key={grade.id}
                  className="flex items-center justify-between p-3 bg-slate-50/50 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="space-y-0.5">
                    <p className="font-semibold text-slate-800 text-sm">{subject?.name}</p>
                    <p className="text-2xs text-slate-400 font-medium uppercase tracking-wider">
                      {grade.type}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 font-display text-base">
                      {percentage}%
                    </p>
                    <p className="text-2xs text-slate-400 font-medium">
                      {grade.score}/{grade.maxScore} marks
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card title="Upcoming Events" subtitle="Events you can participate in">
          <div className="space-y-3.5">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-start space-x-3 p-3 bg-slate-50/50 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 mt-0.5 border border-indigo-100/30">
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="flex-grow space-y-0.5">
                  <p className="font-semibold text-slate-800 text-sm leading-snug">{event.title}</p>
                  <div className="flex flex-wrap items-center gap-x-2 text-2xs text-slate-400 font-medium">
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{event.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Attendance Overview" subtitle="Your attendance by subject">
          <div className="space-y-4">
            {subjects.slice(0, 3).map((subject) => {
              const subjectAttendance = attendance.filter((a) => a.subjectId === subject.id);
              const present = subjectAttendance.filter((a) => a.status === "present").length;
              const total = subjectAttendance.length;
              const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

              return (
                <div key={subject.id} className="space-y-1.5">
                  <div className="flex justify-between items-end">
                    <span className="font-semibold text-slate-800 text-sm truncate max-w-[70%]">
                      {subject.name}
                    </span>
                    <span className="text-xs font-bold text-slate-900 font-display">{percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        percentage >= 75
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                          : percentage >= 50
                          ? "bg-gradient-to-r from-amber-400 to-amber-600"
                          : "bg-gradient-to-r from-rose-500 to-rose-600"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default StudentDashboard;
