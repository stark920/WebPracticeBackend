const Posts = require('../models/posts');
const { validationResult } = require('express-validator');
const { handleErrorAsync, appError, validateError } = require('../service');
const MyImgur = require('../utils/imgur');

const posts = {
  findPost: handleErrorAsync(async (req, res, next) => {
    if (!req.user) {
      return appError(400, '帳號不存在', next);
    }

    const data = await Posts.find()
      .select({ images: { deleteHash: 0 } })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate({ path: 'user', select: 'name avatar' })
      .populate({ path: 'messages.user', select: 'name avatar' });

    res.send({ status: true, data });
  }),
  createPost: handleErrorAsync(async (req, res, next) => {
    const isError = await validateError(req, res);

    if (isError) return;

    const images = await MyImgur.uploadImage(req.files);
    const data = await Posts.create({
      user: req.user._id,
      content: req.body.content,
      images: images,
    });
    res.send({ status: true, data });
  }),
  addMessage: handleErrorAsync(async (req, res, next) => {
    const isError = await validateError(req, res);

    if (isError) return;

    const postID = req.params.postID;
    const message = {
      user: req.user._id,
      content: req.body.content,
    };

    const result = await Posts.findByIdAndUpdate(
      postID,
      {
        $push: { messages: message },
      },
      { new: true }
    );

    if (!result) appError(400, '無此文章 ID', next);

    const data = await Posts.findById(postID)
    .select('messages')
    .populate({ path: 'messages.user', select: 'name avatar' });

    res.send({
      status: true,
      data,
    });
  }),
  deletePost: handleErrorAsync(async (req, res, next) => {
    res.send({ status: true, data: req.params.id });
  }),
  deleteAllPost: handleErrorAsync(async (req, res, next) => {
    const data = await Posts.deleteMany({});
    res.send({ status: true, data: [] });
  }),
  updatePost: handleErrorAsync(async (req, res, next) => {}),
};

module.exports = posts;
