const express = require('express');
const router = express.Router();
const post = require('../controllers/post');
const postValidator = require('../validators/posts');
const { isAuth } = require('../service');
const multer = require('multer');
const upload = multer();


router.post('/', isAuth, upload.array('image', 10), postValidator.createPost, post.createPost);

router.post('/:id', isAuth, postValidator.addMessage, post.addMessage);

router.get('/like/:id', isAuth, postValidator.addLike, post.addLike);

router.delete('/:id', post.deletePost);

router.patch('/:id', post.updatePost);

module.exports = router;
