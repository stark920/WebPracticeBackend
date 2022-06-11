const express = require('express');

const router = express.Router();
const handleAsyncError = require('../../service/handleAsyncError');
const { isAuth, validate, upload } = require('../../middlewares');
const postValidator = require('../../validations/post.validation');
const postController = require('../../controllers/post.controller');

// 取得所有貼文
router.get(
  '',
  handleAsyncError(isAuth),
  validate(postValidator.getAll),
  handleAsyncError(postController.getAll)
);

// 取得單一貼文
router.get(
  '/:postId',
  handleAsyncError(isAuth),
  validate(postValidator.postId),
  handleAsyncError(postController.getOne)
);

// 新增貼文
router.post(
  '',
  handleAsyncError(isAuth),
  upload.photo.array('images', 10),
  validate(postValidator.createPost),
  handleAsyncError(postController.createPost)
);

// 新增一則貼文的讚
router.post(
  '/:postId/like',
  handleAsyncError(isAuth),
  validate(postValidator.postId),
  handleAsyncError(postController.like)
);

// 取消一則貼文的讚
router.delete(
  '/:postId/unlike',
  handleAsyncError(isAuth),
  validate(postValidator.postId),
  handleAsyncError(postController.unlike)
);

// 新增一則貼文的留言
router.post(
  '/:postId/comment',
  handleAsyncError(isAuth),
  validate(postValidator.addComment),
  handleAsyncError(postController.addComment)
);

// 取得個人所有貼文列表
router.get(
  '/user/:userId',
  handleAsyncError(isAuth),
  validate(postValidator.userId),
  handleAsyncError(postController.getUserAll)
);

module.exports = router;
