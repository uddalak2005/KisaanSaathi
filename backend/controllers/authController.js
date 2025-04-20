const User = require('../models/User');
const jwt = require('jsonwebtoken');

const authController = {
    register: async (req, res) => {
        try {
            const {
                phone,
                password,
                firstName,
                lastName,
                middleName = '',
                location,
                aadharNum
            } = req.body;

            console.log('1. Received Data:', {
                phone, firstName, lastName, location, aadharNum
            });
            
            // Validate required fields
            if (!phone || !password || !firstName || !lastName || !location || !aadharNum) {
                return res.status(400).json({
                    success: false,
                    message: 'All required fields must be provided'
                });
            }

            // Check if user exists by phone or aadhar
            const existingUser = await User.findOne({
                $or: [
                    { phone },
                    { aadharNum }
                ]
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: existingUser.phone === phone ? 
                        'Phone number already registered' : 
                        'Aadhar number already registered'
                });
            }

            // Create user ID
            const userId = 'KS' + Date.now().toString().slice(-6);

            // Create new user
            const user = new User({
                userId,
                phone,
                password,
                firstName,
                lastName,
                middleName,
                location,
                aadharNum
            });

            // Save user to database
            const savedUser = await user.save();
            console.log('2. User saved successfully:', {
                userId: savedUser.userId,
                phone: savedUser.phone,
                aadharNum: savedUser.aadharNum
            });

            // Generate JWT token
            const token = jwt.sign(
                { id: savedUser._id },
                process.env.JWT_SECRET,
                { expiresIn: '30d' }
            );

            // Send response
            res.status(201).json({
                success: true,
                token,
                data: {
                    user: {
                        id: savedUser._id,
                        userId: savedUser.userId,
                        phone: savedUser.phone,
                        firstName: savedUser.firstName,
                        lastName: savedUser.lastName,
                        aadharNum: savedUser.aadharNum,
                        location: savedUser.location
                    }
                }
            });
        } catch (error) {
            console.error('Registration Error:', error);
            res.status(500).json({
                success: false,
                message: 'Error during registration',
                error: error.message
            });
        }
    },

    login: async (req, res) => {
        try {
            const { phone, password } = req.body;

            const user = await User.findOne({ phone });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            const isMatch = await user.matchPassword(password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '30d'
            });

            res.status(200).json({
                success: true,
                token,
                user: {
                    userId: user.userId,
                    phone: user.phone,
                    name: `${user.firstName} ${user.middleName ? user.middleName + ' ' : ''}${user.lastName}`,
                    location: user.location,
                    aadharNum: user.aadharNum,
                    isProfileComplete: user.isProfileComplete
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    verifyToken: async (req, res) => {
        try {
            // User will be already attached by protect middleware
            const user = await User.findById(req.user.id).select('-password');

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Token invalid'
                });
            }

            res.status(200).json({
                success: true,
                user: {
                    userId: user.userId,
                    phone: user.phone,
                    name: user.getFullName(),
                    location: user.location,
                    aadharNum: user.aadharNum,
                    isProfileComplete: user.isProfileComplete
                }
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: 'Token verification failed'
            });
        }
    }
};

module.exports = authController;