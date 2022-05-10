const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    avatar: {
      type: String,
    },
    gender: {
      type: Number,
      enum: [0, 1, 2],
    },
  },
  {
    versionKey: false,
    collection: 'Users',
  }
);

const Users = mongoose.model('Users', userSchema);

module.exports = Users;
