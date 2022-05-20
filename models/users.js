const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now,
    },
    name: {
      type: String,
      length: {
        min: 2,
        max: 10
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
        max: 20
      },
      select: false,
    },
    avatar: {
      type: {
        _id: false,
        url: String,
        deleteHash: {
          type: String,
          select: false
        }
      },
    },
    facebook: {
      type: String,
      select: false
    },
    google: {
      type: String,
      select: false
    },
    github: {
      type: String,
      select: false
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'others'],
      default: 'others'
    },
    isLogin: {
      type: Boolean,
      default: false,
      select: false
    },
    isActive: {
      type: Boolean,
      default: true,
      select: false
    }
  },
  {
    versionKey: false,
    collection: 'Users',
  }
);

const Users = mongoose.model('Users', userSchema);

module.exports = Users;
