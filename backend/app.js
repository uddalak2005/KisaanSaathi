const express = require('express');
const cors = require('cors');
const loanRoutes = require('./routes/loanRoutes');
const authRoutes = require('./routes/authRoutes');
const yieldScoreRoutes = require('./routes/yieldScoreRoutes');

const app = express();



// CORS Configuration
app.use(cors({
    origin: '*', // Be more specific in production
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());

// Routes
app.use('/api/loans', loanRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/yield-score', yieldScoreRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

app.use((req, res, next) => {
    console.log('Request received:', {
        method: req.method,
        path: req.path,
        body: req.body,
        query: req.query,
        headers: req.headers
    });
    next();
});

module.exports = app;