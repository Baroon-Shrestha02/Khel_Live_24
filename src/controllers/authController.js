import AppError from "../utils/appError.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";

export const register = asyncErrorHandler(async (req, res, next) => {
  const { firstname, lastname, email, phone, password } = req.body;

  if (!firstname || !lastname || !email || !password)
    return next(new AppError("Please fill all the fields", 404));

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  const existingUser = await Admin.findOne({
    $or: [{ email }, { phone }],
  });

  if (existingUser) {
    return next(new AppError("User already exists.", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    firstname,
    lastname,
    email,
    password: hashedPassword,
    role: "user",
  };
  const admin = await Admin.create(newUser);

  res.status(201).json({
    status: "success",
    message: "User registration success.",
    data: admin,
  });
});

export const login = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError("Email and password are required.", 400));

  // find user
  const user = await Admin.findOne({ email }).select("+password");

  if (!user) {
    return next(new AppError("Invalid credentials.", 401));
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return next(new AppError("Invalid credentials", 401));

  const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  };

  const token = generateToken(user._id);

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json({
      status: "success",
      message: "Login successful",
    });
});

export const getLoggedUser = asyncErrorHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

//logout
export const logout = asyncErrorHandler(async (req, res, next) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    })
    .status(200)
    .json({
      success: true,
      message: "Logged out successfully",
    });
});
