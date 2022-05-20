const Posts = require('../models/posts');
const Likes = require('../models/likes');
const Roles = require('../models/roles');
const { handleErrorAsync, appError } = require('../service');
const { validationResult } = require('express-validator');
const imgur = require('../service/imgur');

const posts = {
  // 上傳貼文
  createPost: handleErrorAsync(async (req, res, next) => {
    const { errors } = validationResult(req);
    if (errors.length > 0) return appError(401, '輸入資料格式錯誤', next);

    const images = await imgur.upload.array(req.files);
    await Posts.create({
      user: req.user._id,
      content: req.body.content,
      images: images,
    });

    res.status(201).send({ status: true, message: '上傳成功' });
  }),
  // 取得貼文列表
  getAllPost: handleErrorAsync(async (req, res, next) => {
    const skip = req.query.skip ?? 0;
    const limit = req.query.limit ?? 0;
    let sort = '-createdAt';
    if (req.query.sort) {
      sort = req.query.sort === 'hot' ? '-likesNum -createdAt' : '-createdAt';
    }

    const data = await Posts.find()
      .select({ images: { deleteHash: 0 } })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate({ path: 'user', select: 'name avatar' })
      .populate({ path: 'comments.user', select: 'name avatar' });

    res.send({ status: true, data });
  }),
  // 新增留言
  addMessage: handleErrorAsync(async (req, res, next) => {
    const { errors } = validationResult(req);
    if (errors.length > 0) return appError(401, '輸入資料格式錯誤', next);

    const postID = req.params.id;
    const message = {
      user: req.user._id,
      content: req.body.content,
    };

    const data = await Posts.findByIdAndUpdate(
      postID,
      {
        $push: { comments: message },
      },
      { new: true }
    )
      .select('comments')
      .populate({ path: 'comments.user', select: 'name avatar' });

    if (!data) appError(401, '無此文章 ID', next);

    res.status(201).send({
      status: true,
      data,
    });
  }),
  // 按讚＆取消讚
  addLike: handleErrorAsync(async (req, res, next) => {
    const { errors } = validationResult(req);
    if (errors.length > 0) return appError(401, '輸入資料格式錯誤', next);

    const postId = req.params.id;
    const userId = req.user._id;
    const isLike = await Posts.find({ _id: postId, likes: [userId] });

    let data, message;
    if (isLike.length === 0) {
      data = await Posts.findByIdAndUpdate(postId, {
        $push: {
          likes: userId,
        },
        $inc: {
          likesNum: 1,
        },
      });

      await Likes.updateOne(
        { userId },
        {
          $push: {
            likes: postId,
          },
        },
        { upsert: true }
      );
      message = '已按讚';
    } else {
      data = await Posts.findByIdAndUpdate(postId, {
        $pull: {
          likes: userId,
        },
        $inc: {
          likesNum: -1,
        },
      });

      await Likes.updateOne(
        { userId },
        {
          $pull: {
            likes: postId,
          },
        }
      );
      message = '已取消按讚';
    }

    if (!data) return appError(401, '無此貼文', next);
    res.status(201).send({ status: true, message });
  }),
  // 刪除貼文
  deletePost: handleErrorAsync(async (req, res, next) => {
    res.send({ status: true, data: req.params.id });
  }),
  // 修改貼文
  updatePost: handleErrorAsync(async (req, res, next) => {
    res.send({ status: true, data: req.params.id });
  }),
  // 刪除全部貼文
  delAllPost: handleErrorAsync(async (req, res, next) => {
    const role = await Roles.findOne({ userId: req.user._id });
    if (!role || role.role !== 'admin')
      return appError(403, '您無此權限', next);

    if (req.body.secret !== 'justDoIt!')
      return appError(401, '驗證未通過，無法刪除', next);

    const data = await Posts.deleteMany({});
    res.status(201).send({ status: true, data });
  }),
};

module.exports = posts;
