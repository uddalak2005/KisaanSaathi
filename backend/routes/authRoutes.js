const express = require('express');
const router = express.Router();
const { register, login, verifyToken } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/verify-token', protect, verifyToken);

module.exports = router;