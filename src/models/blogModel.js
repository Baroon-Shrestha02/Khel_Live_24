import mongoose from "mongoose"; // Import mangooseto create schema and model
import slugify from "slugify";

//Define the schema for blog
const blogSchema = new mongoose.Schema(
  {
    //title of the blog
    title: {
      type: String,

      required: true,
      trim: true,
    },
   //URL friendly version of the title
    slug: {
      type: String,
      //Each slug must be unique
      unique: true,
    },
    //Short description of the blog show on listeing pages
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
    },
  //The admin/user who published the blog
    publishedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin", // 👈 only admin can publish
      required: true,
    },
   //Tags for the blog(array of strings )
    tags: [
      {
        type: String,
        trim: true, //remove extra spaces from each tag
      },
    ],
   //category of the blog
    category: {
      type: String,
      trim: true,
    },
 //Status can be draft or published
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    //Whether the blog is featured or not
    isFeatured: {
      type: Boolean,
      default: false,
    },

    //When the blog was published
    publishedAt: {
      type: Date,
    },
  },
  { timestamps: true }, //Automatically and createdAt and updatedAt fields
);

//Pre save hook to generate slug and set publishedAt
blogSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: false });
  }
  
// if status is published and published is empty set [publisheed the curren data]
  if (this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
//continue saving the documents
  next();
});

const Blog = mongoose.model("Blog", blogSchema);
// Exports the blog model so it can be used in other parts of the application(like controllers)
export default Blog;
