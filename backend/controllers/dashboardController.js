const User = require('../models/User');
const Loan = require('../models/Loan');
const YieldScore = require('../models/YieldScore');
const Transaction = require('../models/Transaction');

const dashboardController = {
    getUserDashboard: async (req, res) => {
        try {
            const { aadharNum } = req.params;

            console.log(`dashboard requested for ${aadharNum}`)
            // Get user data
            const user = await User.findOne({ aadharNum })
                .select('-password');

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Get yield scores
            const yieldScore = await YieldScore.findOne({ aadharNum });

            // Get loans
            const loans = await Loan.find({ aadharNum });

            // Get recent transactions
            const transactions = await Transaction.find({ aadharNum })
                .sort({ date: -1 })
                .limit(5);

            res.status(200).json({
                success: true,
                dashboardData: {
                    user: {
                        name: user.getFullName(),
                        location: user.location,
                        userId: user.userId
                    },
                    yieldScore: yieldScore ? {
                        yieldScore
                    } : null,
                    loans: loans.map(loan => ({
                        amount: loan.amount,
                        status: loan.status,
                        interestRate: loan.interestRate,
                        createdAt: loan.createdAt
                    })),
                    recentTransactions: transactions,
                    stats: {
                        totalLoans: loans.length,
                        activeLoans: loans.filter(l => l.status === 'approved').length,
                        totalCrops: yieldScore ? yieldScore.crops.length : 0
                    }
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};

module.exports = dashboardController;