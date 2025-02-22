const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    interestRate: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true // duration in months
    },
    borrower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Loan', loanSchema);