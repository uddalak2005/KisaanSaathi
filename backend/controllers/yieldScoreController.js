const User = require('../models/User');
const YieldScore = require('../models/YieldScore');
const yieldPredictionService = require('../services/yieldPredictionService');

const yieldScoreController = {
    predictAndSaveScore: async (req, res) => {
        try {
            const { cropName } = req.body;
            const aadharNum = req.user.aadharNum; // Get from authenticated user

            // Get user's location
            const user = await User.findOne({ aadharNum });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Get prediction from AI model
            const predictedScore = await yieldPredictionService.predictYieldScore(
                cropName,
                user.location
            );

            // Find or create yield score document
            let yieldScore = await YieldScore.findOne({ aadharNum });
            if (!yieldScore) {
                yieldScore = new YieldScore({
                    aadharNum,
                    crops: [],
                    score: predictedScore,
                    location: user.location
                });
            }

            // Add new crop
            yieldScore.crops.push({ name: cropName });
            yieldScore.score = predictedScore; // Update score
            
            await yieldScore.save();

            res.status(200).json({
                success: true,
                data: {
                    cropName,
                    score: predictedScore,
                    location: user.location
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    getUserYieldScore: async (req, res) => {
        try {
            const aadharNum = req.user.aadharNum;
            
            const yieldScore = await YieldScore.findOne({ aadharNum });
            if (!yieldScore) {
                return res.status(404).json({
                    success: false,
                    message: 'No yield score found'
                });
            }

            res.status(200).json({
                success: true,
                data: yieldScore
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};

module.exports = yieldScoreController;