import mongoose from "mongoose";

const systemSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: "default" },
    systemName: { type: String, default: "EduManage College System" },
    systemEmail: { type: String, default: "admin@college.edu" },
    timezone: { type: String, default: "UTC+05:30" },
    dateFormat: { type: String, default: "DD/MM/YYYY" },
    passwordMinLength: { type: Number, default: 8 },
    sessionTimeout: { type: Number, default: 30 },
    twoFactorAuth: { type: Boolean, default: false },
    loginAttempts: { type: Number, default: 3 },
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    pushNotifications: { type: Boolean, default: true },
    attendanceAlerts: { type: Boolean, default: true },
    gradeAlerts: { type: Boolean, default: true },
    eventReminders: { type: Boolean, default: true },
    academicYear: { type: String, default: "2023-2024" },
    semesterSystem: { type: Boolean, default: true },
    gradingScale: { type: String, default: "percentage" },
    attendanceThreshold: { type: Number, default: 75 },
    maxAbsences: { type: Number, default: 5 },
  },
  { timestamps: true }
);

systemSettingsSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("SystemSettings", systemSettingsSchema);
