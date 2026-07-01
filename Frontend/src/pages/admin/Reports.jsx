import React, { useState } from 'react';
import { BarChart3, Download, Users, BookOpen, TrendingUp, Calendar } from 'lucide-react';
import Card from '../../components/common/Card';
import AdminActionButton from '../../components/admin/AdminActionButton';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { useApiResource } from '../../hooks/useApiResource';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

const AdminReports = () => {
  const [selectedReport, setSelectedReport] = useState('attendance');
  const [dateRange, setDateRange] = useState({
    start: '2024-01-01',
    end: '2024-12-31'
  });
  const { data: summary } = useApiResource(api.getSummary, {
    students: 0,
    faculty: 0,
    users: 0,
    events: 0,
    eventRegistrations: 0,
    attendancePercentage: 0,
    averageGrade: 0,
  });

  const reports = [
    { id: 'attendance', name: 'Attendance Reports', icon: Users },
    { id: 'academic', name: 'Academic Performance', icon: BookOpen },
    { id: 'events', name: 'Event Analytics', icon: Calendar },
    { id: 'system', name: 'System Usage', icon: TrendingUp }
  ];

  const attendanceData = {
    totalClasses: 150,
    avgAttendance: summary.attendancePercentage,
    highAttendanceStudents: 85,
    lowAttendanceStudents: 15
  };

  const academicData = {
    totalStudents: summary.students,
    avgGrade: summary.averageGrade,
    passRate: 92,
    topPerformers: 15
  };

  const eventData = {
    totalEvents: summary.events,
    totalRegistrations: summary.eventRegistrations,
    avgRegistrationRate: 75,
    popularEventType: 'Workshop'
  };

  const systemData = {
    totalUsers: summary.users,
    activeUsers: summary.students + summary.faculty,
    systemUptime: 99.8,
    dailyLogins: 156
  };

  const handleExportReport = async () => {
    const report = await api.exportReport({
      reportType: selectedReport,
      ...dateRange,
    });
    toast.success(report.message || 'Report exported successfully');
  };

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'attendance':
        return (
          <div className="space-y-6">
            {/*---------------------------------------- Attendance cards ----------------------------------*/}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Classes</p>
                  <p className="text-2xl font-bold text-blue-900">{attendanceData.totalClasses}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>

              <div className="bg-green-50 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-green-600 text-sm font-medium">Avg Attendance</p>
                  <p className="text-2xl font-bold text-green-900">{attendanceData.avgAttendance}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>

              <div className="bg-purple-50 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-purple-600 text-sm font-medium">High Attendance</p>
                  <p className="text-2xl font-bold text-purple-900">{attendanceData.highAttendanceStudents}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>

              <div className="bg-red-50 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-red-600 text-sm font-medium">Low Attendance</p>
                  <p className="text-2xl font-bold text-red-900">{attendanceData.lowAttendanceStudents}</p>
                </div>
                <Users className="h-8 w-8 text-red-600" />
              </div>
            </div>

            {/*--------------------------------------- Chart placeholder --------------------------------*/}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Attendance Trends</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Chart visualization would be displayed here</p>
                  <p className="text-sm text-gray-400">Using a charting library like Chart.js or Recharts</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'academic':
        return (
          <div className="space-y-6">
            {/*------------------------------------- Academic cards ---------------------------------*/}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Students</p>
                  <p className="text-2xl font-bold text-blue-900">{academicData.totalStudents}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>

              <div className="bg-green-50 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-green-600 text-sm font-medium">Avg Grade</p>
                  <p className="text-2xl font-bold text-green-900">{academicData.avgGrade}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>

              <div className="bg-purple-50 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Pass Rate</p>
                  <p className="text-2xl font-bold text-purple-900">{academicData.passRate}%</p>
                </div>
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>

              <div className="bg-orange-50 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Top Performers</p>
                  <p className="text-2xl font-bold text-orange-900">{academicData.topPerformers}</p>
                </div>
                <Users className="h-8 w-8 text-orange-600" />
              </div>
            </div>

            {/* ----------------------------------Chart placeholder -----------------------------------*/}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Grade Distribution</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Grade distribution chart would be displayed here</p>
              </div>
            </div>
          </div>
        );

      case 'events':
        return (
          <div className="space-y-6">
            {/*--------------------------------------- Event cards --------------------------------------*/}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Events</p>
                  <p className="text-2xl font-bold text-blue-900">{eventData.totalEvents}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>

              <div className="bg-green-50 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-green-600 text-sm font-medium">Registrations</p>
                  <p className="text-2xl font-bold text-green-900">{eventData.totalRegistrations}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>

              <div className="bg-purple-50 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Registration Rate</p>
                  <p className="text-2xl font-bold text-purple-900">{eventData.avgRegistrationRate}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>

              <div className="bg-orange-50 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Most Popular</p>
                  <p className="text-lg font-bold text-orange-900">{eventData.popularEventType}</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </div>

            {/*------------------------------------- Chart placeholder ------------------------------------*/}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Event Participation Over Time</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Event participation trends would be displayed here</p>
              </div>
            </div>
          </div>
        );

      case 'system':
        return (
          <div className="space-y-6">
            {/*-------------------------------------- System cards ---------------------------------------*/}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Users</p>
                  <p className="text-2xl font-bold text-blue-900">{systemData.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>

              <div className="bg-green-50 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-green-600 text-sm font-medium">Active Users</p>
                  <p className="text-2xl font-bold text-green-900">{systemData.activeUsers}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>

              <div className="bg-purple-50 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-purple-600 text-sm font-medium">System Uptime</p>
                  <p className="text-2xl font-bold text-purple-900">{systemData.systemUptime}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>

              <div className="bg-orange-50 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Daily Logins</p>
                  <p className="text-2xl font-bold text-orange-900">{systemData.dailyLogins}</p>
                </div>
                <Users className="h-8 w-8 text-orange-600" />
              </div>
            </div>

            {/*------------------------------------- Chart placeholder ----------------------------------*/}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">System Usage Analytics</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">System usage analytics would be displayed here</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Reports & Analytics"
        description="Generate operational summaries and review academic, event, attendance, and system trends."
        actions={
          <AdminActionButton icon={Download} variant="success" onClick={handleExportReport}>
            Export Report
          </AdminActionButton>
        }
      />

      {/*--------------------------------------- Report Controls -----------------------------------*/}
      <Card title="Report Configuration">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {reports.map(report => (
                <option key={report.id} value={report.id}>{report.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>
      </Card>

      {/*------------------------------- Report Navigation + Content --------------------------------*/}
      <Card>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {reports.map((report) => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`flex items-center space-x-3 p-4 rounded-lg transition-colors ${
                selectedReport === report.id
                  ? 'bg-cyan-50 border-2 border-cyan-200 text-cyan-700'
                  : 'bg-slate-50 border-2 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <report.icon className="h-6 w-6" />
              <span className="font-medium">{report.name}</span>
            </button>
          ))}
        </div>

        {renderReportContent()}
      </Card>
    </div>
  );
};

export default AdminReports;
