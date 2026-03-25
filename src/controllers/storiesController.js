import { uploadMedias, deleteMedia } from "../middlewares/uploadMedias.js";
import Story from "../models/storyModel.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

export const createStory = asyncErrorHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No media file provided" });
  }

  const uploaded = await uploadMedias(req.file);

  const story = await Story.create({
    mediaUrl: {
      public_id: uploaded.public_id,
      url: uploaded.url,
    },
  });

  return res.status(201).json({
    message: "Story created successfully",
    data: story,
  });
});

export const getActiveStories = async (req, res) => {
  const stories = await Story.find({
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: 1 }); //oldest - newest -> FIFO

  return res.status(200).json({
    message: "Stories fetched successfully",
    data: stories,
  });
};

export const deleteStory = async (req, res) => {
  const story = await Story.findById(req.params.id);

  if (!story) {
    return res.status(404).json({ message: "Story not found" });
  }

  if (story.mediaUrl?.public_id) {
    await deleteMedia(story.mediaUrl.public_id);
  }

  await story.deleteOne();

  return res.status(200).json({ message: "Story deleted successfully" });
};
