import { Router } from "express";
import {
  createStory,
  getActiveStories,
  deleteStory,
} from "../controllers/storiesController.js";
import verifyUser from "../middlewares/verifyUser.js";
import { upload } from "../utils/multer.js";

const router = Router();

router.get("/get-stories", getActiveStories);

router.post("/add-stories", verifyUser, upload.single("media"), createStory);
router.delete("/stories/:id", verifyUser, deleteStory);

export default router;
