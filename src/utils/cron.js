// import cron from "node-cron"; // npm i node-cron
// import Story from "../models/story.model.js";
// import { deleteMedia } from "./uploadMedias.js";

// // Runs every hour
// const startStoryCleanup = () => {
//   cron.schedule("0 * * * *", async () => {
//     try {
//       const expiredStories = await Story.find({
//         expiresAt: { $lte: new Date() },
//       });

//       for (const story of expiredStories) {
//         if (story.mediaUrl?.public_id) {
//           await deleteMedia(story.mediaUrl.public_id);
//         }
//         await story.deleteOne();
//       }

//       console.log(`Cleaned up ${expiredStories.length} expired stories`);
//     } catch (error) {
//       console.error("Story cleanup failed:", error.message);
//     }
//   });
// };

// export { startStoryCleanup };
