const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        required: true
    },
    phone: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    middleName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
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
    yieldScore: {
        type: Number,
        min: 0,
        max: 100
    },
    loanHistory: [{
        type: Schema.Types.ObjectId,
        ref: 'Loan'
    }],
    aadharNum: {
        type: Number,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^\d{12}$/.test(v.toString());
            },
            message: props => `${props.value} is not a valid 12-digit Aadhar number!`
        }
    },
    role: {
        type: String,
        enum: ['farmer', 'admin'],
        default: 'farmer'
    },
    isProfileComplete: {
        type: Boolean,
        default: false
    }
}, { 
    timestamps: true 
});

// Index for location-based queries
userSchema.index({ "location.coordinates": "2dsphere" });

// Create a compound index for efficient queries
userSchema.index({ phone: 1, aadharNum: 1 });

const User = mongoose.model('User', userSchema);
module.exports = User;