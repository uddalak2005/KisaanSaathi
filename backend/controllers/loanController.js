const Loan = require('../models/Loan');
const User = require('../models/User');

const loanController = {
    getAllLoans: async (req, res) => {
        try {
            const loans = await Loan.find();
            res.status(200).json({
                success: true,
                data: loans
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                message: error.message 
            });
        }
    },

    getLoanById: async (req, res) => {
        try {
            const loan = await Loan.findOne({ aadharNum: req.params.aadharNum });
            if (!loan) {
                return res.status(404).json({
                    success: false,
                    message: 'Loan not found'
                });
            }
            res.status(200).json({
                success: true,
                data: loan
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    createLoan: async (req, res) => {
        try {
            const { 
                amount, 
                interestRate, 
                duration, 
                aadharNum,
                yieldScore 
            } = req.body;

            // Verify user exists
            const user = await User.findOne({ aadharNum });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            const newLoan = new Loan({ 
                aadharNum,
                amount, 
                interestRate, 
                duration,
                status: 'pending',
                yieldScore,
                borrower: `${user.firstName} ${user.lastName}`,
                transactions: []
            });

            const savedLoan = await newLoan.save();

            // Update user's loan history
            user.loanHistory.push(savedLoan._id);
            await user.save();

            res.status(201).json({
                success: true,
                data: savedLoan
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    updateLoan: async (req, res) => {
        try {
            const { aadharNum } = req.params;
            const updatedLoan = await Loan.findOneAndUpdate(
                { aadharNum },
                req.body,
                { new: true }
            );

            if (!updatedLoan) {
                return res.status(404).json({
                    success: false,
                    message: 'Loan not found'
                });
            }

            res.status(200).json({
                success: true,
                data: updatedLoan
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    deleteLoan: async (req, res) => {
        try {
            const { aadharNum } = req.params;
            const deletedLoan = await Loan.findOneAndDelete({ aadharNum });
            
            if (!deletedLoan) {
                return res.status(404).json({
                    success: false,
                    message: 'Loan not found'
                });
            }

            // Remove loan from user's loan history
            const user = await User.findOne({ aadharNum });
            if (user) {
                user.loanHistory = user.loanHistory.filter(
                    loanId => loanId.toString() !== deletedLoan._id.toString()
                );
                await user.save();
            }

            res.status(204).send();
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    getUserLoans: async (req, res) => {
        try {
            const { aadharNum } = req.params;
            const loans = await Loan.find({ aadharNum });

            res.status(200).json({
                success: true,
                data: loans
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};

module.exports = loanController;