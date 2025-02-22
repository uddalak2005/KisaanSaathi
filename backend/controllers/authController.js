const User = require('../models/User');
const jwt = require('jsonwebtoken');

const authController = {
    register: async (req, res) => {
        try {
            const { phone, password, firstName, lastName } = req.body;

            const userExists = await User.findOne({ phone });
            if (userExists) {
                return res.status(400).json({ message: 'Phone number already registered' });
            }

            const userId = 'KS' + Date.now().toString().slice(-6);
            const user = new User({
                userId,
                phone,
                password,
                firstName,
                lastName,
                isProfileComplete: false
            });

            await user.save();
            const token = user.generateAuthToken();

            res.status(201).json({
                token,
                user: {
                    userId: user.userId,
                    phone: user.phone,
                    isProfileComplete: false
                }
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const { phone, password } = req.body;

            const user = await User.findOne({ phone });
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const isPasswordValid = await user.matchPassword(password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = user.generateAuthToken();

            res.status(200).json({
                token,
                user: {
                    userId: user.userId,
                    phone: user.phone,
                    isProfileComplete: user.isProfileComplete,
                    name: user.firstName + ' ' + user.lastName
                }
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    completeProfile: async (req, res) => {
        try {
            const { middleName, state, district, aadharNum } = req.body;

            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            user.middleName = middleName;
            user.location = { state, district };
            user.aadharNum = aadharNum;
            user.isProfileComplete = true;

            await user.save();

            res.status(200).json({
                message: 'Profile completed successfully',
                user: {
                    userId: user.userId,
                    name: `${user.firstName} ${user.lastName}`,
                    isProfileComplete: true
                }
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = authController;