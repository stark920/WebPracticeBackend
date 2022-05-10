const { body } = require('express-validator');
const Users = require('../models/users');

const validations = {
  emailUsedCheck: body('email')
    .notEmpty()
    .withMessage('信箱 未填寫')
    .bail()
    .isString()
    .withMessage('信箱 格式異常')
    .bail()
    .isEmail()
    .withMessage('信箱 格式不正確')
    .bail()
    .toLowerCase()
    .custom((email) => {
      return Users.find({ email }).then((user) => {
        if (user.length > 0) {
          return Promise.reject('信箱 已經註冊過');
        }
      });
    })
    .bail()
    .normalizeEmail(),
  emailUnusedCheck: body('email')
    .notEmpty()
    .withMessage('信箱 未填寫')
    .bail()
    .isString()
    .withMessage('信箱 格式異常')
    .bail()
    .isEmail()
    .withMessage('信箱 格式不正確')
    .bail()
    .custom((email) => {
      return Users.find({ email }).then((user) => {
        if (user.length === 0) {
          return Promise.reject('帳號或密碼 錯誤');
        }
      });
    })
    .bail()
    .normalizeEmail(),
  password: body('password')
    .notEmpty()
    .withMessage('密碼 未填寫')
    .bail()
    .isString()
    .withMessage('密碼 格式異常')
    .bail()
    .custom((value) => value.indexOf(' ') === -1)
    .withMessage('密碼 不能包含空白')
    .bail()
    .isLength({ min: 8, max: 20 })
    .withMessage('密碼 長度限制為 8 ~ 20 個字元'),
  name: body('name')
    .notEmpty()
    .withMessage('暱稱 未填寫')
    .bail()
    .isString()
    .withMessage('暱稱 格式異常')
    .bail()
    .isLength({ min: 1, max: 10 })
    .withMessage('暱稱 長度限制為 1 ~ 10 個字元')
    .bail()
    .trim(),
  gender: body('gender')
    .not()
    .isEmpty()
    .withMessage('性別 未填寫')
    .bail()
    .isInt({ min: 0, max: 2 })
    .withMessage('性別 格式異常'),
  passwordConfirm: body('passwordConfirm')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('密碼 兩次輸入的內容不一致'),
};

const userValidator = {
  signUp: [validations.emailUsedCheck, validations.password, validations.name],
  signIn: [validations.emailUnusedCheck, validations.password],
  updateProfile: [validations.name, validations.gender],
  updatePassword: [validations.password, validations.passwordConfirm],
};

module.exports = userValidator;
