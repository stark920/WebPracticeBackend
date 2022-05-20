const Users = require('../models/users');
const Roles = require('../models/roles');
const bcrypt = require('bcrypt');
const imgur = require('../service/imgur');
const { validationResult } = require('express-validator');
const { handleErrorAsync, appError, generateJWT } = require('../service');

const users = {
  // 註冊
  signUp: handleErrorAsync(async (req, res, next) => {
    const { errors } = validationResult(req);
    if (errors.length > 0) return appError(401, '輸入資料有誤', next);

    const { email, name } = req.body;
    const emailIsUsed = await Users.find({ email });
    if (emailIsUsed.length > 0) return appError(401, '信箱已被使用', next);

    const password = await bcrypt.hash(req.body.password, 12);
    const data = await Users.create({ email, password, name, isLogin: true });
    generateJWT(data, 201, res);
  }),
  // 登入
  signIn: handleErrorAsync(async (req, res, next) => {
    const { errors } = validationResult(req);
    if (errors.length > 0) return appError(401, '輸入資料有誤', next);

    const { email, password } = req.body;
    const user = await Users.findOne({ email }).select('+password +isActive');

    if (!user) return appError(401, '信箱或密碼錯誤', next);
    if (!user.isActive)
      return appError(401, '此帳號無法使用，請聯繫管理員', next);
    const result = await bcrypt.compare(password, user.password);
    if (!result) return appError(401, '信箱或密碼錯誤', next);

    await Users.findByIdAndUpdate(user._id, { isLogin: true });

    generateJWT(user, 200, res);
  }),
  // 檢查 Token
  check: handleErrorAsync(async (req, res, next) => {
    res.send({
      status: true,
      data: {
        name: req.user.name,
        avatar: req.user?.avatar?.url,
        gender: req.user.gender,
      },
    });
  }),
  // 登出
  signOut: handleErrorAsync(async (req, res, next) => {
    await Users.findByIdAndUpdate(req.user._id, { isLogin: false });
    res.send({ status: true, message: '登出成功' });
  }),
  // 修改個人資訊
  updateProfile: handleErrorAsync(async (req, res, next) => {
    const { errors } = validationResult(req);
    if (errors.length > 0) return appError(401, '輸入資料格式錯誤', next);

    const { name, gender } = req.body;
    const data = { name, gender };

    if (req.file) data.avatar = await imgur.upload.single(req.file);

    const result = await Users.findByIdAndUpdate(req.user._id, data, {
      new: true,
    });

    res.status(201).send({
      status: true,
      data: {
        name: result.name,
        avatar: result?.avatar?.url,
        gender: result.gender,
      },
    });
  }),
  // 修改密碼
  updatePassword: handleErrorAsync(async (req, res, next) => {
    const { errors } = validationResult(req);
    if (errors.length > 0) return appError(401, '輸入資料格式錯誤', next);

    const password = await bcrypt.hash(req.body.password, 12);
    await Users.findByIdAndUpdate(
      req.user._id,
      {
        password,
      },
      { new: true }
    ).select('+password');

    res.status(201).send({
      status: true,
      message: '密碼更新成功',
    });
  }),
  // 查詢指定使用者資訊
  getProfile: handleErrorAsync(async (req, res, next) => {
    const { errors } = validationResult(req);
    if (errors.length > 0) return appError(401, '輸入資料格式錯誤', next);

    const data = await Users.findById(req.params.id);
    if (!data) return appError(400, '無此使用者資訊', next);

    res.send({
      status: true,
      data,
    });
  }),
  // 停用帳戶
  deactivateAccount: handleErrorAsync(async (req, res, next) => {
    const { errors } = validationResult(req);
    if (errors.length > 0) return appError(401, '輸入資料有誤', next);

    const { email, password } = req.body;
    const user = await Users.findOne({ email }).select('+password');
    if (!user) return appError(401, '信箱或密碼錯誤', next);

    const result = await bcrypt.compare(password, user.password);
    if (!result) return appError(401, '信箱或密碼錯誤', next);

    await Users.findByIdAndUpdate(user._id, {
      isActive: false,
      isLogin: false,
    });

    res.status(201).send({
      status: true,
      message: '帳號已停用',
    });
  }),
  // Admin 取得全部使用者資訊
  getAllUsers: handleErrorAsync(async (req, res, next) => {
    const role = await Roles.findOne({ userId: req.user._id });
    if (!role || role.role !== 'admin')
      return appError(403, '您無此權限', next);

    const data = await Users.find().select('+email +isLogin +isActive');
    res.send({
      status: true,
      data,
    });
  }),
  // Admin 修改使用者資訊
  updateProfileAdmin: handleErrorAsync(async (req, res, next) => {
    const role = await Roles.findOne({ userId: req.user._id });
    if (!role || role.role !== 'admin')
      return appError(403, '您無此權限', next);

    const { errors } = validationResult(req);
    if (errors.length > 0) return appError(401, '輸入資料有誤', next);

    if (req.body.role && ['admin', 'user'].indexOf(req.body.role) > -1) {
      await Roles.updateOne(
        { userId: req.params.id },
        { role: req.body.role },
        { upsert: true }
      );
    }

    let data;
    if (req.body.isActive) {
      data = await Users.findByIdAndUpdate(req.params.id, {
        isActive: req.body.isActive,
      }).select('+email +isLogin +isActive');

      if (!data) return appError(401, '找不到該帳號', next);
    }

    res.status(201).send({
      status: true,
      message: '修改成功',
    });
  }),
  // Admin 取得使用者權限列表
  getUserRoles: handleErrorAsync(async (req, res, next) => {
    const role = await Roles.findOne({ userId: req.user._id });
    if (!role || role.role !== 'admin')
      return appError(403, '您無此權限', next);

    const data = await Roles.find().populate({
      path: 'userId',
      select: 'name email',
    });
    res.send({
      status: true,
      data,
    });
  }),
  // Admin 刪除全部使用者
  delAllUsers: handleErrorAsync(async (req, res, next) => {
    const role = await Roles.findOne({ userId: req.user._id });
    if (!role || role.role !== 'admin')
      return appError(403, '您無此權限', next);

    if (req.body.secret !== 'justDoIt!')
      return appError(401, '驗證未通過，無法刪除', next);
    const data = await Users.deleteMany({ email: { $ne: 'tester@ttt.ttt' } });
    await Roles.deleteMany({ userId: { $ne: req.user._id } });
    res.status(201).send({
      status: true,
      message: data,
    });
  }),
};

module.exports = users;
