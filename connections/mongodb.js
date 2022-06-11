const mongoose = require('mongoose');
const Console = require('../utils/Console');

const DB = process.env.DATABASE_URL.replace(
  '<password>',
  process.env.DATABASE_PWD
);
mongoose.connect(DB).then(() => {
  Console.log('DB connect success');
});
