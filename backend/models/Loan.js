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
    aadharNum: {
        type: Number,
        required: true,
        ref: 'User'
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

loanSchema.index({ aadharNum: 1 });

module.exports = mongoose.model('Loan', loanSchema);