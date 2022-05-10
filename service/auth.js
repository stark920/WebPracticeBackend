const jwt = require('jsonwebtoken');
const appError = require('./appError');
const handleErrorAsync = require('./handleErrorAsync');
const Users = require('../models/users');

const isAuth = handleErrorAsync(async (req, res, next) => {
  // check token
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return appError(401, '請先登入', next);

  // verify token
  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      err ? reject(err) : resolve(payload);
    });
  });

  const user = await Users.findById(decoded.id);
  req.user = user;

  next();
});

const generateJWT = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });

  res.status(statusCode).send({
    status: true,
    data: {
      user: user.name,
      token,
    },
  });
};

module.exports = { isAuth, generateJWT };
