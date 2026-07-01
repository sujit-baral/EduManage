import React, { useState } from 'react';
import { Upload, FileText, Download, Trash2, Plus } from 'lucide-react';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import { Table, TableRow, TableCell } from '../../components/common/Table';
import { useApiResource } from '../../hooks/useApiResource';
import { api } from '../../services/api';

const FacultyMaterials = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: subjects } = useApiResource(api.getSubjects);
  const { data: materials, setData: setMaterials } = useApiResource(api.getMaterials);

  const [uploadForm, setUploadForm] = useState({
    title: '',
    type: 'lecture',
    subjectId: '',
    file: null
  });

  const handleUpload = async () => {
    if (uploadForm.title && uploadForm.subjectId && uploadForm.file) {
      const newMaterial = await api.createMaterial({
        title: uploadForm.title,
        type: uploadForm.type,
        subjectId: uploadForm.subjectId,
        fileName: uploadForm.file.name,
        fileSize: `${(uploadForm.file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split('T')[0],
        downloads: 0
      });
      setMaterials([...materials, newMaterial]);
      setUploadForm({ title: '', type: 'lecture', subjectId: '', file: null });
      setShowUploadModal(false);
    }
  };

  const initiateDelete = (material) => {
    setMaterialToDelete(material);
    setShowDeleteConfirmModal(true);
  };

  const executeDelete = async () => {
    if (!materialToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteMaterial(materialToDelete.id);
      setMaterials(materials.filter(m => m.id !== materialToDelete.id));
      setShowDeleteConfirmModal(false);
      setMaterialToDelete(null);
      import("react-toastify").then(({ toast }) =>
        toast.success("Study material deleted successfully")
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const getSubjectName = (subjectId) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'Unknown Subject';
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'lecture':
        return 'bg-blue-50/70 border-blue-100 text-blue-700';
      case 'assignment':
        return 'bg-green-50/70 border-green-100 text-green-700';
      case 'reference':
        return 'bg-purple-50/70 border-purple-100 text-purple-700';
      case 'exam':
        return 'bg-rose-50/70 border-rose-100 text-rose-700';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  const totalMaterials = materials.length;
  const totalDownloads = materials.reduce((sum, m) => sum + m.downloads, 0);
  const lectureNotes = materials.filter(m => m.type === 'lecture').length;
  const assignmentsCount = materials.filter(m => m.type === 'assignment').length;

  return (
    <div className="space-y-8 font-sans antialiased">
      {/* Header */}
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-display">
            Study Materials
          </h1>
          <p className="text-sm text-slate-505 font-medium">
            Upload and manage study materials for your students
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-650 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/10 hover:bg-indigo-755 transition cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Upload Material</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:-translate-y-0.5 transition duration-200">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50/80 text-indigo-650 border border-indigo-100/30">
              <FileText className="h-5.5 w-5.5" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Materials</p>
              <p className="text-2xl font-bold text-slate-900 font-display mt-0.5">{totalMaterials}</p>
            </div>
          </div>
        </Card>

        <Card className="hover:-translate-y-0.5 transition duration-200">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50/80 text-emerald-650 border border-emerald-100/30">
              <Download className="h-5.5 w-5.5" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Downloads</p>
              <p className="text-2xl font-bold text-slate-900 font-display mt-0.5">{totalDownloads}</p>
            </div>
          </div>
        </Card>

        <Card className="hover:-translate-y-0.5 transition duration-200">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50/80 text-violet-650 border border-violet-100/30">
              <FileText className="h-5.5 w-5.5" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Lecture Notes</p>
              <p className="text-2xl font-bold text-slate-900 font-display mt-0.5">{lectureNotes}</p>
            </div>
          </div>
        </Card>

        <Card className="hover:-translate-y-0.5 transition duration-200">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50/80 text-rose-650 border border-rose-100/30">
              <FileText className="h-5.5 w-5.5" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Assignments</p>
              <p className="text-2xl font-bold text-slate-900 font-display mt-0.5">{assignmentsCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Materials Table */}
      <Card title="Uploaded Materials" subtitle="Course documents and resources available to students">
        <Table headers={['Material', 'Subject', 'Type', 'Size', 'Upload Date', 'Downloads', 'Actions']}>
          {materials.map((material) => (
            <TableRow key={material.id}>
              <TableCell>
                <div className="flex items-center space-x-3.5">
                  <div className="p-2 bg-slate-100 border border-slate-200 rounded-xl">
                    <FileText className="h-4.5 w-4.5 text-slate-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm sm:text-base">{material.title}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium text-slate-700">{getSubjectName(material.subjectId)}</span>
              </TableCell>
              <TableCell>
                <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full capitalize border ${getTypeColor(material.type)}`}>
                  {material.type}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">{material.fileSize}</span>
              </TableCell>
              <TableCell>
                <span className="text-xs font-medium text-slate-500">
                  {new Date(material.uploadDate).toLocaleDateString()}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm font-bold text-slate-900 font-display">{material.downloads}</span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-1">
                  <button className="p-1.5 text-indigo-650 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 rounded-lg transition cursor-pointer">
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => initiateDelete(material)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg transition cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Study Material"
      >
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Material Title
            </label>
            <input
              type="text"
              value={uploadForm.title}
              onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-250 bg-white/70 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/25 transition"
              placeholder="Enter material title"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Subject
              </label>
              <select
                value={uploadForm.subjectId}
                onChange={(e) => setUploadForm({ ...uploadForm, subjectId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-250 bg-white/70 text-sm text-slate-905 outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/25 transition"
              >
                <option value="">Select Subject</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Type
              </label>
              <select
                value={uploadForm.type}
                onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-250 bg-white/70 text-sm text-slate-905 outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/25 transition"
              >
                <option value="lecture">Lecture Notes</option>
                <option value="assignment">Assignment Sheet</option>
                <option value="reference">Reference Book</option>
                <option value="exam">Exam Prep</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              File Attachment
            </label>
            <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition cursor-pointer">
              <input
                type="file"
                onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files[0] })}
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <p className="text-sm font-medium text-slate-705">
                {uploadForm.file ? uploadForm.file.name : "Click or Drag file to upload"}
              </p>
              <p className="text-xxs text-slate-400 mt-1.5 font-medium">
                Accepted formats: PDF, DOC, DOCX, PPT, PPTX (Max size: 50MB)
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              onClick={() => setShowUploadModal(false)}
              className="px-4 py-2.5 text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!uploadForm.title || !uploadForm.subjectId || !uploadForm.file}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-755 text-white rounded-xl transition text-xs font-semibold cursor-pointer disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed shadow-md shadow-indigo-500/10"
            >
              Upload Material
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirmModal}
        onClose={() => {
          setShowDeleteConfirmModal(false);
          setMaterialToDelete(null);
        }}
        onConfirm={executeDelete}
        title="Delete Material"
        message={`Are you sure you want to delete ${materialToDelete?.title}? Students will no longer be able to download this file.`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default FacultyMaterials;
