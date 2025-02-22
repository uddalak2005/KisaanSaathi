const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const loanRoutes = require('./routes/loanRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const { connectDB } = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/transactions', transactionRoutes);

module.exports = app;