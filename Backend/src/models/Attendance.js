import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["present", "absent", "late"],
      default: "present",
    },
  },
  { timestamps: true }
);

attendanceSchema.index({ studentId: 1, subjectId: 1, date: 1 }, { unique: true });

attendanceSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.studentId = ret.studentId?.toString();
    ret.subjectId = ret.subjectId?.toString();
    ret.date = ret.date?.toISOString().slice(0, 10);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("Attendance", attendanceSchema);
