const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const userValidator = require('../validators/users');
const upload = require('../validators/images');
const { isAuth } = require('../service/auth');
const cors = require('cors');

// 使用者註冊
router.post(
  '/sign-up',
  cors({ exposedHeaders: 'Authorization' }),
  userValidator.signUp,
  users.signUp
);

// 使用者登入
router.post(
  '/sign-in',
  cors({ exposedHeaders: 'Authorization' }),
  userValidator.signIn,
  users.signIn
);

// 登入權限檢查
router.get(
  '/check',
  cors({ exposedHeaders: 'Authorization' }),
  isAuth,
  users.check
);

// 使用者登出
router.delete('/sign-out', isAuth, users.signOut);

// 修改個人資訊
router.patch(
  '/profile',
  upload.avatar.single('avatar'),
  isAuth,
  userValidator.updateProfile,
  users.updateProfile
);

// 修改密碼
router.patch(
  '/profile/pwd',
  isAuth,
  userValidator.updatePassword,
  users.updatePassword
);

// 查詢指定使用者資訊
router.get('/profile/:id', isAuth, userValidator.getProfile, users.getProfile);

// 停用帳號
router.delete(
  '/deactivate',
  isAuth,
  userValidator.deactivateAccount,
  users.deactivateAccount
);

// Admin - 取得所有使用者資訊
router.get('/admin', isAuth, users.getAllUsers);

// Admin - 取得使用者權限列表
router.get('/admin/roles', isAuth, users.getUserRoles);

// Admin - 編輯使用者資訊
router.post(
  '/admin/:id',
  isAuth,
  userValidator.updateProfileAdmin,
  users.updateProfileAdmin
);

// Admin - 刪除全部使用者（會保留一個管理帳號）
router.delete('/admin/destroy', isAuth, users.delAllUsers);

module.exports = router;
