const { body } = require('express-validator');

const validations = {
  content: [body('content').isString().withMessage('內容 格式異常').trim()],
};

const postValidator = {
  createPost: [validations.content],
};

module.exports = postValidator;
