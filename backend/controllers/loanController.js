module.exports = {
    createLoan: async (req, res) => {
        try {
            const { amount, interestRate, duration, borrowerId } = req.body;
            const newLoan = new Loan({ amount, interestRate, duration, borrower: borrowerId });
            await newLoan.save();
            res.status(201).json(newLoan);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getLoan: async (req, res) => {
        try {
            const loan = await Loan.findById(req.params.id);
            if (!loan) return res.status(404).json({ message: 'Loan not found' });
            res.status(200).json(loan);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateLoan: async (req, res) => {
        try {
            const updatedLoan = await Loan.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedLoan) return res.status(404).json({ message: 'Loan not found' });
            res.status(200).json(updatedLoan);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteLoan: async (req, res) => {
        try {
            const deletedLoan = await Loan.findByIdAndDelete(req.params.id);
            if (!deletedLoan) return res.status(404).json({ message: 'Loan not found' });
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getAllLoans: async (req, res) => {
        try {
            const loans = await Loan.find();
            res.status(200).json(loans);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};