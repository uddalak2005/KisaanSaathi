const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const { protect } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(protect);

// Loan routes
router.route('/')
    .get(loanController.getAllLoans)
    .post(loanController.createLoan);

router.route('/:id')
    .get(loanController.getLoanById)
    .put(loanController.updateLoan)
    .delete(loanController.deleteLoan);

module.exports = router;