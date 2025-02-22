const axios = require('axios');

const FLASK_API_URL = process.env.FLASK_API_URL || 'http://192.168.190.128:5000/api/predict';

const yieldPredictionService = {
    predictYieldScore: async (data) => {
        try {
            console.log('Sending request to Flask API:', {
                crop: data.cropName,
                district: data.location.district,
                land: data.land
            });

            const response = await axios.get(FLASK_API_URL, {
                params: {
                    crop: data.cropName,
                    district: data.location.district,
                    land: data.land
                }
            });
            
            console.log('Flask API Response:', response.data);
            return response.data.score;
        } catch (error) {
            console.error('Flask API Error:', error.response?.data || error.message);
            throw new Error('Failed to get prediction from AI model');
        }
    }
};

module.exports = yieldPredictionService;