import mongoose from "mongoose";

const libraryBookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    isbn: { type: String, required: true, unique: true, trim: true },
    category: { type: String, required: true, trim: true },
    availability: {
      type: String,
      enum: ["available", "issued", "reserved"],
      default: "available",
    },
    issuedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reservedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    dueDate: Date,
  },
  { timestamps: true }
);

libraryBookSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.issuedTo = ret.issuedTo?.toString();
    ret.reservedBy = ret.reservedBy?.toString();
    ret.dueDate = ret.dueDate?.toISOString().slice(0, 10);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("LibraryBook", libraryBookSchema);
