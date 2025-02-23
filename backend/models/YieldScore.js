const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const yieldScoreSchema = new mongoose.Schema({
    best_crop: [{
        name: {
            type: String
        }
    }],
    aadharNum: {
        type: Number,
        required: true,
        ref: 'User'
    },
    crops: [{
        name: {
            type: String,
            required: true
        },
        land : {
            type: Number,
            required: true
        },
        score: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        predicted_yield : {
            type: String,
            required: true
        }
    }],
    soil_health: {
        type: String,
        required: true
    },
    yield_category: {
        type: String,
        required: true
    },

    loan_amount: {
        type: Number,
        required: true
    },
    
    location: {
        state: String,
        district: String
    }
}, {
    timestamps: true
});

// Create index for efficient queries
yieldScoreSchema.index({ aadharNum: 1 });

const YieldScore = mongoose.model('YieldScore', yieldScoreSchema);
module.exports = YieldScore;