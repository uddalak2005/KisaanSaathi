const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

// Route to create a new loan
router.post('/', loanController.createLoan);

// Route to get all loans
router.get('/', loanController.getAllLoans);

// Route to get a loan by ID
router.get('/:id', loanController.getLoanById);

// Route to update a loan
router.put('/:id', loanController.updateLoan);

// Route to delete a loan
router.delete('/:id', loanController.deleteLoan);

module.exports = router;