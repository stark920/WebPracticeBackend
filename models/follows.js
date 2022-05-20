const mongoose = require('mongoose');

const followSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      require: true,
      ref: 'Users',
    },
    follow: {
      type: [mongoose.Schema.ObjectId],
      default: [],
    },
    followedBy: {
      type: [mongoose.Schema.ObjectId],
      default: [],
    },
  },
  {
    versionKey: false,
    collection: 'Follows',
  }
);

const Follows = mongoose.model('Follows', followSchema);

module.exports = Follows;
