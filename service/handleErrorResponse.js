// production
const resErrorProd = (err, res) => {
  // predictable error
  if (err.isOperational) {
    res.status(err.statusCode).send({
      status: false,
      message: err.message,
    });
  } else {
    // server side
    console.error('Unpredictable Error: ', err);
    // client side
    res.status(500).send({
      status: false,
      message: '系統錯誤，請洽系統管理員',
    });
  }
};

// development
const resErrorDev = (err, res) => {
  res.status(err.statusCode).send({
    status: false,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

module.exports = { resErrorProd, resErrorDev };
