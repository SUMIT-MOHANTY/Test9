/**
 * Error handling utilities for the frontend application
 */

// Handle API errors consistently
export const handleApiError = async (response) => {
  if (!response.ok) {
    // Try to get error details from response
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || `API Error: ${response.status}`);
    } catch (e) {
      // If parsing fails, throw generic error with status
      throw new Error(`API Error: ${response.status}`);
    }
  }
  return response.json();
};

// Format validation errors for display
export const formatValidationErrors = (errors) => {
  if (!errors || !Array.isArray(errors)) return 'Invalid form data';
  return errors.map(err => err.msg || err.message).join(', ');
};

// Log errors to our monitoring service (or console in development)
export const logError = (error, context = {}) => {
  if (process.env.NODE_ENV === 'production') {
    // In production, would send to a monitoring service like Sentry
    console.error('[ERROR]', error.message, context);

    // Example Sentry integration:
    // Sentry.captureException(error, { extra: context });
  } else {
    console.error('[DEV ERROR]', error, context);
  }
};

// Safe parsing of JSON to prevent errors
export const safeJsonParse = (data, fallback = null) => {
  try {
    return JSON.parse(data);
  } catch (e) {
    logError(e, { message: 'JSON parse failed', data: typeof data });
    return fallback;
  }
};

// Sanitize user input to prevent XSS
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.replace(/<[^>]*>/g, '');
};
