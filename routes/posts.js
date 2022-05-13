const express = require('express');
const router = express.Router();
const posts = require('../controllers/posts');
const postValidator = require('../validators/posts');
const { isAuth } = require('../service');
const multer = require('multer');
const upload = multer();

router.get('/', isAuth, posts.getAllPost);
router.delete('/', posts.delAllPost);

module.exports = router;
