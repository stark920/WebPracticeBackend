const Posts = require('../models/posts');
const { handleErrorAsync, appError, validateError } = require('../service');
const MyImgur = require('../utils/imgur');

const post = {
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

    const postID = req.params.id;
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
  addLike: handleErrorAsync(async (req, res, next) => {
    const postID = req.params.id;
    const userID = req.user._id;

    res.send({ status: true, data: [postID, userID] });
  }),
  // no UI
  deletePost: handleErrorAsync(async (req, res, next) => {
    res.send({ status: true, data: req.params.id });
  }),
  updatePost: handleErrorAsync(async (req, res, next) => {
    res.send({ status: true, data: req.params.id });
  }),
};

module.exports = post;
