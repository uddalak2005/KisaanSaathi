const mongoose = require('mongoose');

const yieldScoreSchema = new mongoose.Schema({
    location: {
        state: {
            type: String,
            required: true
        },
        district : {
            type : String,
            required : true
        }
    },
    cropType: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('YieldScore', yieldScoreSchema);