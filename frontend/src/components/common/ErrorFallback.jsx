import React from 'react';

/**
 * ErrorFallback component for displaying user-friendly error messages
 */
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="error-fallback">
      <h2>Oops! Something went wrong</h2>
      <p>We're sorry, but we couldn't complete your request.</p>
      {error && <p className="error-message">{error.message || 'An unknown error occurred'}</p>}
      <button onClick={resetErrorBoundary}>Try Again</button>
    </div>
  );
};

export default ErrorFallback;
