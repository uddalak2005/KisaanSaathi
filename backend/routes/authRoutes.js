const express = require('express');
const router = express.Router();
const { registerInitial, completeProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerInitial);
router.post('/complete-profile', protect, completeProfile);

module.exports = router;