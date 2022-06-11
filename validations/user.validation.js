const Joi = require('joi');
const { password, gender, objectId } = require('./custom.validation');

const schema = {
  email: Joi.string().required().email().messages({
    'string.base': `{#key} 需要填入字串格式`,
    'string.empty': `{#key} 不得空白`,
    'string.email': `{#key} 格式不正確`,
    'any.required': `{#key} 為必要欄位`,
  }),
  password: Joi.string().required().custom(password).messages({
    'string.base': `{#key} 需要填入字串格式`,
    'string.empty': `{#key} 不得空白`,
    'any.required': `{#key} 為必要欄位`,
  }),
  passwordConfirm: Joi.string().required().valid(Joi.ref('password')).messages({
    'string.base': `{#key} 需要填入字串格式`,
    'string.empty': `{#key} 不得空白`,
    'any.only': '{#key} 內容與 password 不一致',
    'any.required': `{#key} 為必要欄位`,
  }),
  name: Joi.string().required().min(2).max(10).messages({
    'string.base': `{#key} 需要填入字串格式`,
    'string.empty': `{#key} 不得空白`,
    'string.min': `{#key} 長度需要介於 2 ~ 10 個字元`,
    'string.max': `{#key} 長度需要介於 2 ~ 10 個字元`,
    'any.required': `{#key} 為必要欄位`,
  }),
  gender: Joi.string().required().custom(gender).messages({
    'string.base': `{#key} 需要填入字串格式`,
    'string.empty': `{#key} 不得空白`,
    'any.required': `{#key} 為必要欄位`,
  }),
  id: Joi.string().required().custom(objectId).messages({
    'string.base': `{#key} 需要填入字串格式`,
    'string.empty': `{#key} 不得空白`,
    'any.required': `{#key} 為必要欄位`,
  }),
};

const userValidation = {
  signUp: {
    body: Joi.object().keys({
      email: schema.email,
      password: schema.password,
      name: schema.name,
    }),
  },
  signIn: {
    body: Joi.object().keys({
      email: schema.email,
      password: schema.password,
    }),
  },
  userId: {
    params: Joi.object().keys({
      userId: schema.id,
    }),
  },
  updateProfile: {
    body: Joi.object().keys({
      name: schema.name,
      gender: schema.gender,
    }),
  },
  updatePassword: {
    body: Joi.object().keys({
      password: schema.password,
      passwordConfirm: schema.passwordConfirm,
    }),
  },
};

module.exports = userValidation;
