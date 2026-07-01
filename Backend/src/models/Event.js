import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    type: {
      type: String,
      enum: ["workshop", "seminar", "cultural", "sports"],
      default: "workshop",
    },
    maxParticipants: Number,
    registeredCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
    createdBy: { type: String, default: "Admin" },
  },
  { timestamps: true }
);

eventSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.date = ret.date?.toISOString().slice(0, 10);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("Event", eventSchema);
