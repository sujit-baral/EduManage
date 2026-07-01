import { useState } from "react";
import {
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
} from "lucide-react";
import Card from "../../components/common/Card";
import Modal from "../../components/common/Modal";
import { Table, TableRow, TableCell } from "../../components/common/Table";
import { useApiResource } from "../../hooks/useApiResource";
import { api } from "../../services/api";
import { toast } from "react-toastify";

const StudentLeave = () => {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const { data: leaveRequests, setData: setLeaveRequests } = useApiResource(
    api.getLeaveRequests
  );

  const [formData, setFormData] = useState({
    type: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newRequest = await api.createLeaveRequest(formData);
    setLeaveRequests([...leaveRequests, newRequest]);
    setFormData({ type: "", startDate: "", endDate: "", reason: "" });
    setShowRequestModal(false);
    toast.success("Leave request submitted");
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

  const approvedRequests = leaveRequests.filter(
    (req) => req.status === "approved"
  ).length;
  const pendingRequests = leaveRequests.filter(
    (req) => req.status === "pending"
  ).length;
  const rejectedRequests = leaveRequests.filter(
    (req) => req.status === "rejected"
  ).length;

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-lg border border-slate-250 bg-white/70 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/25 transition";
  const labelClass =
    "block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2";

  return (
    <div className="space-y-8 font-sans antialiased">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-display">
            Leave Requests
          </h1>
          <p className="text-sm text-slate-505 font-medium font-sans">
            Submit leave applications and monitor approval statuses
          </p>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => setShowRequestModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-650 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/10 hover:bg-indigo-755 transition cursor-pointer"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Request Leave</span>
          </button>
        </div>
      </div>

      {/* -----------------------------------------Stats--------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:-translate-y-0.5 transition duration-200">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50/80 text-indigo-650 border border-indigo-100/30">
              <FileText className="h-5.5 w-5.5" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Requests</p>
              <p className="text-2xl font-bold text-slate-900 font-display mt-0.5">
                {leaveRequests.length}
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
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Approved</p>
              <p className="text-2xl font-bold text-slate-900 font-display mt-0.5">
                {approvedRequests}
              </p>
            </div>
          </div>
        </Card>

        <Card className="hover:-translate-y-0.5 transition duration-200">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50/80 text-amber-650 border border-amber-100/30">
              <AlertCircle className="h-5.5 w-5.5" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Pending</p>
              <p className="text-2xl font-bold text-slate-900 font-display mt-0.5">
                {pendingRequests}
              </p>
            </div>
          </div>
        </Card>

        <Card className="hover:-translate-y-0.5 transition duration-200">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50/80 text-rose-650 border border-rose-100/30">
              <XCircle className="h-5.5 w-5.5" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Rejected</p>
              <p className="text-2xl font-bold text-slate-900 font-display mt-0.5">
                {rejectedRequests}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* -------------------------------Leave Requests Table -------------------------------*/}
      <Card title="Your Leave Requests" subtitle="Overview of submitted leave applications">
        <Table
          headers={[
            "Type",
            "Dates",
            "Duration",
            "Reason",
            "Status",
            "Submitted",
          ]}
        >
          {leaveRequests.map((request) => {
            const startDate = new Date(request.startDate);
            const endDate = new Date(request.endDate);
            const duration =
              Math.ceil(
                (endDate.getTime() - startDate.getTime()) /
                  (1000 * 60 * 60 * 24)
              ) + 1;

            return (
              <TableRow key={request.id}>
                <TableCell>
                  <span className="font-medium text-slate-900">
                    {request.type}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="text-xs font-medium text-slate-500 space-y-0.5">
                    <div>{startDate.toLocaleDateString(undefined, { dateStyle: 'medium' })}</div>
                    {request.startDate !== request.endDate && (
                      <div className="text-slate-400">
                        to {endDate.toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-slate-600 font-medium text-xs bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                    {duration} day{duration > 1 ? "s" : ""}
                  </span>
                </TableCell>
                <TableCell>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-xs font-medium truncate" title={request.reason}>
                    {request.reason}
                  </p>
                </TableCell>
                <TableCell>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full capitalize shrink-0 shadow-3xs border border-transparent select-none bg-slate-50 text-slate-700">
                    {getStatusIcon(request.status)}
                    <span className={getStatusColor(request.status).split(" ")[1]}>
                      {request.status}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-slate-500 font-medium">
                    {new Date(request.submittedAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </Table>
      </Card>

      {/*---------------------------------- Request Leave Modal --------------------------*/}
      <Modal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        title="Request Leave"
        className="sm:max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={labelClass}>
              Leave Type
            </label>
            <select
              name="type"
              required
              value={formData.type}
              onChange={handleInputChange}
              className={inputClass}
            >
              <option value="">Select leave type</option>
              <option value="Medical Leave">Medical Leave</option>
              <option value="Personal Leave">Personal Leave</option>
              <option value="Emergency Leave">Emergency Leave</option>
              <option value="Family Leave">Family Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                required
                value={formData.startDate}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                required
                value={formData.endDate}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Reason for Leave
            </label>
            <textarea
              name="reason"
              required
              rows={3}
              value={formData.reason}
              onChange={handleInputChange}
              placeholder="Provide context for your leave request..."
              className={inputClass}
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowRequestModal(false)}
              className="px-4 py-2.5 text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 bg-indigo-650 hover:bg-indigo-755 text-white rounded-xl transition text-xs font-semibold cursor-pointer"
            >
              Submit Request
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentLeave;
