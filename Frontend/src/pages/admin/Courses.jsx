import React, { useState } from "react";
import { BookOpen, Plus, Edit, Trash2, FileText } from "lucide-react";
import Card from "../../components/common/Card";
import Modal from "../../components/common/Modal";
import ConfirmModal from "../../components/common/ConfirmModal";
import { Table, TableRow, TableCell } from "../../components/common/Table";
import AdminActionButton from "../../components/admin/AdminActionButton";
import AdminMetricCard from "../../components/admin/AdminMetricCard";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { useApiResource } from "../../hooks/useApiResource";
import { api } from "../../services/api";

const AdminCourses = () => {
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null); // { id, type: 'course'|'subject', name }
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState("courses");

  const [courseForm, setCourseForm] = useState({
    name: "",
    code: "",
    duration: "",
    description: "",
  });

  const [subjectForm, setSubjectForm] = useState({
    name: "",
    code: "",
    credits: "",
    semester: "",
    courseId: "",
  });

  const { data: courses, setData: setCourses } = useApiResource(api.getCourses);
  const { data: subjects, setData: setSubjects } = useApiResource(api.getSubjects);

  const handleAddCourse = async () => {
    if (courseForm.name && courseForm.code) {
      const newCourse = await api.createCourse({
        ...courseForm,
        duration: parseInt(courseForm.duration) || 3,
      });
      setCourses([...courses, newCourse]);
      setCourseForm({ name: "", code: "", duration: "", description: "" });
      setShowCourseModal(false);
    }
  };

  const handleAddSubject = async () => {
    if (subjectForm.name && subjectForm.code && subjectForm.courseId) {
      const newSubject = await api.createSubject({
        ...subjectForm,
        credits: parseInt(subjectForm.credits) || 3,
        semester: parseInt(subjectForm.semester) || 1,
      });
      setSubjects([...subjects, newSubject]);
      setSubjectForm({
        name: "",
        code: "",
        credits: "",
        semester: "",
        courseId: "",
      });
      setShowSubjectModal(false);
    }
  };

  const initiateDeleteCourse = (course) => {
    setItemToDelete({ id: course.id, type: "course", name: course.name });
    setShowDeleteConfirmModal(true);
  };

  const initiateDeleteSubject = (subject) => {
    setItemToDelete({ id: subject.id, type: "subject", name: subject.name });
    setShowDeleteConfirmModal(true);
  };

  const executeDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      if (itemToDelete.type === "course") {
        await api.deleteCourse(itemToDelete.id);
        setCourses(courses.filter((c) => c.id !== itemToDelete.id));
        setSubjects(subjects.filter((s) => s.courseId !== itemToDelete.id));
      } else {
        await api.deleteSubject(itemToDelete.id);
        setSubjects(subjects.filter((s) => s.id !== itemToDelete.id));
      }
      setShowDeleteConfirmModal(false);
      setItemToDelete(null);
      import("react-toastify").then(({ toast }) =>
        toast.success(`${itemToDelete.type === "course" ? "Course" : "Subject"} deleted successfully`)
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const getCourseName = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? course.name : "Unknown Course";
  };

  const totalCourses = courses.length;
  const totalSubjects = subjects.length;
  const avgSubjectsPerCourse =
    totalCourses > 0 ? Math.round(totalSubjects / totalCourses) : 0;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Course Management"
        description="Maintain academic programs, subject catalogs, and curriculum structure."
        actions={
          <>
            <AdminActionButton icon={Plus} onClick={() => setShowCourseModal(true)}>
              Add Course
            </AdminActionButton>
            <AdminActionButton icon={Plus} variant="secondary" onClick={() => setShowSubjectModal(true)}>
              Add Subject
            </AdminActionButton>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AdminMetricCard icon={BookOpen} label="Total Courses" value={totalCourses} tone="cyan" />
        <AdminMetricCard icon={FileText} label="Total Subjects" value={totalSubjects} tone="emerald" />
        <AdminMetricCard icon={FileText} label="Avg Subjects/Course" value={avgSubjectsPerCourse} tone="violet" />
      </div>

      {/* Tabs */}
      <Card>
        <div className="flex border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab("courses")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "courses"
                ? "border-b-2 border-cyan-600 text-cyan-700"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Courses
          </button>
          <button
            onClick={() => setActiveTab("subjects")}
            className={`px-4 py-2 font-medium text-sm ml-8 ${
              activeTab === "subjects"
                ? "border-b-2 border-cyan-600 text-cyan-700"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Subjects
          </button>
        </div>

        {activeTab === "courses" && (
          <Table headers={["Course", "Code", "Duration", "Description", "Actions"]}>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                    <span className="font-medium text-gray-900">{course.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {course.code}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-gray-600">{course.duration} years</span>
                </TableCell>
                <TableCell>
                  <p className="text-gray-605 text-sm max-w-xs">{course.description}</p>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => initiateDeleteCourse(course)}
                      className="p-1 text-red-650 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        )}

        {activeTab === "subjects" && (
          <Table headers={["Subject", "Code", "Course", "Credits", "Semester", "Actions"]}>
            {subjects.map((subject) => (
              <TableRow key={subject.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <FileText className="h-6 w-6 text-green-600" />
                    <span className="font-medium text-gray-900">{subject.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {subject.code}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-gray-600">{getCourseName(subject.courseId)}</span>
                </TableCell>
                <TableCell>
                  <span className="text-gray-650">{subject.credits}</span>
                </TableCell>
                <TableCell>
                  <span className="text-gray-650">Sem {subject.semester}</span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => initiateDeleteSubject(subject)}
                      className="p-1 text-red-650 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        )}
      </Card>

      {/* Add Course Modal */}
      <Modal
        isOpen={showCourseModal}
        onClose={() => setShowCourseModal(false)}
        title="Add New Course"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Course Name</label>
            <input
              type="text"
              value={courseForm.name}
              onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="e.g. Bachelor of Science"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Course Code</label>
              <input
                type="text"
                value={courseForm.code}
                onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="e.g. BSC"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Duration (Years)</label>
              <input
                type="number"
                value={courseForm.duration}
                onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="e.g. 3"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={courseForm.description}
              onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              rows={3}
              placeholder="Describe curriculum focus areas..."
            />
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button
              onClick={() => setShowCourseModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-250 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddCourse}
              className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
            >
              Add Course
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Subject Modal */}
      <Modal
        isOpen={showSubjectModal}
        onClose={() => setShowSubjectModal(false)}
        title="Add New Subject"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Subject Name</label>
            <input
              type="text"
              value={subjectForm.name}
              onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="e.g. Data Structures"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Subject Code</label>
              <input
                type="text"
                value={subjectForm.code}
                onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="e.g. CS201"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Credits</label>
              <input
                type="number"
                value={subjectForm.credits}
                onChange={(e) => setSubjectForm({ ...subjectForm, credits: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="e.g. 4"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Course Program</label>
              <select
                value={subjectForm.courseId}
                onChange={(e) => setSubjectForm({ ...subjectForm, courseId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Semester</label>
              <select
                value={subjectForm.semester}
                onChange={(e) => setSubjectForm({ ...subjectForm, semester: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">Select Semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button
              onClick={() => setShowSubjectModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-250 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddSubject}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Add Subject
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirmModal}
        onClose={() => {
          setShowDeleteConfirmModal(false);
          setItemToDelete(null);
        }}
        onConfirm={executeDelete}
        title={`Delete ${itemToDelete?.type === "course" ? "Course" : "Subject"}`}
        message={`Are you sure you want to delete ${itemToDelete?.name}? All associated subjects and historical records will be permanently removed.`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default AdminCourses;
