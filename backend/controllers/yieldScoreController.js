const User = require('../models/User');
const YieldScore = require('../models/YieldScore');
const yieldPredictionService = require('../services/yieldPredictionService');


const yieldScoreController = {
    predictAndSaveScore: async (req, res) => {
        try {
            const { cropName, location, land } = req.body;
            const aadharNum = req.user.aadharNum;

            console.log(cropName, location, land, aadharNum);   

            // Input validation
            if (!cropName || !location || !land) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide all required fields: cropName, location, and land'
                });
            }

            // Get user for verification
            const user = await User.findOne({ aadharNum });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Send data to Flask API and get prediction

            const predictedScore = await yieldPredictionService.predictYieldScore({
                cropName,
                location,
                land
            });

            console.log('Predicted Score:', predictedScore);

            // Find or create yield score document
            let yieldScore = await YieldScore.findOne({ aadharNum });
            if (!yieldScore) {
                yieldScore = new YieldScore({
                    aadharNum,
                    crops: [],
                    score: predictedScore, // Make sure score is set
                    location: location
                });
            }


            yieldScore.crops.push({
                name: cropName,
                land: land
            });
            
            // Update score from prediction
            yieldScore.score = predictedScore;

            const savedScore = await yieldScore.save();

            res.status(200).json({
                success: true,
                data: {
                    score : predictedScore,
                    _id: savedScore._id,
                    aadharNum: savedScore.aadharNum,
                    crops: savedScore.crops
                }
            });
            
        } catch (error) {
            console.error('Controller Error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    getUserYieldScore: async (req, res) => {
        try {
            const { aadharNum } = req.user;
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