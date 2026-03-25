/**
 * Error handling middleware for Express
 * Provides consistent error responses for API endpoints
 */

// Custom error class for API errors
class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', err);

  // Default to 500 internal server error
  const statusCode = err.statusCode || 500;

  // Prepare error response
  const errorResponse = {
    status: 'error',
    message: err.message || 'An unexpected error occurred'
  };

  // Include error details in non-production environments
  if (process.env.NODE_ENV !== 'production' && err.details) {
    errorResponse.details = err.details;
  }

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
};

// Not found middleware
const notFoundHandler = (req, res, next) => {
  const error = new ApiError(404, `Resource not found: ${req.originalUrl}`);
  next(error);
};

// Rate limiting error handler
const rateLimitHandler = (req, res) => {
  res.status(429).json({
    status: 'error',
    message: 'Too many requests, please try again later'
  });
};

module.exports = {
  ApiError,
  errorHandler,
  notFoundHandler,
  rateLimitHandler
};
