const express = require('express');
const logger = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes/v1');
const ApiError = require('./utils/ApiError');
const errorResponse = require('./service/errorResponse');

dotenv.config({ path: './config.env' });

require('./service/handleProcessError');
require('./connections/mongodb');

const app = express();

app.use(logger('dev'));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.options('*', cors());

app.use('/v1', routes);

app.use((req, res, next) => {
  next(new ApiError(404, '無此路由'));
});

app.use((err, req, res, next) => {
  const customError = err;
  customError.statusCode = err.statusCode || 500;
  // mongoose or multer
  if (err.name === 'ValidationError' || err.name === 'MulterError') {
    customError.statusCode = 400;
    customError.message = '傳入資料格式有誤';
    customError.isOperational = true;
  }
  // imgur
  if (err.name === 'AxiosError') {
    customError.statusCode = 400;
    customError.message = '檔案上傳失敗，請聯繫管理員';
    customError.isOperational = true;
  }
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    customError.statusCode = 400;
    customError.message = '傳入資料非正常 JSON 格式';
    customError.isOperational = true;
  }
  next(errorResponse(customError, res));
});

module.exports = app;
