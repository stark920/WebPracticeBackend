const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'Users'
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    content: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      default: [],
    },
    likes: {
      type: Array,
      default: [],
    },
    messages: {
      type: Array,
      default: [],
    },
  },
  {
    versionKey: false,
    collection: "Posts",
  }
);

const Posts = mongoose.model("Posts", postSchema);

module.exports = Posts;
