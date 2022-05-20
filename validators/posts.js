const { body, param } = require('express-validator');

const validations = {
  content: [
    body('content')
      .isString()
      .bail()
      .isLength({ min: 1, max: 1000 })
      .bail()
      .trim(),
  ],
  comment: [
    body('content')
      .isString()
      .bail()
      .isLength({ min: 1, max: 500 })
      .bail()
      .trim(),
  ],
  postID: [
    param('id')
      .isMongoId()
      .withMessage('文章 ID 異常')
  ],
};

const postValidator = {
  createPost: [validations.content],
  addComment: [validations.comment, validations.postID],
  addLike: [validations.postID]
};

module.exports = postValidator;
