const express = require('express');
const router = express.Router();
const { register, login, verifyToken } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);  // This should match your API endpoint
router.post('/login', login);
router.get('/verify-token', protect, verifyToken);

module.exports = router;