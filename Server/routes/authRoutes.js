const express = require('express');
const {userRegistration, userLogin, userPasswordForget} =require('../controllers/userController');
const { userPasswordReset } = require('../controllers/userController');
const { userVerifyEmail } = require('../controllers/userController');
const { userLogout } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const { getUserDetails } = require('../controllers/userController');

const authRouter = express.Router();


authRouter.post('/login', userLogin);
authRouter.post('/register', userRegistration);
authRouter.post('/forget-password', userPasswordForget);
authRouter.post('/reset-password/:token', userPasswordReset);
authRouter.post('/verify-email/:token', userVerifyEmail);
authRouter.post('/logout',authMiddleware, userLogout);
authRouter.get('/user', authMiddleware, getUserDetails); //added

module.exports =authRouter  