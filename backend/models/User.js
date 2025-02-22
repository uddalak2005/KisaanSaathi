const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;


const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        required: true
    },
    phone: {
        type: Number,
        unique: true,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    middleName: {
        type: String,
        trim: true,
        default: ''
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        state: {
            type: String,
            default: ''
        },
        district: {
            type: String,
            default: ''
        }
    },
    yieldScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    loanHistory: [{
        type: Schema.Types.ObjectId,
        ref: 'Loan'
    }],
    aadharNum: {
        type: Number,
        default: null
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

// ... rest of the model code remains same

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateAuthToken = function() {
    return jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};

// Get user's full name
userSchema.methods.getFullName = function() {
    return `${this.firstName} ${this.middleName ? this.middleName + ' ' : ''}${this.lastName}`;
};

// Create indexes
userSchema.index({ phone: 1 }, { unique: true });
userSchema.index({ aadharNum: 1 }, { unique: true, sparse: true });
userSchema.index({ "location.state": 1, "location.district": 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;