/**
 * Global error handling middleware for Express
 */
const errorHandler = (err, req, res, next) => {
  // Log the error for server-side debugging
  console.error('Server Error:', err);

  // Determine the status code
  const statusCode = err.statusCode || err.status || 500;

  // Build the error response
  const errorResponse = {
    error: true,
    message: err.message || 'Internal Server Error',
  };

  // Add stack trace in development mode only
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  // For specific types of errors, add more context
  if (err.code === 'ECONNREFUSED') {
    errorResponse.message = 'Database connection failed';
  } else if (err.name === 'ValidationError') {
    errorResponse.message = 'Validation failed';
    errorResponse.details = err.details;
  } else if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: true,
      message: 'Invalid token or not authenticated',
    });
  }

  // Send the error response
  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
