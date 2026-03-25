import express from "express";
import {
  createBlog,
  deleteBlog,
  getBlogs,
  getOneBlog,
  updateBlog,
} from "../controllers/blogController.js";

const router = express.Router();

// ✅ CREATE
router.post("/blogs/create", createBlog);

// ✅ GET ALL
router.get("/blogs", getBlogs);

// ✅ GET ONE
router.get("/blogs/:id", getOneBlog);

// ✅ UPDATE
router.put("/blogs/:id", updateBlog);

// ✅ DELETE
router.delete("/blogs/:id", deleteBlog);

export default router;