const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });


const PORT = process.env.PORT || 3000;
<<<<<<< HEAD
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/';
=======
const MONGO_URI = process.env.MONGO_URL || 'mongodb://localhost:27017/kisaan-saathi';
>>>>>>> 59c6d0b3f854b674ed8f2cfc05a169a610a3f162

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB connected successfully');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });