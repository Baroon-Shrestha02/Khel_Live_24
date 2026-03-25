import cron from "node-cron"; // npm i node-cron
import Story from "../models/storyModel.js";
import { deleteMedia } from "../middlewares/uploadMedias.js";

// this function runs every hour and cleans up expired stories from db and cloudinary files
export const startStoryCleanup = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      const expiredStories = await Story.find({
        expiresAt: { $lte: new Date() },
      });
      // loop through the cloudinary files and finds the expired cloudinary files using public id and deletes them
      for (const story of expiredStories) {
        if (story.mediaUrl?.public_id) {
          await deleteMedia(story.mediaUrl.public_id);
        }
        await story.deleteOne();
      }

      if (expiredStories.length > 0) {
        console.log(`Cleaned up ${expiredStories.length} expired stories`);
      }
    } catch (error) {
      console.error("Story cleanup failed:", error.message);
    }
  });
};
