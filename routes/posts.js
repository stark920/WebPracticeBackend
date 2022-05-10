const express = require("express");
const router = express.Router();
const posts = require("../controllers/posts");
const postValidator = require("../validators/posts");
const {isAuth} = require("../service")
const multer = require('multer');
const upload = multer();

router.get("/", isAuth, posts.findPost);
router.post("/", isAuth, upload.array('image', 10), postValidator.createPost, posts.createPost);
router.delete("/", posts.deleteAllPost);
router.delete("/:id", posts.deletePost);
router.patch("/:id", posts.updatePost);

module.exports = router;