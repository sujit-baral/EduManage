import mongoose from "mongoose";

const eventRegistrationSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    registeredAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

eventRegistrationSchema.index({ eventId: 1, studentId: 1 }, { unique: true });

eventRegistrationSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.eventId = ret.eventId?.toString();
    ret.studentId = ret.studentId?.toString();
    ret.registeredAt = ret.registeredAt?.toISOString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("EventRegistration", eventRegistrationSchema);
