import User from "../models/User.js";
import { ensureNotLastAdmin } from "../services/userService.js";

const editableProfileFields = [
  "name",
  "email",
  "phone",
  "address",
  "department",
  "designation",
  "subjects",
  "avatar",
];

const adminEditableUserFields = [
  "name",
  "email",
  "role",
  "phone",
  "address",
  "studentId",
  "facultyId",
  "adminId",
  "course",
  "semester",
  "department",
  "designation",
  "subjects",
  "permissions",
  "status",
  "avatar",
];

export const getUsers = async (req, res) => {
  const filter = req.query.role && req.query.role !== "all" ? { role: req.query.role } : {};

  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, parseInt(req.query.limit, 10) || 50);

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    User.countDocuments(filter),
  ]);

  // Issue #6: Return pagination metadata alongside data.
  // For backward compatibility, if no page/limit was explicitly requested,
  // return just the array (frontend currently expects an array).
  if (!req.query.page && !req.query.limit) {
    return res.json(users);
  }

  res.json({
    data: users,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
};

// Issue #2: Password is now required — no more default "password"
export const createUser = async (req, res) => {
  const { password, ...rest } = req.body;
  if (!password || password.length < 6) {
    res.status(400);
    throw new Error("Password is required and must be at least 6 characters");
  }
  const user = await User.create({ ...rest, password });
  res.status(201).json(user);
};

// Issue #9: Uses shared service for last-admin check
export const updateUser = async (req, res) => {
  const targetUser = await User.findById(req.params.id);
  if (!targetUser) {
    res.status(404);
    throw new Error("User not found");
  }

  const updates = {};
  adminEditableUserFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  if (updates.email) {
    const exists = await User.findOne({
      email: updates.email,
      _id: { $ne: req.params.id },
    });
    if (exists) {
      res.status(409);
      throw new Error("Email already registered");
    }
  }

  if (req.body.password) {
    targetUser.password = req.body.password;
  }

  // Issue #9: extracted into reusable service
  if (updates.role && updates.role !== targetUser.role) {
    await ensureNotLastAdmin(req.params.id, updates.role);
  }

  Object.assign(targetUser, updates);
  const user = await targetUser.save();

  res.json(user);
};

// Issue #9: Uses shared service for last-admin check
export const deleteUser = async (req, res) => {
  if (req.params.id === req.user.id) {
    res.status(400);
    throw new Error("You cannot delete your own account");
  }

  const targetUser = await User.findById(req.params.id);
  if (!targetUser) {
    res.status(404);
    throw new Error("User not found");
  }

  // Issue #9: extracted into reusable service
  await ensureNotLastAdmin(req.params.id);

  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
};

export const updateProfile = async (req, res) => {
  const updates = {};
  editableProfileFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  if (updates.email) {
    const exists = await User.findOne({
      email: updates.email,
      _id: { $ne: req.user.id },
    });
    if (exists) {
      res.status(409);
      throw new Error("Email already registered");
    }
  }

  const user = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true,
  });

  res.json(user);
};
