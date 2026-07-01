import LeaveRequest from "../models/LeaveRequest.js";

export const getLeaveRequests = async (req, res) => {
  const filter = req.user?.role === "student" ? { studentId: req.user.id } : {};
  const requests = await LeaveRequest.find(filter).sort({ submittedAt: -1 });
  res.json(requests);
};

export const createLeaveRequest = async (req, res) => {
  const { type, startDate, endDate, reason } = req.body;

  if (new Date(endDate) < new Date(startDate)) {
    res.status(400);
    throw new Error("End date cannot be before start date");
  }

  const request = await LeaveRequest.create({
    studentId: req.user.id,
    type,
    startDate,
    endDate,
    reason,
  });

  res.status(201).json(request);
};

export const reviewLeaveRequest = async (req, res) => {
  const { status, reviewNote } = req.body;

  const request = await LeaveRequest.findByIdAndUpdate(
    req.params.id,
    {
      status,
      reviewNote,
      reviewedBy: req.user.id,
      reviewedAt: new Date(),
    },
    { new: true, runValidators: true }
  );

  if (!request) {
    res.status(404);
    throw new Error("Leave request not found");
  }

  res.json(request);
};
