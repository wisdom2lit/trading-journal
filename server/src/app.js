const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const { errorHandler } = require('./middlewares/errorHandler');
const logger = require('./utils/logger');
const rateLimit = require('express-rate-limit');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: { success: false, error: 'Too many requests from this IP, please try again after 15 mins' }
});
app.use('/api', limiter);

// Route for stripe webhook must be BEFORE express.json() and use raw body
const stripeRoutes = require('./routes/stripeRoutes');
app.use('/api/v1/stripe/webhook', express.raw({ type: 'application/json' }), stripeRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Routes
app.use('/api/v1', routes);

// Centralized Error Handling
app.use(errorHandler);

module.exports = app;
