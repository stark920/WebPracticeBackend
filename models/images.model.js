const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      require: true,
    },
    deleteHash: {
      type: String,
      require: true,
    },
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
