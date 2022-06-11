const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.ObjectId,
      require: true,
      ref: 'Post',
    },
    user: {
      type: mongoose.Schema.ObjectId,
      require: true,
      ref: 'User',
    },
    comment: {
      type: String,
      length: {
        min: 1,
        max: 500,
      },
      require: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
