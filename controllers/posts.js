const Posts = require('../models/posts');
const { handleErrorAsync, appError } = require('../service');

const posts = {
  /**
   * sort: new(default) | hot
   * start: number
   * limit: number
   */
  getAllPost: handleErrorAsync(async (req, res, next) => {
    if (!req.user) {
      return appError(400, '帳號不存在', next);
    }
    // req.query.start
    // req.query.limit
    // req.query.sort
    const data = await Posts.find()
      .select({ images: { deleteHash: 0 } })
      .sort({ createdAt: -1 })
      .populate({ path: 'user', select: 'name avatar' })
      .populate({ path: 'messages.user', select: 'name avatar' });

    res.send({ status: true, data });
  }),

  delAllPost: handleErrorAsync(async (req, res, next) => {
    // 權限
    // await Posts.deleteMany({});
    res.send({ status: true, data: [] });
  }),
};

module.exports = posts;
