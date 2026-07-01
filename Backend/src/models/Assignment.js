import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    dueDate: { type: Date, required: true },
    maxScore: { type: Number, default: 100 },
    fileUrl: String,
  },
  { timestamps: true }
);

assignmentSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.subjectId = ret.subjectId?.toString();
    ret.dueDate = ret.dueDate?.toISOString().slice(0, 10);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("Assignment", assignmentSchema);
