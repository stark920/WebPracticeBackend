const Console = require('../utils/Console');

const errorResponse = (err, res) => {
  const { statusCode, message, isOperational, stack } = err;

  if (process.env.NODE_ENV === 'dev') {
    Console.error(err);
    res.status(statusCode).send({
      status: false,
      message,
      stack,
    });
    return;
  }

  if (isOperational) {
    res.status(statusCode).send({
      status: false,
      message,
    });
  } else {
    Console.error('Unpredictable Error: ', err);
    res.status(500).send({
      status: false,
      message: '系統錯誤，請洽系統管理員',
    });
  }
};

module.exports = errorResponse;
