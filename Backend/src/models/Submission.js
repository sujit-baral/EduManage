import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment", required: true },
    submittedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["submitted", "graded", "late"],
      default: "submitted",
    },
    grade: Number,
    maxGrade: { type: Number, default: 100 },
    feedback: String,
    fileName: String,
  },
  { timestamps: true }
);

submissionSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.studentId = ret.studentId?.toString();
    ret.assignmentId = ret.assignmentId?.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

submissionSchema.index({ studentId: 1 });
submissionSchema.index({ assignmentId: 1 });

export default mongoose.model("Submission", submissionSchema);
