const Posts = require('../models/posts');
const { validationResult } = require('express-validator');
const { handleErrorAsync, appError } = require('../service');
const MyImgur = require('../utils/imgur');

const posts = {
  findPost: handleErrorAsync(async (req, res, next) => {
    if (!req.user) {
      return appError(400, '帳號不存在', next)
    }

    const data = await Posts.find().select({'images': {'deleteHash': 0}}).sort({'createdAt': -1}).limit(20);
    res.send({status: true, data})
  }),
  createPost: handleErrorAsync(async (req, res, next) => {
    const { errors } = validationResult(req);
    if (errors.length > 0) {
      return res.status(400).send({
        status: false,
        message: errors.map((el) => el.msg),
      });
    } 

    const images = await MyImgur.uploadImage(req.files);
    const data = await Posts.create({
      userID: req.user._id,
      content: req.body.content,
      images: images,
    });
    res.send({status: true, data})
  }),
  async deletePost(req, res) {
    res.send({status: true, data: req.params.id})
  },
  async deleteAllPost(req, res) {
    const data = await Posts.deleteMany({});
    res.send({status: true, data: []})
  },
  async updatePost(req, res) {},
};

module.exports = posts;



