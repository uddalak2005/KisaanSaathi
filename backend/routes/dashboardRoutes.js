const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.get('/:aadharNum', protect, dashboardController.getUserDashboard);

module.exports = router;