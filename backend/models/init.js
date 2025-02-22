const mongoose = require('mongoose');
const User = require('./User');
const Loan = require('./Loan');
const Transaction = require('./Transaction');
const YieldScore = require('./YieldScore');

const main = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/kisaan-saathi", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connection established");

        // Sample User (matching User.js schema)
        const user = new User({
            userId: 'KS000001',
            phone: '+919876543210',
            firstName: 'Ram',
            middleName: 'Kumar',
            lastName: 'Singh',
            location: {
                state: 'Uttar Pradesh',
                district: 'Lucknow'  // Changed from coordinates to district
            },
            yieldScore: 85,
            loanHistory: [], // Will be updated after loan creation
            aadharNum: 123456789012,
            role: 'farmer',
            isProfileComplete: true
        });

        // Sample YieldScore
        const yieldScore = new YieldScore({
            location: {
                state: 'Uttar Pradesh',
                district: 'Lucknow'
            },
            cropType: 'Wheat',
            score: 85
        });

        // Sample Loan (matching Loan.js schema)
        const loan = new Loan({
            amount: 50000,
            interestRate: 12,
            duration: 12, // months
            borrower: user._id, // Changed from borrowerId to borrower
            status: 'pending', // Changed to match enum: ['pending', 'approved', 'rejected']
            createdAt: new Date()
        });

        // Sample Transaction (matching Transaction.js schema)
        const transaction = new Transaction({
            loanId: loan._id,
            amount: 50000,
            date: new Date(),
            status: 'pending' // Changed to match enum: ['pending', 'completed', 'failed']
        });

        // Save documents in order
        await user.save();
        console.log('Sample user created');

        await yieldScore.save();
        console.log('Sample yield score created');

        await loan.save();
        console.log('Sample loan created');

        await transaction.save();
        console.log('Sample transaction created');

        // Update user's loan history
        user.loanHistory.push(loan._id);
        await user.save();
        console.log('User loan history updated');

        console.log('Database initialized successfully');
        
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

main();