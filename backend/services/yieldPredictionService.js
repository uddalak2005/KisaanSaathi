const axios = require('axios');

const FLASK_API_URL = process.env.FLASK_API_URL || 'http://localhost:5000/predict';

const yieldPredictionService = {
    predictYieldScore: async (cropName, location) => {
        try {
            const response = await axios.post(FLASK_API_URL, {
                crop: cropName,
                location: location
            });
            
            return response.data.score; // Assuming Flask API returns { score: number }
        } catch (error) {
            throw new Error('Failed to get prediction from AI model');
        }
    }
};

module.exports = yieldPredictionService;