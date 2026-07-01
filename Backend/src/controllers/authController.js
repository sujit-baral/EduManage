import User from "../models/User.js";
import { generateToken } from "../utils/token.js";

const userResponse = (user) => ({
  user: user.toJSON(),
  token: generateToken(user._id),
});

export const registerStudent = async (req, res) => {
  const { name, email, password, studentId, course, semester, phone } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(409);
    throw new Error("Email already registered");
  }

  const user = await User.create({
    name,
    email,
    password,
    role: "student",
    studentId,
    course,
    semester,
    phone,
  });

  res.status(201).json(userResponse(user));
};

export const login = async (req, res) => {
  const { email, password, role } = req.body;
  const user = await User.findOne({ email, role }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  res.json(userResponse(user));
};

export const me = async (req, res) => {
  res.json({ user: req.user });
};
