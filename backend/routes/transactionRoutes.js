const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Route to create a new transaction
router.post('/', transactionController.createTransaction);

// Route to get transaction history
router.get('/:userId', transactionController.getTransactionHistory);

module.exports = router;