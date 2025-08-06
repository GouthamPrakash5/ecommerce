// Load environment variables first
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

// Import centralized API and middleware
const apiRoutes = require('./api');
const { configureMiddleware, errorHandler, notFoundHandler } = require('./middleware');

const app = express();

// MongoDB Connection
const MONGODB_URI = `${process.env.MONGO_URI}/rainbowshop `;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Configure middleware
configureMiddleware(app);

// API Routes
app.use('/api', apiRoutes);
app.get('/', (req, res) => {
  res.send('API is working!');
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', notFoundHandler);

module.exports = app;
