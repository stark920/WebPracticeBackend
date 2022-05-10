const Users = require('../models/users');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { handleErrorAsync, appError, generateJWT } = require('../service');

const users = {
  checkToken: handleErrorAsync(async (req, res, next) => {
    const data = await Users.findById(req.user.id).select('name avatar');
    res.send({
      status: true,
      data
    })
  }),
  signUp: handleErrorAsync(async (req, res, next) => {
    const { errors } = validationResult(req);
    if (errors.length > 0) {
      return res.status(400).send({
        status: false,
        message: errors.map((el) => el.msg),
      });
    }

    const { email, name } = req.body;
    const password = await bcrypt.hash(req.body.password, 12);
    const data = await Users.create({ email, password, name });
    generateJWT(data, 201, res);
  }),
  signIn: handleErrorAsync(async (req, res, next) => {
    const { errors } = validationResult(req);
    if (errors.length > 0) {
      return res.status(400).send({
        status: false,
        message: errors.map((el) => el.msg),
      });
    }

    const { email, password } = req.body;
    const user = await Users.findOne({ email }).select('+password');
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return appError(400, '帳號或密碼 錯誤', next);
    }

    generateJWT(user, 201, res);
  }),
  getProfile: handleErrorAsync(async (req, res, next) => {
    if (req.params.id === 'isLogin') {
      const { name, avatar = undefined } = req.user;
      res.send({
        status: true,
        data: { name, avatar },
      });
    }
  }),
  updateProfile: handleErrorAsync(async (req, res, next) => {
    const { errors } = validationResult(req);
    if (errors.length > 0) {
      return res.status(400).send({
        status: false,
        message: errors.map((el) => el.msg),
      });
    }
    // Todo: imgur
    const { name, gender } = req.body;
    const data = await Users.findByIdAndUpdate(
      req.user._id,
      {
        name,
        gender,
      },
      { new: true }
    );

    res.send({
      status: true,
      data,
    });
  }),
  updatePassword: handleErrorAsync(async (req, res, next) => {
    const { errors } = validationResult(req);
    if (errors.length > 0) {
      return res.status(400).send({
        status: false,
        message: errors.map((el) => el.msg),
      });
    }

    const password = await bcrypt.hash(req.body.password, 12);
    await Users.findByIdAndUpdate(
      req.user._id,
      {
        password,
      },
      { new: true }
    ).select('+password');

    res.send({
      status: true,
      message: '密碼更新成功',
    });
  }),
};

module.exports = users;
