const express = require('express');
const {userRegistration, userLogin, userPasswordForget} =require('../controllers/userController');
const { userPasswordReset } = require('../controllers/userController');
const { userVerifyEmail } = require('../controllers/userController');
const { userLogout } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const { getUserDetails } = require('../controllers/userController');
const upload = require('../config/storage');
const User = require('../models/User'); // Your Mongoose user model

const authRouter = express.Router();


authRouter.post('/login', userLogin);
authRouter.post('/register', userRegistration);
authRouter.post('/forget-password', userPasswordForget);
authRouter.post('/reset-password/:token', userPasswordReset);
authRouter.post('/verify-email/:token', userVerifyEmail);
authRouter.post('/logout',authMiddleware, userLogout);
authRouter.get('/user', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      photo: user.photo, 
      
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}); 

// Upload user photo
authRouter.post('/upload-photo', authMiddleware, upload.single('photo'), async (req, res) => {
  try {
    const userId = req.user.id;
    const photoUrl = req.file.path; 
    await User.findByIdAndUpdate(userId, { photo: photoUrl });
    res.json({ success: true, photo: photoUrl });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


authRouter.get('/favorites', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ favorites: user.favorites || [] });
});

authRouter.post('/favorites', authMiddleware, async (req, res) => {
  const { amenity } = req.body;
  const user = await User.findById(req.user.id);
  if (!user.favorites.includes(amenity)) user.favorites.push(amenity);
  await user.save();
  res.json({ favorites: user.favorites });
});

authRouter.delete('/favorites', authMiddleware, async (req, res) => {
  const { amenity } = req.body;
  const user = await User.findById(req.user.id);
  user.favorites = user.favorites.filter(fav => fav !== amenity);
  await user.save();
  res.json({ favorites: user.favorites });
});


module.exports =authRouter