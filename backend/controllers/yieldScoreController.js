module.exports = {
    getYieldScore: async (req, res) => {
        try {
            const { location, cropType } = req.body;
            // Logic to retrieve yield score based on location and crop type
            const yieldScore = await YieldScore.findOne({ location, cropType });
            if (!yieldScore) {
                return res.status(404).json({ message: 'Yield score not found' });
            }
            res.status(200).json(yieldScore);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    assessEligibility: async (req, res) => {
        try {
            const { location, cropType } = req.body;
            // Logic to assess eligibility based on yield score
            const yieldScore = await YieldScore.findOne({ location, cropType });
            if (!yieldScore) {
                return res.status(404).json({ message: 'Yield score not found' });
            }
            const isEligible = yieldScore.score >= 50; // Example threshold
            res.status(200).json({ isEligible });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
};