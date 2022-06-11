const express = require('express');

const router = express.Router();
const cors = require('cors');
const handleAsyncError = require('../../service/handleAsyncError');
const { isAuth, validate, upload } = require('../../middlewares');
const userValidator = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

const exposedHeaders = {
  exposedHeaders: 'Authorization',
};

// 註冊會員
router.post(
  '/sign_up',
  validate(userValidator.signUp),
  handleAsyncError(userController.signUp)
);

// 登入會員
router.post(
  '/sign_in',
  cors(exposedHeaders),
  validate(userValidator.signIn),
  handleAsyncError(userController.signIn)
);

// 重設密碼
router.patch(
  '/updatePassword',
  handleAsyncError(isAuth),
  validate(userValidator.updatePassword),
  handleAsyncError(userController.updatePassword)
);

// 取得個人資料
router.get(
  '/profile',
  handleAsyncError(isAuth),
  handleAsyncError(userController.getOwnProfile)
);

// 更新個人資料
router.patch(
  '/profile',
  handleAsyncError(isAuth),
  upload.avatar.single('avatar'),
  validate(userValidator.updateProfile),
  handleAsyncError(userController.updateProfile)
);

// 取得指定用戶資料
router.get(
  '/profile/:userId',
  handleAsyncError(isAuth),
  validate(userValidator.userId),
  handleAsyncError(userController.getProfile)
);

// 追蹤朋友
router.post(
  '/:userId/follow',
  handleAsyncError(isAuth),
  validate(userValidator.userId),
  handleAsyncError(userController.follow)
);

// 取消追蹤朋友
router.delete(
  '/:userId/unfollow',
  handleAsyncError(isAuth),
  validate(userValidator.userId),
  handleAsyncError(userController.unfollow)
);

// 取得個人追蹤名單
router.get(
  '/following',
  handleAsyncError(isAuth),
  handleAsyncError(userController.following)
);

// 取得個人按讚列表
router.get(
  '/getLikeList',
  handleAsyncError(isAuth),
  handleAsyncError(userController.getLikeList)
);

module.exports = router;
