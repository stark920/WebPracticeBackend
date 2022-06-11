const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const Post = require('../models/post.model');
const { pick, ApiError, imgur } = require('../utils');
const { sendJWT } = require('../middlewares/auth');

const userController = {
  async signUp(req, res, next) {
    const { email, password, name } = req.body;

    const emailUsed = await User.findOne({ email });
    if (emailUsed) return next(new ApiError(401, '信箱已被使用'));

    const existMembers = await User.count();
    if (existMembers >= 500) {
      return next(new ApiError(401, '很抱歉，會員數量已達上限'));
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({ email, password: hashedPassword, name });

    res.send({
      status: true,
      message: '註冊成功',
    });
  },
  async signIn(req, res, next) {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) return next(new ApiError(401, '信箱或密碼錯誤'));

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) return next(new ApiError(401, '信箱或密碼錯誤'));

    const data = pick(JSON.parse(JSON.stringify(user)), [
      '_id',
      'name',
      'avatar',
      'gender',
    ]);
    sendJWT(data, 200, res);
  },
  async updatePassword(req, res) {
    const password = await bcrypt.hash(req.body.password, 12);
    await User.findByIdAndUpdate(req.user._id, { password });

    res.status(201).send({ status: true, message: '密碼更新成功' });
  },
  async getOwnProfile(req, res, next) {
    const data = await User.findById(req.user._id);
    if (!data) return next(new ApiError(403, '授權異常，無法取得您的資訊'));

    res.send({ status: true, data });
  },
  async updateProfile(req, res) {
    const { name, gender } = req.body;

    const updateData = { name, gender };
    if (req.file) {
      await imgur.delete(req.user.avatar);
      updateData.avatar = await imgur.upload.single(req.file);
    }

    const data = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
    });

    res.status(201).send({ status: true, data });
  },
  async getProfile(req, res, next) {
    const data = await User.findById(req.params.userId);
    if (!data) return next(new ApiError(400, '查無此使用者 ID'));

    res.send({ status: true, data });
  },
  async follow(req, res, next) {
    const userId = req.user._id.toString();
    const targetId = req.params.userId;
    if (userId === targetId) return next(new ApiError(400, '不能追蹤自己'));

    const targetUser = await User.updateOne(
      { _id: targetId, 'followers.user': { $ne: userId } },
      { $push: { followers: { user: userId } } }
    );
    if (targetUser.modifiedCount === 0) {
      return next(new ApiError(400, '無此使用者或對象已追蹤過'));
    }

    await User.updateOne(
      { _id: userId, 'following.user': { $ne: targetId } },
      { $push: { following: { user: targetId } } }
    );

    res.status(201).send({ status: true, message: '追蹤成功' });
  },
  async unfollow(req, res, next) {
    const userId = req.user._id.toString();
    const targetId = req.params.userId;
    if (userId === targetId) return next(new ApiError(400, '不能退追自己'));

    const targetUser = await User.updateOne(
      { _id: targetId },
      { $pull: { followers: { user: userId } } }
    );
    if (targetUser.matchedCount === 0) {
      return next(new ApiError(400, '無此使用者'));
    }
    if (targetUser.modifiedCount === 0) {
      return next(new ApiError(400, '您未追蹤該用戶'));
    }

    await User.updateOne(
      { _id: userId, 'following.user': targetId },
      { $pull: { following: { user: targetId } } }
    );

    res.status(201).send({ status: true, message: '退追成功' });
  },
  async following(req, res) {
    const data = await User.findById(req.user._id)
      .select('following')
      .populate({
        path: 'following.user',
        select: 'name avatar',
      });
    res.send({ status: true, data: data.following });
  },
  async getLikeList(req, res) {
    const data = await Post.find({ likes: { $in: req.user._id } }).populate({
      path: 'author',
      select: 'name avatar',
    });
    res.send({ status: true, data });
  },
};

module.exports = userController;
