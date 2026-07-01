import React, { useEffect, useState } from "react";
import { Calendar, Users, CheckCircle, XCircle, Clock } from "lucide-react";
import Card from "../../components/common/Card";
import { Table, TableRow, TableCell } from "../../components/common/Table";
import { useApiResource } from "../../hooks/useApiResource";
import { api } from "../../services/api";
import { toast } from "react-toastify";

const FacultyAttendance = () => {
  const { data: students } = useApiResource(() => api.getUsers().then((users) => users.filter((user) => user.role === "student")));
  const { data: subjects } = useApiResource(api.getSubjects);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    if (!selectedSubject && subjects.length) {
      setSelectedSubject(subjects[0].id);
    }
  }, [selectedSubject, subjects]);

  useEffect(() => {
    setAttendance(
      students.map((student) => ({
        studentId: student.id,
        status: "present",
      }))
    );
  }, [students]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prev) =>
      prev.map((record) =>
        record.studentId === studentId ? { ...record, status } : record
      )
    );
  };

  const handleSubmitAttendance = async () => {
    await api.saveAttendance({
      subjectId: selectedSubject,
      date: selectedDate,
      attendance,
    });
    toast.success("Attendance saved successfully");
  };

  const getSelectedSubject = () =>
    subjects.find((s) => s.id === selectedSubject);
  const presentCount = attendance.filter((a) => a.status === "present").length;
  const absentCount = attendance.filter((a) => a.status === "absent").length;
  const lateCount = attendance.filter((a) => a.status === "late").length;
  const attendancePercentage = attendance.length
    ? Math.round((presentCount / attendance.length) * 100)
    : 0;

  return (
    <div className="space-y-8 font-sans antialiased">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-display">
          Mark Attendance
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          Record student attendance for your classes
        </p>
      </div>

      {/* ---------------------------------------Controls------------------------------------------ */}
      <Card title="Class Details" subtitle="Select subject and date to record attendance">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-250 bg-white/70 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/25 transition cursor-pointer"
            >
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name} ({subject.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-250 bg-white/70 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/25 transition"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSubmitAttendance}
              className="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition cursor-pointer shadow-md shadow-indigo-500/10"
            >
              Save Attendance
            </button>
          </div>
        </div>
      </Card>

      {/*------------------------------------------ Stats ----------------------------------------*/}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:-translate-y-0.5 transition duration-200">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50/80 text-indigo-655 border border-indigo-100/30">
              <Users className="h-5.5 w-5.5" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Students</p>
              <p className="text-2xl font-bold text-slate-900 font-display mt-0.5">
                {attendance.length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="hover:-translate-y-0.5 transition duration-200">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50/80 text-emerald-650 border border-emerald-100/30">
              <CheckCircle className="h-5.5 w-5.5" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Present</p>
              <p className="text-2xl font-bold text-slate-900 font-display mt-0.5">{presentCount}</p>
            </div>
          </div>
        </Card>

        <Card className="hover:-translate-y-0.5 transition duration-200">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50/80 text-rose-650 border border-rose-100/30">
              <XCircle className="h-5.5 w-5.5" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Absent</p>
              <p className="text-2xl font-bold text-slate-900 font-display mt-0.5">{absentCount}</p>
            </div>
          </div>
        </Card>

        <Card className="hover:-translate-y-0.5 transition duration-200">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50/80 text-amber-650 border border-amber-100/30">
              <Clock className="h-5.5 w-5.5" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Late</p>
              <p className="text-2xl font-bold text-slate-900 font-display mt-0.5">{lateCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* ---------------------------------Attendance Summary ------------------------------------*/}
      <Card
        title="Today's Attendance Summary"
        subtitle={`${getSelectedSubject()?.name || ""} - ${new Date(
          selectedDate
        ).toLocaleDateString()}`}
      >
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-semibold text-slate-800">Attendance Rate</span>
            <span className="text-sm font-bold text-slate-900 font-display">
              {attendancePercentage}%
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${attendancePercentage}%` }}
            />
          </div>
        </div>
      </Card>

      {/* --------------------------------Student Attendance Table -------------------------------*/}
      <Card title="Mark Student Attendance" subtitle="Select active state for enrolled students">
        <Table
          headers={["Student", "Student ID", "Attendance Status", "Actions"]}
        >
          {students.map((student) => {
            const studentAttendance = attendance.find(
              (a) => a.studentId === student.id
            );
            const status = studentAttendance?.status || "present";
            return (
              <TableRow key={student.id}>
                <TableCell>
                  <div className="flex items-center space-x-3.5">
                    {student.avatar ? (
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-100"
                      />
                    ) : (
                      <div className="w-9 h-9 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center">
                        <Users className="h-4.5 w-4.5 text-slate-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-slate-900 text-sm sm:text-base">
                        {student.name}
                      </p>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">{student.course}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-xs text-slate-650 bg-slate-50 border border-slate-150 px-2 py-0.5 rounded">{student.studentId}</span>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full capitalize border ${
                      status === "present"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100/50"
                        : status === "late"
                        ? "bg-amber-50 text-amber-700 border-amber-100/50"
                        : "bg-rose-50 text-rose-700 border-rose-100/50"
                    }`}
                  >
                    {status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleAttendanceChange(student.id, "present")
                      }
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition cursor-pointer ${
                        status === "present"
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/10"
                          : "bg-slate-100 border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-100"
                      }`}
                    >
                      Present
                    </button>
                    <button
                      onClick={() => handleAttendanceChange(student.id, "late")}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition cursor-pointer ${
                        status === "late"
                          ? "bg-amber-600 text-white shadow-md shadow-amber-500/10"
                          : "bg-slate-100 border border-slate-200 text-slate-700 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-100"
                      }`}
                    >
                      Late
                    </button>
                    <button
                      onClick={() =>
                        handleAttendanceChange(student.id, "absent")
                      }
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition cursor-pointer ${
                        status === "absent"
                          ? "bg-rose-600 text-white shadow-md shadow-rose-500/10"
                          : "bg-slate-100 border border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-100"
                      }`}
                    >
                      Absent
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </Table>
      </Card>
    </div>
  );
};

export default FacultyAttendance;
