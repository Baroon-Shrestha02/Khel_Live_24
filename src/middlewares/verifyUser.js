import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import Admin from "../models/adminModel.js";

const verifyUser = asyncErrorHandler(async (req, res, next) => {
  let token;

  if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new AppError("Not authorized.", 401));
  }

  if (!token) {
    return next(new AppError("Not authorized. No token provided.", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await Admin.findById(decoded.id).select("-password");

  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  req.user = user;

  next();
});

export default verifyUser;
