const express = require('express');
const router = express.Router();
const yieldScoreController = require('../controllers/yieldScoreController');
const { protect } = require('../middleware/auth');

router.use(protect); // All routes require authentication

router.post('/predict', yieldScoreController.predictAndSaveScore);
router.get('/my-score', yieldScoreController.getUserYieldScore);

module.exports = router;