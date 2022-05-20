const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      require: true,
      ref: 'Users',
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      require: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'Roles',
  }
);

const Roles = mongoose.model('Roles', roleSchema);

module.exports = Roles;
