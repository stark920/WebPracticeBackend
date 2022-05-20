const { resErrorDev, resErrorProd } = require('./handleErrorResponse');
const handleErrorAsync = require('./handleErrorAsync');
const appError = require('./appError');
const { isAuth, generateJWT } = require('./auth');

module.exports = {
  resErrorDev,
  resErrorProd,
  handleErrorAsync,
  appError,
  isAuth,
  generateJWT,
};
