import express from "express";
import {
  createBlog,
  deleteBlog,
  getBlogs,
  getCategories,
  getFeaturedBlog,
  getOneBlog,
  updateBlog,
} from "../controllers/blogController.js";
import verifyUser from "../middlewares/verifyUser.js";
import { upload } from "../utils/multer.js";

const router = express.Router();

// ✅ CREATE
router.post(
  "/blogs/create",
  verifyUser,
  upload.single("heroImage"),
  createBlog,
);

// ✅ GET ALL
router.get("/blogs", getBlogs);

// ✅ GET ONE
router.get("/blogs/:id", getOneBlog);

// ✅ UPDATE
router.patch("/blogs/:id", verifyUser, upload.single("heroImage"), updateBlog);

// ✅ DELETE
router.delete("/blogs/:id", verifyUser, deleteBlog);

router.get("/categories", getCategories);

router.get("/featured", getFeaturedBlog);

export default router;
