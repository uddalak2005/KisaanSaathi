const express = require('express');
const router = express.Router();
const yieldScoreController = require('../controllers/yieldScoreController');
const { protect } = require('../middleware/auth');

// Add protect middleware to all routes
router.use(protect);

// Routes
router.post('/predict', yieldScoreController.predictAndSaveScore);
router.get('/my-score', yieldScoreController.getUserYieldScore);

module.exports = router;