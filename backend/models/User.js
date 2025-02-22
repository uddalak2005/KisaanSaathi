const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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
        trim: true,
        validate: {
            validator: function(v) {
                return /^\+\d{12}$/.test(v);
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
        district: {
            type: String,
            required: true
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

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateAuthToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Indexes
userSchema.index({ phone: 1, aadharNum: 1 });
userSchema.index({ "location.state": 1, "location.district": 1 });

const User = mongoose.model('User', userSchema);
module.exports = User;