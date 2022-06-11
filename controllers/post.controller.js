const Post = require('../models/post.model');
const Comment = require('../models/comment.model');
const { ApiError, imgur } = require('../utils');

const postController = {
  async getAll(req, res) {
    const skip = req.query.skip ?? 0;
    const limit = req.query.limit ?? 0;
    let sort = '-createdAt';
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'hot':
          sort = '-likesNum -createdAt';
          break;
        case 'new':
          sort = '-createdAt';
          break;
        case 'old':
          sort = '+createdAt';
          break;
        default:
          break;
      }
    }

    const data = await Post.find()
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate({ path: 'author', select: 'name avatar' })
      .populate({ path: 'likes', select: 'name avatar' })
      .populate({
        path: 'comments',
        select: 'user comment -_id -post',
        populate: {
          path: 'user',
          select: 'name avatar',
        },
      });

    res.send({ status: true, data });
  },
  async getOne(req, res, next) {
    const data = await Post.findById(req.params.postId)
      .populate({ path: 'author', select: 'name avatar' })
      .populate({ path: 'likes', select: 'name avatar' })
      .populate({
        path: 'comments',
        select: 'user comment -_id -post',
        populate: {
          path: 'user',
          select: 'name avatar',
        },
      });
    if (!data) return next(new ApiError(401, '查無此文章 ID'));

    res.send({ status: true, data });
  },
  async createPost(req, res, next) {
    if (req.body.images) return next(new ApiError(400, 'images 請傳入圖片'));

    let images;
    if (req.files) {
      images = await imgur.upload.array(req.files);
    }

    const data = await Post.create({
      author: req.user._id,
      content: req.body.content,
      images: images || [],
    });

    res.status(201).send({ status: true, postId: data._id });
  },
  async like(req, res, next) {
    const { postId } = req.params;
    const userId = req.user._id;

    const checkPost = await Post.findById(postId).select('likes');
    if (!checkPost) return next(new ApiError(400, '無此貼文'));
    if (checkPost.likes.includes(userId))
      return next(new ApiError(400, '已經按過讚了'));

    await Post.findByIdAndUpdate(postId, {
      $push: {
        likes: userId,
      },
      $inc: {
        likesNum: 1,
      },
    });

    res.status(201).send({ status: true, message: '已按讚' });
  },
  async unlike(req, res, next) {
    const { postId } = req.params;
    const userId = req.user._id;

    const checkPost = await Post.findById(postId).select('likes');
    if (!checkPost) return next(new ApiError(400, '無此貼文'));
    if (!checkPost.likes.includes(userId))
      return next(new ApiError(400, '您並未按此貼文讚'));

    await Post.findByIdAndUpdate(postId, {
      $pull: {
        likes: userId,
      },
      $inc: {
        likesNum: -1,
      },
    });

    res.status(201).send({ status: true, message: '已取消按讚' });
  },
  async addComment(req, res, next) {
    const isExistPostId = await Post.findById(req.params.postId);
    if (!isExistPostId) return next(new ApiError(400, '無此文章 ID'));

    const commentData = {
      post: req.params.postId,
      user: req.user._id,
      comment: req.body.comment,
    };
    const data = await Comment.create(commentData);
    res.send({ status: true, data });
  },
  async getUserAll(req, res) {
    const data = await Post.find({ author: req.params.userId })
      .populate({ path: 'author', select: 'name avatar' })
      .populate({ path: 'likes', select: 'name avatar' })
      .populate({
        path: 'comments',
        select: 'user comment -_id -post',
        populate: {
          path: 'user',
          select: 'name avatar',
        },
      });
    res.send({ status: true, data });
  },
};

module.exports = postController;
