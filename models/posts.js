const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'Users',
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
      type: [
        {
          user: {
            type: mongoose.Schema.ObjectId,
            ref: 'Users',
          },
          content: String,
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
  },
  {
    versionKey: false,
    collection: 'Posts',
  }
);

const Posts = mongoose.model('Posts', postSchema);

module.exports = Posts;
