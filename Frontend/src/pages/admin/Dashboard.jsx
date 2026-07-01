import React from "react";
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  Calendar,
  FileText,
  GraduationCap,
  ShieldCheck,
  Users,
} from "lucide-react";
import Card from "../../components/common/Card";
import AdminMetricCard from "../../components/admin/AdminMetricCard";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { useApiResource } from "../../hooks/useApiResource";
import { api } from "../../services/api";

const AdminDashboard = () => {
  const { data: summary } = useApiResource(api.getSummary, {
    users: 0,
    students: 0,
    faculty: 0,
    courses: 0,
    subjects: 0,
    events: 0,
    assignments: 0,
    attendancePercentage: 0,
    averageGrade: 0,
  });

  const recentActivities = [
    { action: "Student profile updated", user: "Academic office", time: "2 hours ago" },
    { action: "Course catalog reviewed", user: "Admin", time: "4 hours ago" },
    { action: "Event registrations synced", user: "System", time: "6 hours ago" },
  ];

  const systemAlerts = [
    {
      type: "warning",
      message: "Review attendance threshold before next report cycle",
      time: "1 hour ago",
    },
    {
      type: "info",
      message: "MongoDB connection is active and serving API data",
      time: "Today",
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Admin Command Center"
        description="Monitor users, academics, events, reports, and system health from one light-weight control surface."
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <AdminMetricCard icon={Users} label="Total Users" value={summary.users} tone="cyan" />
        <AdminMetricCard icon={GraduationCap} label="Students" value={summary.students} tone="emerald" />
        <AdminMetricCard icon={ShieldCheck} label="Faculty" value={summary.faculty} tone="violet" />
        <AdminMetricCard icon={BookOpen} label="Courses" value={summary.courses} tone="amber" />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <AdminMetricCard icon={FileText} label="Subjects" value={summary.subjects} tone="slate" />
        <AdminMetricCard icon={Calendar} label="Events" value={summary.events} tone="rose" />
        <AdminMetricCard
          icon={BarChart3}
          label="Avg Attendance"
          value={`${summary.attendancePercentage || 0}%`}
          tone="cyan"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card title="Operational Activity" subtitle="Latest administrative movement">
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4"
              >
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-500" />
                <div className="flex-1">
                  <p className="font-medium text-slate-950">{activity.action}</p>
                  <p className="text-sm text-slate-600">by {activity.user}</p>
                </div>
                <span className="text-xs font-medium text-slate-500">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="System Signals" subtitle="Items that need admin attention">
          <div className="space-y-3">
            {systemAlerts.map((alert, index) => (
              <div
                key={index}
                className="flex gap-3 rounded-lg border border-amber-100 bg-amber-50 p-4"
              >
                <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-600" />
                <div>
                  <p className="text-sm font-medium text-slate-950">
                    {alert.message}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Department Overview" subtitle="High-level academic composition">
          <div className="space-y-3">
            {[
              ["Computer Science", `${summary.students} students`],
              ["Information Technology", "Program active"],
              ["Faculty Members", `${summary.faculty} active`],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3"
              >
                <span className="font-medium text-slate-950">{label}</span>
                <span className="text-sm text-slate-600">{value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Academic Snapshot" subtitle="Live values from backend summary">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-cyan-50 p-4">
              <p className="text-sm font-medium text-cyan-700">Average Grade</p>
              <p className="mt-2 text-3xl font-bold text-slate-950">
                {summary.averageGrade || 0}%
              </p>
            </div>
            <div className="rounded-lg bg-emerald-50 p-4">
              <p className="text-sm font-medium text-emerald-700">Assignments</p>
              <p className="mt-2 text-3xl font-bold text-slate-950">
                {summary.assignments || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
