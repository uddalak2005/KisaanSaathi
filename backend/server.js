const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });


const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URL;

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