import mongoose from "mongoose";
import { nanoid } from "nanoid";
import slugify from "slugify";
import { transliterate } from "transliteration";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true }, // ✅ add slug field
    summary: { type: String, trim: true },
    category: {
      type: String,
      enum: ["Football", "Volleyball", "Cricket", "Others"],
      trim: true,
    },
    tags: [{ type: String }],
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    publishedAt: { type: Date }, // ✅ add publishedAt field
    heroImage: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
    content: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      default: "false",
    },
  },
  { timestamps: true },
);

blogSchema.pre("save", function () {
  if (!this.slug) {
    const transliterated = transliterate(this.title);
    const baseSlug = slugify(transliterated, {
      lower: true,
      strict: true,
    });
    this.slug = `${baseSlug}-${nanoid(6)}`;
  }

  if (this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

export default mongoose.model("Blog", blogSchema);
