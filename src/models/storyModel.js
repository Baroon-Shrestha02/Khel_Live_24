import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    mediaUrl: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
    expiresAt: {
      type: Date,
      default: () => Date.now() + 24 * 60 * 60 * 1000, // exists for 24hrs only
    },
  },
  { timestamps: true },
);

// Auto-delete from DB after expiresAt
// storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Story = mongoose.model("Story", storySchema);
export default Story;
