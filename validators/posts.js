const { body, param } = require('express-validator');

const validations = {
  content: [
    body('content')
      .isString()
      .withMessage('內容 格式異常')
      .bail()
      .isLength({ min: 1 })
      .withMessage('內容 至少需要 1 個字元')
      .bail()
      .trim(),
  ],
  postID: [param('postID').isMongoId().withMessage('文章 ID 異常')],
};

const postValidator = {
  createPost: [validations.content],
  addMessage: [validations.content, validations.postID],
};

module.exports = postValidator;
