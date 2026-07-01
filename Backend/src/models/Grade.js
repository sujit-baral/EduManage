import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    type: { type: String, required: true },
    score: { type: Number, required: true },
    maxScore: { type: Number, required: true },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

gradeSchema.set("toJSON", {
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

gradeSchema.index({ studentId: 1 });
gradeSchema.index({ subjectId: 1 });
gradeSchema.index({ studentId: 1, subjectId: 1 });

export default mongoose.model("Grade", gradeSchema);
