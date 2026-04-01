import express from "express";
import {
  getLoggedUser,
  login,
  logout,
  register,
} from "../controllers/authController.js";
import verifyUser from "../middlewares/verifyUser.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.get("/logged-user", verifyUser, getLoggedUser);
export default router;
