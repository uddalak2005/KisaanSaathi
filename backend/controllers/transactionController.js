module.exports = {
    createTransaction: async (req, res) => {
        try {
            const { loanId, amount } = req.body;
            const transaction = new Transaction({
                loanId,
                amount,
                date: new Date(),
                status: 'pending'
            });
            await transaction.save();
            res.status(201).json(transaction);
        } catch (error) {
            res.status(500).json({ message: 'Error creating transaction', error });
        }
    },

    getTransactionHistory: async (req, res) => {
        try {
            const transactions = await Transaction.find({ loanId: req.params.loanId });
            res.status(200).json(transactions);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving transaction history', error });
        }
    }
};