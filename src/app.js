const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);
app.get('/', (req, res) => {
  res.send('Welcome to the Auth OTP Service API');
});
// Error handling
app.use(errorHandler);

module.exports = app;
