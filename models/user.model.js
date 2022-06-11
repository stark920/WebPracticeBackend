const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    name: {
      type: String,
      length: {
        min: 2,
        max: 10,
      },
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      select: false,
    },
    password: {
      type: String,
      required: true,
      length: {
        min: 8,
        max: 20,
      },
      select: false,
    },
    avatar: {
      type: String,
      default: 'https://i.imgur.com/gA5JWK5.png',
    },
    followers: {
      type: [
        {
          _id: false,
          user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
      select: false,
    },
    following: {
      type: [
        {
          _id: false,
          user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      select: false,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'others'],
      default: 'others',
    },
  },
  {
    versionKey: false,
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
