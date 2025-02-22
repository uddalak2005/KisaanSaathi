const express = require('express');
const mongoose = require('mongoose');
const app = require('./app');
const PORT = process.env.PORT || 5000;

mongoose.connect('your_mongodb_connection_string', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});