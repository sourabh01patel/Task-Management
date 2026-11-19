const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  logoutUser,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

// Public routes with rate limiting
router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.post('/logout', logoutUser);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;

