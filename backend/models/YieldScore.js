const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const yieldScoreSchema = new mongoose.Schema({
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
    }],
    score: {
        type: Number,
        required: true,
        min: 0,
        max: 100
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