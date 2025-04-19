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
                middleName,
                location,
                aadharNum
            } = req.body; //req.body

            console.log('1. Received Data:', { 
                phone, firstName, lastName, location, aadharNum 
            });
            // Check if user exists
            const userExists = await User.findOne({ phone });

            console.log('1. Request type:', req.method);
            console.log('1a. Content-Type:', req.headers['content-type']);
            console.log('1b. Received Data:', { 
                phone, firstName, lastName, location, aadharNum 
            });



            if (userExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Phone number already registered'
                });
            }

            // Validate Aadhar number
            if (!aadharNum || !/^\d{12}$/.test(String(aadharNum))) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid Aadhar number format',
                    aadharNum: aadharNum
                });
            }


            // Create user ID
            const userId = 'KS' + Date.now().toString().slice(-6);
            console.log('4. Generated UserId:', userId);

            // Create new user with all fields
            const user = new User({
                userId,
                phone,
                password,
                firstName,
                lastName,
                middleName,
                location: {
                    state: location.state,
                    district: location.district
                },
                aadharNum,
                isProfileComplete: true // Since all data is provided
            });

            console.log('5. Created User Object:', user);

            const savedUser = await user.save();

            console.log('6. Saved User:', savedUser);

            // Generate token
            // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            //     expiresIn: '30d'
            // });

            // console.log('7. Generated Token:', token ? 'Token generated' : 'Token generation failed');

            res.status(201).json({
                success: true,
                token,
                user: {
                    userId: user.userId,
                    phone: user.phone,
                    name: `${user.firstName} ${user.middleName ? user.middleName + ' ' : ''}${user.lastName}`,
                    location: user.location,
                    aadharNum: user.aadharNum,
                    isProfileComplete: true
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
                details: error.errors // MongoDB validation errors
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

    // Add this to your existing authController object
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