const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      require: true,
      ref: 'Users',
    },
    likes: {
      type: [mongoose.Schema.ObjectId],
      default: [],
      ref: 'Posts'
    },
  },
  {
    versionKey: false,
    collection: 'Likes',
  }
);

const Likes = mongoose.model('Likes', likeSchema);

module.exports = Likes;
