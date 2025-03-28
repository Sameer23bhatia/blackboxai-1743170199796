require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Route files
const auth = require('./routes/auth');
const products = require('./routes/products');

// Mount routers
app.use('/api/auth', auth);
app.use('/api/products', products);

// Database connection
const connectDB = require('./config/db');
connectDB();

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'E-Commerce Tool API' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});