const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'Users',
    },
    content: {
      type: String,
      length: {
        min: 1,
        max: 1000
      },
      required: true,
    },
    images: {
      type: [
        {
          url: {
            type: String,
            required: true,
          },
          deleteHash: {
            type: String,
            required: true,
            select: false,
          },
        },
      ],
      default: [],
    },
    likesNum: {
      type: Number,
      default: 0
    },
    likes: [{
      type: mongoose.Schema.ObjectId,
      ref: 'Users',
      default: [],
    }],
    comments: {
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
    timestamps: true,
    versionKey: false,
    collection: 'Posts',
  }
);

const Posts = mongoose.model('Posts', postSchema);

module.exports = Posts;
