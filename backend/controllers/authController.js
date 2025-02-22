const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.registerInitial = async (req, res) => {
    try {
        const { phone } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ phone });
        if (userExists) {
            return res.status(400).json({ 
                message: 'User already exists',
                isProfileComplete: userExists.isProfileComplete
            });
        }

        // Create user with minimal info
        const userId = 'KS' + Date.now().toString().slice(-6);
        const newUser = new User({
            userId,
            phone,
            isProfileComplete: false
        });

        await newUser.save();
        
        // Generate token
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { 
            expiresIn: '30d' 
        });

        res.status(201).json({
            token,
            userId: newUser.userId,
            isProfileComplete: false
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.completeProfile = async (req, res) => {
    try {
        const { 
            firstName, 
            middleName, 
            lastName, 
            state, 
            coordinates, 
            aadharNum 
        } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user profile
        user.firstName = firstName;
        user.middleName = middleName;
        user.lastName = lastName;
        user.location = {
            state,
            coordinates: {
                type: 'Point',
                coordinates
            }
        };
        user.aadharNum = aadharNum;
        user.isProfileComplete = true;

        await user.save();

        res.status(200).json({
            message: 'Profile completed successfully',
            user: {
                userId: user.userId,
                isProfileComplete: true,
                name: `${user.firstName} ${user.lastName}`
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};