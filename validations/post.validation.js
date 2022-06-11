const Joi = require('joi');
const { objectId, postSortType } = require('./custom.validation');

const schema = {
  content: Joi.string().required().min(1).max(1000).messages({
    'string.base': `{#key} 需要填入字串格式`,
    'string.empty': `{#key} 不得空白`,
    'string.min': `{#key} 長度需要介於 1 ~ 1000 個字元`,
    'string.max': `{#key} 長度需要介於 1 ~ 1000 個字元`,
    'any.required': `{#key} 為必要欄位`,
  }),
  comment: Joi.string().required().min(1).max(500).messages({
    'string.base': `{#key} 需要填入字串格式`,
    'string.empty': `{#key} 不得空白`,
    'string.min': `{#key} 長度需要介於 1 ~ 500 個字元`,
    'string.max': `{#key} 長度需要介於 1 ~ 500 個字元`,
    'any.required': `{#key} 為必要欄位`,
  }),
  id: Joi.string().required().custom(objectId).messages({
    'string.base': `{#key} 需要填入字串格式`,
    'string.empty': `{#key} 不得空白`,
    'any.required': `{#key} 為必要欄位`,
  }),
  sort: Joi.custom(postSortType),
  skip: Joi.number().min(0).max(100).messages({
    'number.base': `{#key} 需要填入數字格式`,
    'number.min': `{#key} 需要介於 0 ~ 100 的數字`,
    'number.max': `{#key} 需要介於 0 ~ 100 的數字`,
  }),
  limit: Joi.number().min(0).max(100).messages({
    'number.base': `{#key} 需要填入數字格式`,
    'number.min': `{#key} 需要介於 0 ~ 100 的數字`,
    'number.max': `{#key} 需要介於 0 ~ 100 的數字`,
  }),
  images: Joi.allow(),
};

const postValidation = {
  getAll: {
    query: Joi.object().keys({
      limit: schema.limit,
      skip: schema.skip,
      sort: schema.sort,
    }),
  },
  createPost: {
    body: Joi.object().keys({
      content: schema.content,
      images: schema.images,
    }),
  },
  addComment: {
    params: Joi.object().keys({
      postId: schema.id,
    }),
    body: Joi.object().keys({
      comment: schema.comment,
    }),
  },
  postId: {
    params: Joi.object().keys({
      postId: schema.id,
    }),
  },
  userId: {
    params: Joi.object().keys({
      userId: schema.id,
    }),
  },
};

module.exports = postValidation;
