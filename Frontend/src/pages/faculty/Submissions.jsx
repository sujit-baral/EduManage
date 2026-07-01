import React, { useState } from "react";
import {
  FileText,
  Download,
  Eye,
  CheckCircle,
  Clock,
  Star,
  X,
} from "lucide-react";
import Card from "../../components/common/Card";
import Modal from "../../components/common/Modal";
import { Table, TableRow, TableCell } from "../../components/common/Table";
import { useApiResource } from "../../hooks/useApiResource";
import { api } from "../../services/api";

const FacultySubmissions = () => {
  const { data: students } = useApiResource(() => api.getUsers().then((users) => users.filter((user) => user.role === "student")));
  const { data: assignments } = useApiResource(api.getAssignments);
  const { data: submissions, setData: setSubmissions } = useApiResource(api.getSubmissions);
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeForm, setGradeForm] = useState({ grade: "", feedback: "" });

  React.useEffect(() => {
    if (!selectedAssignment && assignments.length) {
      setSelectedAssignment(assignments[0].id);
    }
  }, [assignments, selectedAssignment]);

  const handleGradeSubmission = (submission) => {
    setSelectedSubmission(submission);
    setGradeForm({
      grade: submission.grade?.toString() || "",
      feedback: submission.feedback || "",
    });
    setShowGradeModal(true);
  };

  const handleSaveGrade = async () => {
    try {
      const updatedSubmission = await api.gradeSubmission(selectedSubmission.id, {
        grade: Number(gradeForm.grade),
        feedback: gradeForm.feedback,
      });
      setSubmissions(
        submissions.map((submission) =>
          submission.id === updatedSubmission.id ? updatedSubmission : submission
        )
      );
      setShowGradeModal(false);
      setSelectedSubmission(null);
      setGradeForm({ grade: "", feedback: "" });
    } catch (error) {
      console.error(error);
    }
  };

  const getStudentName = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    return student ? student.name : "Unknown Student";
  };

  const getAssignmentTitle = (assignmentId) => {
    const assignment = assignments.find((a) => a.id === assignmentId);
    return assignment ? assignment.title : "Unknown Assignment";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "submitted":
        return "bg-amber-50 text-amber-700 border-amber-100/50";
      case "graded":
        return "bg-emerald-50 text-emerald-700 border-emerald-100/50";
      case "late":
        return "bg-rose-50 text-rose-700 border-rose-100/50";
      default:
        return "bg-slate-50 text-slate-700 border-slate-150/50";
    }
  };

  const filteredSubmissions = submissions.filter(
    (s) => s.assignmentId === selectedAssignment
  );
  const totalSubmissions = filteredSubmissions.length;
  const gradedSubmissions = filteredSubmissions.filter(
    (s) => s.status === "graded"
  ).length;
  const avgGrade =
    filteredSubmissions.length > 0
      ? Math.round(
          filteredSubmissions.reduce((sum, s) => sum + (s.grade || 0), 0) /
            (filteredSubmissions.filter((s) => s.grade).length || 1)
        ) || 0
      : 0;
  const pendingSubmissions = filteredSubmissions.filter(
    (s) => s.status === "submitted"
  ).length;

  return (
    <div className="space-y-8 font-sans antialiased">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-display">
          Student Submissions
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          Review and grade student assignment submissions
        </p>
      </div>

      {/* --------------------------------Assignment Selector----------------------------------------- */}
      <Card title="Select Assignment" subtitle="Choose an assignment to review and grade">
        <div className="max-w-md">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Assignment
          </label>
          <select
            value={selectedAssignment}
            onChange={(e) => setSelectedAssignment(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-250 bg-white/70 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/25 transition cursor-pointer"
          >
            {assignments.map((assignment) => (
              <option key={assignment.id} value={assignment.id}>
                {assignment.title}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/*------------------------------------------------Stats------------------------------------- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:-translate-y-0.5 transition duration-200">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50/80 text-indigo-655 border border-indigo-100/30">
              <FileText className="h-5.5 w-5.5" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Total Submissions
              </p>
              <p className="text-2xl font-bold text-slate-900 font-display mt-0.5">
                {totalSubmissions}
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
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Graded</p>
              <p className="text-2xl font-bold text-slate-900 font-display mt-0.5">
                {gradedSubmissions}
              </p>
            </div>
          </div>
        </Card>

        <Card className="hover:-translate-y-0.5 transition duration-200">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50/80 text-purple-650 border border-purple-100/30">
              <Star className="h-5.5 w-5.5" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Average Grade</p>
              <p className="text-2xl font-bold text-slate-900 font-display mt-0.5">{avgGrade}%</p>
            </div>
          </div>
        </Card>

        <Card className="hover:-translate-y-0.5 transition duration-200">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50/80 text-rose-650 border border-rose-100/30">
              <Clock className="h-5.5 w-5.5" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Pending</p>
              <p className="text-2xl font-bold text-slate-900 font-display mt-0.5">
                {pendingSubmissions}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/*-------------------------------- Submissions Table --------------------------------------------*/}
      <Card
        title="Submission List"
        subtitle={`All received submissions for: ${getAssignmentTitle(selectedAssignment)}`}
      >
        <Table
          headers={["Student", "Submitted At", "Status", "Grade", "Actions"]}
        >
          {filteredSubmissions.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell>
                <div className="flex items-center space-x-3.5">
                  <div className="w-9 h-9 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-slate-500 font-display">
                      {getStudentName(submission.studentId)[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm sm:text-base">
                      {getStudentName(submission.studentId)}
                    </p>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">
                      ID: {submission.studentId}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">
                    {new Date(submission.submittedAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    {new Date(submission.submittedAt).toLocaleTimeString()}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full capitalize border ${getStatusColor(
                    submission.status
                  )}`}
                >
                  {submission.status}
                </span>
              </TableCell>
              <TableCell>
                {submission.grade !== undefined && submission.grade !== null ? (
                  <div>
                    <div className="text-sm font-semibold text-slate-800">
                      <span>{submission.grade}</span>
                      <span className="text-slate-400 font-normal">/{submission.maxGrade}</span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      {Math.round(
                        (submission.grade / submission.maxGrade) * 100
                      )}
                      %
                    </p>
                  </div>
                ) : (
                  <span className="text-xs font-medium text-slate-400">Not graded</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <button className="flex items-center px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-250 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer">
                    <Eye className="h-3.5 w-3.5 mr-1 text-slate-500" />
                    View
                  </button>
                  <button className="flex items-center px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-250 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer">
                    <Download className="h-3.5 w-3.5 mr-1 text-slate-500" />
                    Download
                  </button>
                  <button
                    onClick={() => handleGradeSubmission(submission)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition cursor-pointer ${
                      submission.grade !== undefined && submission.grade !== null
                        ? "bg-slate-100 hover:bg-slate-200 border border-slate-250 text-slate-700"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/10"
                    }`}
                  >
                    {submission.grade !== undefined && submission.grade !== null ? "Edit Grade" : "Grade"}
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>

      {/*------------------------------------ Grade Modal-------------------------------------- */}
      <Modal
        isOpen={showGradeModal}
        onClose={() => setShowGradeModal(false)}
        title="Grade Submission"
      >
        <div className="space-y-6">
          {selectedSubmission && (
            <div className="bg-slate-50/50 border border-slate-150 rounded-xl p-4">
              <h4 className="font-semibold text-slate-900 font-display">
                {getStudentName(selectedSubmission.studentId)}
              </h4>
              <p className="text-sm text-slate-500 font-medium mt-1">
                {getAssignmentTitle(selectedSubmission.assignmentId)}
              </p>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Submitted:{" "}
                {new Date(selectedSubmission.submittedAt).toLocaleString()}
              </p>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Grade (out of {selectedSubmission?.maxGrade})
            </label>
            <input
              type="number"
              max={selectedSubmission?.maxGrade}
              min="0"
              value={gradeForm.grade}
              onChange={(e) =>
                setGradeForm({ ...gradeForm, grade: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-250 bg-white/70 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/25 transition"
              placeholder="Enter grade"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Feedback
            </label>
            <textarea
              rows={4}
              value={gradeForm.feedback}
              onChange={(e) =>
                setGradeForm({ ...gradeForm, feedback: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-250 bg-white/70 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/25 transition resize-none"
              placeholder="Provide feedback for the student..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => setShowGradeModal(false)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveGrade}
              className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition cursor-pointer shadow-md shadow-emerald-500/10"
            >
              Save Grade
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FacultySubmissions;
