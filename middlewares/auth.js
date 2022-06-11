const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const Users = require('../models/user.model');

const isAuth = async (req, res, next) => {
  if (!req.headers.authorization)
    return next(new ApiError(403, '未提供授權資訊'));

  const [tokenType, token] = req.headers.authorization.split(' ');
  if (tokenType !== 'Bearer')
    return next(new ApiError(403, '授權資訊格式錯誤'));
  if (!token) return next(new ApiError(401, '請先登入'));

  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) reject(next(new ApiError(401, '未授權')));
      resolve(payload);
    });
  });

  const user = await Users.findById(decoded.id);
  if (!user) return next(new ApiError(401, '此帳號無法使用，請聯繫管理員'));

  req.user = user;

  next();
};

const sendJWT = (data, statusCode, res) => {
  const token = jwt.sign({ id: data._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });

  res.set('Authorization', `Bearer ${token}`);
  res.status(statusCode).send({
    status: true,
    data,
  });
};

module.exports = { isAuth, sendJWT };
