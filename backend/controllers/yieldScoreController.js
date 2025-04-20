const User = require('../models/User');
const YieldScore = require('../models/YieldScore');
const yieldPredictionService = require('../services/yieldPredictionService');


const yieldScoreController = {
    predictAndSaveScore: async (req, res) => {
        try {
            const { cropName, location, land } = req.body;
            const aadharNum = req.user.aadharNum;

            console.log('Received prediction request:', {
                cropName,
                location,
                land,
                aadharNum
            });

            // Input validation
            if (!cropName || !location || !land) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide all required fields: cropName, location, and land'
                });
            }

            if (!location.district) {
                return res.status(400).json({
                    success: false,
                    message: 'Location must include district'
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

            // Get prediction
            const predictedScore = await yieldPredictionService.predictYieldScore({
                cropName: cropName.trim(),
                location: {
                    district: location.district.trim()
                },
                land: parseFloat(land)
            });

            console.log('Prediction result:', predictedScore);

            // Find or create yield score document
            let yieldScore = await YieldScore.findOne({ aadharNum });
            if (!yieldScore) {
                yieldScore = new YieldScore({
                    aadharNum,
                    crops: [],
                    location: location,
                    soil_health : predictedScore.soil_health,
                    yield_category : predictedScore.yield_category,
                    loan_amount : predictedScore.loan_amount,
                    best_crop : []
                });
            }


            yieldScore.crops.push({
                name: cropName,
                land: land,
                score : predictedScore.score,
                predicted_yield : predictedScore.predicted_yield
            });

            predictedScore.best_crop.forEach(crop => {
                yieldScore.best_crop.push({ name: crop });
            })

            
            // Update score from prediction
            yieldScore.score = predictedScore;

            const savedScore = await yieldScore.save();

            res.status(200).json({
                success: true,
                data: {
                    savedScore : savedScore
                }
            });
            
        } catch (error) {
            console.error('Prediction error:', error);
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