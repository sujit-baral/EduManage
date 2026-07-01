import mongoose from "mongoose";

const libraryLoanSchema = new mongoose.Schema(
  {
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "LibraryBook", required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    issueDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    returnedAt: Date,
    status: {
      type: String,
      enum: ["active", "overdue", "returned", "reserved"],
      default: "active",
    },
  },
  { timestamps: true }
);

libraryLoanSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.bookId = ret.bookId?.toString();
    ret.studentId = ret.studentId?.toString();
    ret.issueDate = ret.issueDate?.toISOString().slice(0, 10);
    ret.dueDate = ret.dueDate?.toISOString().slice(0, 10);
    ret.returnedAt = ret.returnedAt?.toISOString().slice(0, 10);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

libraryLoanSchema.index({ studentId: 1 });
libraryLoanSchema.index({ bookId: 1 });

export default mongoose.model("LibraryLoan", libraryLoanSchema);
