const axios = require('axios');

const FLASK_API_URL = 'https://agentsay-kisaansaathi.hf.space/api/predict';
const HF_TOKEN = process.env.HUGGING_FACE_TOKEN; // Add this to your .env file

const yieldPredictionService = {
    predictYieldScore: async (data) => {
        try {
            // Normalize the data to match the API expectations
            const params = {
                crop: data.cropName.toUpperCase(), // Ensure crop name is uppercase
                district: data.location.district,
                land: Number(data.land) // Ensure land is a number
            };

            console.log('Sending request to Flask API:', params);

            const response = await axios.get(FLASK_API_URL, {
                params,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${HF_TOKEN}`
                }
            });
            
            console.log('Flask API Response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Flask API Error Details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                requestData: {
                    crop: data.cropName,
                    district: data.location.district,
                    land: data.land
                },
                url: FLASK_API_URL
            });

            // Throw a more descriptive error
            if (error.code === 'ECONNREFUSED') {
                throw new Error('Could not connect to the prediction service');
            } else if (error.response) {
                throw new Error(`API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
            } else {
                throw new Error(`Failed to get prediction: ${error.message}`);
            }
        }
    }
};

module.exports = yieldPredictionService;