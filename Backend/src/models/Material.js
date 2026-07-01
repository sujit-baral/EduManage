import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["lecture", "assignment", "reference", "exam"],
      default: "lecture",
    },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    fileName: String,
    fileSize: String,
    uploadDate: { type: Date, default: Date.now },
    downloads: { type: Number, default: 0 },
  },
  { timestamps: true }
);

materialSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.subjectId = ret.subjectId?.toString();
    ret.uploadDate = ret.uploadDate?.toISOString().slice(0, 10);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("Material", materialSchema);
