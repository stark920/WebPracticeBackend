const upload = require('./upload');
const validate = require('./validate');
const { isAuth, sendJWT } = require('./auth');

module.exports = {
  upload,
  validate,
  isAuth,
  sendJWT,
};
