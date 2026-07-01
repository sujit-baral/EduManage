import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Search,
  Filter,
  Check,
  X,
} from "lucide-react";
import Card from "../../components/common/Card";
import Modal from "../../components/common/Modal";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";
import { Table, TableRow, TableCell } from "../../components/common/Table";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const LeaveReview = () => {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  
  // Modal states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewStatus, setReviewStatus] = useState("approved");
  const [reviewNote, setReviewNote] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch Leave Requests using TanStack Query
  const {
    data: leaveRequests = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["leaveRequests"],
    queryFn: api.getLeaveRequests,
  });

  // Fetch all users to map studentId to real names
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: api.getUsers,
  });

  // Mutation for reviewing requests
  const reviewMutation = useMutation({
    mutationFn: ({ id, status, reviewNote }) =>
      api.reviewLeaveRequest(id, { status, reviewNote }),
    onSuccess: (updatedRequest) => {
      // Optimistically update query client state
      queryClient.setQueryData(["leaveRequests"], (oldData = []) =>
        oldData.map((req) => (req.id === updatedRequest.id ? updatedRequest : req))
      );
      toast.success(`Leave request ${reviewStatus}`);
      setShowReviewModal(false);
      setSelectedRequest(null);
      setReviewNote("");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update leave request");
    },
  });

  const getStudentInfo = (studentId) => {
    const student = users.find((u) => u.id === studentId || u._id === studentId);
    return student
      ? { name: student.name, email: student.email, course: student.course || "N/A" }
      : { name: "Unknown Student", email: "N/A", course: "N/A" };
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-rose-600" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-emerald-50 text-emerald-700 border border-emerald-100/50";
      case "rejected":
        return "bg-rose-50 text-rose-700 border border-rose-100/50";
      case "pending":
        return "bg-amber-50 text-amber-700 border border-amber-100/50";
      default:
        return "bg-slate-50 border border-slate-200 text-slate-700";
    }
  };

  // Filter requests
  const filteredRequests = leaveRequests.filter((req) => {
    const student = getStudentInfo(req.studentId);
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openReviewModal = (request, status) => {
    setSelectedRequest(request);
    setReviewStatus(status);
    setReviewNote(request.reviewNote || "");
    setShowReviewModal(true);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!selectedRequest) return;
    reviewMutation.mutate({
      id: selectedRequest.id,
      status: reviewStatus,
      reviewNote,
    });
  };

  if (isLoading) return <LoadingState message="Loading student leave requests..." />;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;

  const pendingCount = leaveRequests.filter((r) => r.status === "pending").length;
  const approvedCount = leaveRequests.filter((r) => r.status === "approved").length;
  const rejectedCount = leaveRequests.filter((r) => r.status === "rejected").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 font-sans antialiased"
    >
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-display">
          Leave Requests Review
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          Manage and review leave submissions from students.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-amber-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Approvals</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{pendingCount}</p>
            </div>
            <div className="h-10 w-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Approved Leaves</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{approvedCount}</p>
            </div>
            <div className="h-10 w-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-rose-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Rejected Leaves</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{rejectedCount}</p>
            </div>
            <div className="h-10 w-10 bg-rose-50 rounded-lg flex items-center justify-center text-rose-600">
              <XCircle className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters & Table */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-6 rounded-lg bg-slate-50 p-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by student, type, or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <Table headers={["Student", "Leave Details", "Duration", "Status", "Review Notes", "Actions"]}>
          {filteredRequests.map((req) => {
            const student = getStudentInfo(req.studentId);
            return (
              <TableRow key={req.id}>
                <TableCell>
                  <div>
                    <p className="font-semibold text-slate-900">{student.name}</p>
                    <p className="text-xs text-slate-550">{student.course}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-slate-100 rounded text-slate-700 mb-1">
                      {req.type}
                    </span>
                    <p className="text-sm text-slate-600 line-clamp-2 max-w-xs">{req.reason}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-slate-700">
                    <p>{req.startDate} to</p>
                    <p>{req.endDate}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold leading-none capitalize ${getStatusColor(req.status)}`}>
                    {getStatusIcon(req.status)}
                    <span className="ml-1">{req.status}</span>
                  </span>
                </TableCell>
                <TableCell>
                  <p className="text-xs text-slate-500 italic max-w-xs truncate">
                    {req.reviewNote || "No notes added"}
                  </p>
                </TableCell>
                <TableCell>
                  {req.status === "pending" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => openReviewModal(req, "approved")}
                        className="inline-flex h-7 w-7 items-center justify-center bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition"
                        title="Approve leave"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openReviewModal(req, "rejected")}
                        className="inline-flex h-7 w-7 items-center justify-center bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition"
                        title="Reject leave"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">Reviewed</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </Table>
      </Card>

      {/* Review Dialog Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => {
          setShowReviewModal(false);
          setSelectedRequest(null);
        }}
        title={`Review Request: ${reviewStatus === "approved" ? "Approval" : "Rejection"}`}
      >
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Add Decision Feedback Note
            </label>
            <textarea
              required
              rows={4}
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder={`Provide feedback to the student regarding this ${reviewStatus}...`}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setShowReviewModal(false);
                setSelectedRequest(null);
              }}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={reviewMutation.isPending}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 ${
                reviewStatus === "approved"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-rose-600 hover:bg-rose-700"
              }`}
            >
              {reviewMutation.isPending ? "Submitting..." : `Submit ${reviewStatus}`}
            </button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default LeaveReview;
