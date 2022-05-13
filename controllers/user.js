const Users = require('../models/users');
const bcrypt = require('bcrypt');
const {
  handleErrorAsync,
  appError,
  generateJWT,
  validateError,
} = require('../service');

const user = {
  signUp: handleErrorAsync(async (req, res, next) => {
    const inValid = await validateError(req, res, next);
    if (inValid) return;

    const { email, name } = req.body;
    const password = await bcrypt.hash(req.body.password, 12);
    const data = await Users.create({ email, password, name });
    generateJWT(data, 201, res);
  }),
  signIn: handleErrorAsync(async (req, res, next) => {
    const inValid = await validateError(req, res, next);
    if (inValid) return;

    const { email, password } = req.body;
    const user = await Users.findOne({ email }).select('+password');
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return appError(400, '帳號或密碼錯誤', next);
    }

    generateJWT(user, 201, res);
  }),
  checkToken: handleErrorAsync(async (req, res, next) => {
    if (!req.user) {
      return appError(400, '帳號異常', next);
    }

    res.send({
      status: true,
      data: req.user,
    });
  }),
  addFollow: handleErrorAsync(async (req, res, next) => {
    res.send({
      status: true,
      data: req.params.id,
    });
  }),

  // 以下 Todo........
  deleteAccount: handleErrorAsync(async (req, res, next) => {
    // const result = await Users.findByIdAndDelete(req.user._id);
    // if (!result) {
    //   return appError(400, '帳號已刪除或不存在', next);
    // }

    res.send({
      status: true,
      message: '帳號刪除成功(假的)',
    });
  }),

  updateProfile: handleErrorAsync(async (req, res, next) => {
    const inValid = await validateError(req, res, next);
    if (inValid) return;
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
    const inValid = await validateError(req, res, next);
    if (inValid) return;

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
  getProfile: handleErrorAsync(async (req, res, next) => {
    res.send({
      status: true,
      message: 'to be continued',
    });
  }),
};

module.exports = user;
