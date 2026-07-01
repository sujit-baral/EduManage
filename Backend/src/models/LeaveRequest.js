import mongoose from "mongoose";

const leaveRequestSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    submittedAt: { type: Date, default: Date.now },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedAt: Date,
    reviewNote: String,
  },
  { timestamps: true }
);

leaveRequestSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.studentId = ret.studentId?.toString();
    ret.reviewedBy = ret.reviewedBy?.toString();
    ret.startDate = ret.startDate?.toISOString().slice(0, 10);
    ret.endDate = ret.endDate?.toISOString().slice(0, 10);
    ret.submittedAt = ret.submittedAt?.toISOString().slice(0, 10);
    ret.reviewedAt = ret.reviewedAt?.toISOString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

leaveRequestSchema.index({ studentId: 1 });

export default mongoose.model("LeaveRequest", leaveRequestSchema);
