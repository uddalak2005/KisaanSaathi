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
        type: String,  // Changed from Number to String
        required: true,
        trim: true,
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);  // Validates 10-digit phone numbers
            },
            message: props => `${props.value} is not a valid phone number!`
        }
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
            required: true  // Changed to required
        },
        district: {
            type: String,
            required: true  // Changed to required
        }
    },
    aadharNum: {
        type: Number,
        required: true,   
        // Remove unique: true from here
        validate: {
            validator: function(v) {
                return /^\d{12}$/.test(v.toString());
            },
            message: props => `${props.value} is not a valid 12-digit Aadhar number!`
        }
    },
    loanHistory: [{
        type: Schema.Types.ObjectId,
        ref: 'Loan'
    }],
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