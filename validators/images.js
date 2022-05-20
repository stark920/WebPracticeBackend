const multer = require('multer');
const appError = require('../service/appError');

function fileTypeCheck(file) {
  if (file.originalname === 'blob') {
    const filename = file.mimetype.split('/')[1];
    return ['jpg','jpeg','png'].indexOf(filename) > -1 ? true : false
  }
  return ['jpg','jpeg','png'].indexOf(file.originalname) > -1 ? true : false
}

const upload = {
  avatar: multer({
    limit: {
      fileSize: 536576,
    },
    fileFilter(req, file, next) {
      if (!fileTypeCheck(file)) {
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
      console.log(file, fileTypeCheck(file))
      if (!fileTypeCheck(file)) {
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
