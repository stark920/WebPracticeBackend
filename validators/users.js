const { body, param } = require('express-validator');

const v = {
  email: body('email')
    .notEmpty()
    .bail()
    .isString()
    .bail()
    .isEmail()
    .bail()
    .toLowerCase(),
  password: body('password')
    .notEmpty()
    .bail()
    .isString()
    .bail()
    .custom((value) => value.indexOf(' ') === -1)
    .bail()
    .isLength({ min: 8, max: 20 }),
  passwordConfirm: body('passwordConfirm').custom(
    (value, { req }) => value === req.body.password
  ),
  name: body('name')
    .notEmpty()
    .bail()
    .isString()
    .bail()
    .isLength({ min: 2, max: 10 })
    .bail()
    .trim(),
  gender: body('gender')
    .notEmpty()
    .bail()
    .custom((value) => ['male', 'female', 'others'].indexOf(value) > -1),
  userId: param('id').isMongoId(),
};

const userValidator = {
  signUp: [v.email, v.password, v.name],
  signIn: [v.email, v.password],
  updateProfile: [v.name, v.gender],
  updatePassword: [v.password, v.passwordConfirm],
  getProfile: [v.userId],
  updateProfileAdmin: [v.userId],
  deactivateAccount: [v.email, v.password]
};

module.exports = userValidator;
