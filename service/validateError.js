const { validationResult } = require('express-validator');

const validateError = (req, res, next) => {
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    res.status(400).send({
      status: false,
      message: errors.map((el) => el.msg),
    });
    return true;
  } else {
    return false;
  }
};

module.exports = validateError;
