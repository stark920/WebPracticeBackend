const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const userValidator = require('../validators/users');
const { isAuth } = require('../service/auth');


router.post('/', isAuth, users.checkToken);

router.post('/sign_up', userValidator.signUp, users.signUp);

router.post('/sign_in', userValidator.signIn, users.signIn);

router.get('/profile/:id', isAuth, users.getProfile);

router.post('/profile/update', isAuth, userValidator.updateProfile, users.updateProfile);

router.post('/profile/update_pwd', isAuth, userValidator.updatePassword, users.updatePassword);

module.exports = router;
