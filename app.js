const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// CORS !important !important !important
const cors = require('cors');

// env setting
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

// custom error handler
const { resErrorDev, resErrorProd } = require('./service');

// sync error
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:\n', err);
  process.exit(1);
});

// async error
process.on('unhandledRejection', (err, promise) => {
  console.error('Unhandled Rejection！');
  console.error(err);
  console.error(promise);
  process.exit(1);
});

// database
const mongoose = require('mongoose');
const DB = process.env.DB.replace('<pwd>', process.env.DB_PWD);

mongoose.connect(DB).then(() => console.log('DB connect success'));

// routers
const userRouter = require('./routes/user');
const usersRouter = require('./routes/users');
const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');


// app
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/user', userRouter);
app.use('/users', usersRouter);
app.use('/post', postRouter);
app.use('/posts', postsRouter);


// 404 error
app.use((req, res, next) => {
  res.status(404).send({
    status: false,
    message: '無此路由',
  });
});

// 500 error
app.use((err, req, res, next) => {
  // modify err
  err.statusCode = err.statusCode || 500;

  // development
  if (process.env.NODE_ENV === 'dev') {
    return resErrorDev(err, res);
  }

  // production: predictable event
  if (err.name === 'xxxx') {
    err.message = 'xxxx';
    err.isOperational = true;
    return resErrorProd(err, res);
  }

  // production: default
  resErrorProd(err, res);
});

module.exports = app;
