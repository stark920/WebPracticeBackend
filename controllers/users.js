const Users = require('../models/users');
const { handleErrorAsync, appError } = require('../service');

const users = {
  getAllUsers: handleErrorAsync(async (req, res, next) => {
    // 權限控制
    const data = await Users.find().select('+email');
    res.send({
      status: true,
      data,
    });
  }),
  delAllUsers: handleErrorAsync(async (req, res, next) => {
    // 權限控制
    // const data = await Users.deleteMany({});
    res.send({
      status: true,
      message: '刪除成功(假的)',
    });
  }),
};

module.exports = users;
