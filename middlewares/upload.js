const multer = require('multer');
const ApiError = require('../utils/ApiError');

const limit = {
  type: ['jpg', 'jpeg', 'png'],
  size: {
    avatar: 500 * 1024,
    photo: 1024 * 1024,
  },
};

const checkFileType = (file) => {
  const [type, subtype] = file.mimetype.split('/');
  return type === 'image' && limit.type.includes(subtype);
};

const upload = {
  avatar: multer({
    limit: {
      fileSize: limit.size.avatar,
    },
    fileFilter(req, file, next) {
      if (!checkFileType(file)) {
        return next(new ApiError(400, '檔案格式不符'));
      }
      const fileSize = parseInt(req.headers['content-length'], 10);
      if (fileSize > limit.size.avatar) {
        return next(new ApiError(400, '檔案過大'));
      }
      next(null, true);
    },
  }),
  photo: multer({
    limit: {
      fileSize: limit.size.photo,
    },
    fileFilter(req, file, next) {
      if (!checkFileType(file)) {
        return next(new ApiError(400, '檔案格式不符'));
      }
      const fileSize = parseInt(req.headers['content-length'], 10);
      if (fileSize > limit.size.photo) {
        return next(new ApiError(400, '檔案過大'));
      }
      next(null, true);
    },
  }),
};

module.exports = upload;
