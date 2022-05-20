const multer = require('multer');
const appError = require('../service/appError');

const upload = {
  avatar: multer({
    limit: {
      fileSize: 536576,
    },
    fileFilter(req, file, next) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return appError(400, '檔案格式不符', next);
      }
      const fileSize = parseInt(req.headers['content-length']);
      if (fileSize > 536576) {
        return appError(400, '檔案過大', next);
      }
      next(null, true);
    },
  }),
  photo: multer({
    limit: {
      fileSize: 1048576,
    },
    fileFilter(req, file, next) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return appError(400, '檔案格式不符', next);
      }
      const fileSize = parseInt(req.headers['content-length']);
      if (fileSize > 1048576) {
        return appError(400, '檔案過大', next);
      }
      next(null, true);
    },
  }),
};

module.exports = upload;
