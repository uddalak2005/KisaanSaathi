const express = require('express');
const router = express.Router();
const { register, login, completeProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/complete-profile', protect, completeProfile);

module.exports = router;