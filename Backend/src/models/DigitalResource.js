import mongoose from "mongoose";

const digitalResourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    url: { type: String, default: "#" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

digitalResourceSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("DigitalResource", digitalResourceSchema);
