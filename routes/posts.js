const express = require('express');
const router = express.Router();
const posts = require('../controllers/posts');
const postValidator = require('../validators/posts');
const upload = require('../validators/images');
const { isAuth } = require('../service/auth');

// 新增貼文
router.post(
  '',
  isAuth,
  upload.photo.array('images', 10),
  postValidator.createPost,
  posts.createPost
);

// 取得貼文列表
router.get('', isAuth, posts.getAllPost);

// 取得單一貼文
router.get('/:id', isAuth, posts.getAllPost);

// 新增留言
router.post('/:id', isAuth, postValidator.addComment, posts.addMessage);

// 按讚取消讚
router.get('/like/:id', isAuth, postValidator.addLike, posts.addLike);

// 更新貼文
router.patch('/:id', posts.updatePost);

// 刪除貼文
router.delete('/:id', posts.deletePost);

// Admin - 刪除全部貼文
router.delete('/admin/destroy', isAuth, posts.delAllPost);

module.exports = router;
