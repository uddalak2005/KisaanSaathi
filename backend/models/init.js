const mongoose = require('mongoose');
const User = require('./User');
const Loan = require('./Loan');
const Transaction = require('./Transaction');
const YieldScore = require('./YieldScore');
const bcrypt = require('bcrypt');

const main = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connection established");

        // Clear existing data
        console.log('Clearing existing data...');
        await Promise.all([
            User.deleteMany({}),
            YieldScore.deleteMany({}),
            Loan.deleteMany({}),
            Transaction.deleteMany({})
        ]);
        console.log('Existing data cleared');

        // Hash password for sample user
        const timestamp = Date.now().toString().slice(-6);
        const userId = `KS${timestamp}`;

        // Hash password for sample user
        const hashedPassword = await bcrypt.hash('password123', 10);

        // Sample User
        const user = new User({
            userId,  // Dynamic userId
            phone: 9876543210,
            password: hashedPassword,
            firstName: 'Ram',
            middleName: 'Kumar',
            lastName: 'Singh',
            location: {
                state: 'Uttar Pradesh',
                district: 'Lucknow'
            },
            aadharNum: 123456789012,
            role: 'farmer',
            isProfileComplete: true,
            loanHistory: []
        });

        // Sample YieldScore linked to user via aadharNum
        const yieldScore = new YieldScore({
            aadharNum: user.aadharNum, // Link to user
            crops: [
                {
                    name: 'Wheat',
                    land: 5 // in acres
                },
                {
                    name: 'Rice',
                    land: 3 // in acres
                }
            ],
            score : 80,
            location: {
                state: user.location.state,
                district: user.location.district
            }
        });

        // Sample Loan
        const loan = new Loan({
            aadharNum: user.aadharNum, // Link to user
            amount: 50000,
            interestRate: 12,
            duration: 12,
            status: 'pending',
            yieldScore: yieldScore.score, // Store yield score at time of loan
            borrower : user.firstName + ' ' + user.lastName,
            transactions: [] // Will be populated with transaction IDs
        });

        // Sample Transaction
        const transaction = new Transaction({
            loanId: loan._id,
            aadharNum: user.aadharNum, // Link to user
            amount: 4500, // Monthly installment
            status: 'pending'
        });

        // Save all documents
        console.log('Saving documents...');
        
        const savedUser = await user.save();
        console.log('Sample user created:', savedUser.userId);

        const savedYieldScore = await yieldScore.save();
        console.log('Sample yield score created for aadharNum:', savedYieldScore.aadharNum);

        const savedLoan = await loan.save();
        console.log('Sample loan created:', savedLoan._id);

        const savedTransaction = await transaction.save();
        console.log('Sample transaction created:', savedTransaction._id);

        // Update relationships
        loan.transactions.push(savedTransaction._id);
        await loan.save();
        console.log('Loan updated with transaction');

        user.loanHistory.push(savedLoan._id);
        await user.save();
        console.log('User updated with loan history');

        console.log('\nSample Data Summary:');
        console.log('User:', {
            userId: savedUser.userId,
            name: `${savedUser.firstName} ${savedUser.lastName}`,
            aadharNum: savedUser.aadharNum
        });
        console.log('YieldScore:', {
            aadharNum: savedYieldScore.aadharNum,
            crops: savedYieldScore.crops
        });
        console.log('Loan:', {
            amount: savedLoan.amount,
            status: savedLoan.status
        });

        await mongoose.connection.close();
        console.log('\nMongoDB connection closed');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

main();