const express = require('express');
const path = require('path');
const morgan = require('morgan');
const winston = require('winston');
const setupSecurity = require('./config/security');
const { apiLimiter, sanitizeInputs } = require('./middleware/security');

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'genai-landing' },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Error logging middleware
const errorLogger = (err, req, res, next) => {
  // Remove sensitive data
  const sanitizedError = {
    message: err.message,
    path: req.path,
    method: req.method
  };
  logger.error(sanitizedError);
  next(err);
};

// Error handler
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message
  });
};

// Initialize app
const app = express();

// Apply security configs
const security = setupSecurity(app);

// Basic middlewares
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Apply sanitization to all routes
app.use(sanitizeInputs);

// Apply rate limiting to all API routes
app.use('/api', apiLimiter);

// Define routes
app.use('/api/contact', require('./routes/contact'));
app.use('/api/features', require('./routes/features'));

// Serve static files
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Error handling
app.use(errorLogger);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  app.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});
