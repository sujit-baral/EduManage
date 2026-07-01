import { useState } from "react";
import { FileText, Download, Upload, Calendar, Clock } from "lucide-react";
import Card from "../../components/common/Card";
import Modal from "../../components/common/Modal";
import { Table, TableRow, TableCell } from "../../components/common/Table";
import { useApiResource } from "../../hooks/useApiResource";
import { api } from "../../services/api";
import { toast } from "react-toastify";

const StudentAssignments = () => {
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [file, setFile] = useState(null);
  const { data: assignments } = useApiResource(api.getAssignments);
  const { data: subjects } = useApiResource(api.getSubjects);

  const handleSubmissionClick = (assignment) => {
    setSelectedAssignment(assignment);
    setShowSubmissionModal(true);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    await api.submitAssignment({
      assignmentId: selectedAssignment.id,
      fileName: file?.name,
      maxGrade: selectedAssignment.maxScore,
    });
    setShowSubmissionModal(false);
    setFile(null);
    toast.success("Assignment submitted successfully");
  };

  const getSubjectName = (subjectId) => {
    const subject = subjects.find((s) => s.id === subjectId);
    return subject ? subject.name : "Unknown Subject";
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-8 font-sans antialiased">
      {/* Title block */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-display">
          Assignments & Materials
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          Submit assignments, review coursework, and access lecture notes
        </p>
      </div>

      {/*------------------------------------------------- Stats----------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:-translate-y-0.5 transition duration-200">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50/80 text-indigo-650 border border-indigo-100/30">
              <FileText className="h-5.5 w-5.5" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Assignments</p>
              <p className="text-2xl font-bold text-slate-900 font-display mt-0.5">
                {assignments.length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="hover:-translate-y-0.5 transition duration-200">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50/80 text-amber-650 border border-amber-100/30">
              <Clock className="h-5.5 w-5.5" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Pending</p>
              <p className="text-2xl font-bold text-slate-900 font-display mt-0.5">2</p>
            </div>
          </div>
        </Card>

        <Card className="hover:-translate-y-0.5 transition duration-200">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50/80 text-emerald-650 border border-emerald-100/30">
              <Upload className="h-5.5 w-5.5" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Submitted</p>
              <p className="text-2xl font-bold text-slate-900 font-display mt-0.5">5</p>
            </div>
          </div>
        </Card>

        <Card className="hover:-translate-y-0.5 transition duration-200">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50/80 text-rose-650 border border-rose-100/30">
              <Calendar className="h-5.5 w-5.5" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Overdue</p>
              <p className="text-2xl font-bold text-slate-900 font-display mt-0.5">1</p>
            </div>
          </div>
        </Card>
      </div>

      {/*----------------------------------------- Assignments Table ------------------------------------*/}
      <Card title="Current Assignments" subtitle="Academic assignments needing submission">
        <Table
          headers={["Assignment", "Subject", "Due Date", "Status", "Actions"]}
        >
          {assignments.map((assignment) => (
            <TableRow key={assignment.id}>
              <TableCell>
                <div className="space-y-1">
                  <p className="font-medium text-slate-900 text-sm sm:text-base">
                    {assignment.title}
                  </p>
                  <p className="text-xs text-slate-400 font-normal max-w-lg leading-relaxed">
                    {assignment.description}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <span className="inline-flex px-2.5 py-1 bg-indigo-50 border border-indigo-150/40 text-indigo-700 text-xs font-semibold rounded-full">
                  {getSubjectName(assignment.subjectId)}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-1.5 text-slate-600 font-medium">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span
                    className={
                      isOverdue(assignment.dueDate)
                        ? "text-rose-600 font-semibold"
                        : "text-slate-700"
                    }
                  >
                    {new Date(assignment.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {isOverdue(assignment.dueDate) ? (
                  <span className="inline-flex px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-100 text-xs font-semibold rounded-full">
                    Overdue
                  </span>
                ) : (
                  <span className="inline-flex px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-100 text-xs font-semibold rounded-full">
                    Pending
                  </span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSubmissionClick(assignment)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
                  >
                    Submit
                  </button>
                  {assignment.fileUrl && (
                    <button className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 cursor-pointer">
                      <Download className="h-3.5 w-3.5" />
                      <span>Download</span>
                    </button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>

      {/*----------------------------------- Notes and Materials---------------------------------- */}
      <Card title="Study Materials & Notes" subtitle="Course documents uploaded by lecturers">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-5 hover:shadow-md hover:border-slate-350/40 transition-all duration-300 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 text-base font-display">{subject.name}</h3>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50/50 text-indigo-650 border border-indigo-100/10">
                  <FileText className="h-4.5 w-4.5" />
                </div>
              </div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                Subject Code: {subject.code}
              </p>
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button className="w-full py-2.5 bg-white hover:bg-indigo-50/30 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-850 text-xs font-semibold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5">
                  <Download className="h-3.5 w-3.5 text-slate-400" />
                  <span>Lecture Notes</span>
                </button>
                <button className="w-full py-2.5 bg-white hover:bg-emerald-50/30 border border-slate-200 hover:border-emerald-200 text-slate-700 hover:text-emerald-850 text-xs font-semibold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5">
                  <Download className="h-3.5 w-3.5 text-slate-400" />
                  <span>Reference Materials</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/*------------------------------- Submission Modal------------------------------- */}
      <Modal
        isOpen={showSubmissionModal}
        onClose={() => setShowSubmissionModal(false)}
        title="Submit Assignment"
      >
        <div className="space-y-6">
          <div className="space-y-1 bg-slate-50/50 p-4 border border-slate-150 rounded-xl">
            <h4 className="font-semibold text-slate-900 text-base leading-snug">
              {selectedAssignment?.title}
            </h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              {selectedAssignment?.description}
            </p>
          </div>

          <div className="space-y-2.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Upload Submission File
            </label>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 bg-slate-50/30 hover:bg-slate-50 rounded-2xl p-6 transition duration-200 relative">
              <Upload className="h-8 w-8 text-slate-400 mb-2" />
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <p className="text-sm font-medium text-slate-700">Click or Drag file to upload</p>
              <p className="text-xxs text-slate-450 mt-1.5 font-medium">
                Accepted: PDF, DOC, DOCX, TXT (Max size: 10MB)
              </p>
            </div>
          </div>

          {file && (
            <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-2 text-emerald-800">
                <FileText className="h-4.5 w-4.5 text-emerald-600" />
                <span className="text-xs font-semibold truncate max-w-xs">{file.name}</span>
              </div>
              <span className="text-xxs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Selected</span>
            </div>
          )}

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              onClick={() => setShowSubmissionModal(false)}
              className="px-4 py-2.5 text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!file}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed cursor-pointer"
            >
              Submit Assignment
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StudentAssignments;
