const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

// swaggerJsDoc
const specs = swaggerJsdoc({
  swaggerDefinition: {
    info: {
      title: 'MetaWall API',
      version: '1.0.0',
      description: 'This is api document'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'apiKey',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          in: 'headers',
          name: 'authorization',
          description: '請加上 API Token'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./docs/*.js']
});

// process error handle
const { resErrorDev, resErrorProd } = require('./service');
// sync
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:\n', err);
  process.exit(1);
});
// async
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection！');
  console.error(reason);
  console.error(promise);
  process.exit(1);
});

// DB connection
const mongoose = require('mongoose');
const DB = process.env.DB.replace('<pwd>', process.env.DB_PWD);
mongoose.connect(DB).then(() => console.log('DB connect success'));

// routes
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(specs));

app.use((req, res, next) => {
  res.status(404).send({
    status: false,
    message: '無此路由',
  });
});

app.use((err, req, res, next) => {
  // dev
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === 'dev') {
    return resErrorDev(err, res);
  }
  // mongoose and multer error
  if ((err.name === 'ValidationError' || err.name === 'MulterError')) {
    err.message = '資料錯誤';
    err.isOperational = true;
    return resErrorProd(err, res);
  }

  resErrorProd(err, res);
});

module.exports = app;
