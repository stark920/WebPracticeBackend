const express = require('express');
const router = express.Router();
const user = require('../controllers/user');
const userValidator = require('../validators/users');
const { isAuth } = require('../service/auth');

router.post('/sign_up', userValidator.signUp, user.signUp);

router.post('/sign_in', userValidator.signIn, user.signIn);

router.get('/', isAuth, user.checkToken);

router.get('/follow/:id', isAuth, user.addFollow);

router.patch('/profile', isAuth, userValidator.updateProfile, user.updateProfile);

router.patch('/profile/pwd', isAuth, userValidator.updatePassword, user.updatePassword);

router.get('/profile/:id', isAuth, user.getProfile);

router.delete('/', isAuth, user.deleteAccount);

module.exports = router;
