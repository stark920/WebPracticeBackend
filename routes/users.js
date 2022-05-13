const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const { isAuth } = require('../service/auth');

router.get('/', isAuth, users.getAllUsers);

router.delete('/', isAuth, users.delAllUsers);

module.exports = router;
