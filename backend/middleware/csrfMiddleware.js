/**
 * CSRF protection middleware
 */
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

// CSRF protection configuration
const csrfProtection = csrf({
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
  }
});

// Error handler for CSRF errors
const handleCSRFError = (err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);

  // Handle CSRF token errors
  res.status(403).json({
    error: 'Session has expired or form tampered with',
    message: 'Please try again'
  });
};

module.exports = {
  configureCSRF: (app) => {
    // Use cookie parser for CSRF cookie
    app.use(cookieParser());

    // Apply CSRF protection to all routes except specified ones
    app.use((req, res, next) => {
      // Exempt certain endpoints from CSRF protection if needed
      const exemptPaths = ['/api/webhook', '/api/status'];
      if (exemptPaths.includes(req.path)) {
        return next();
      }

      csrfProtection(req, res, next);
    });

    // Add CSRF error handler
    app.use(handleCSRFError);

    // Route to get CSRF token
    app.get('/api/csrf-token', (req, res) => {
      res.json({ csrfToken: req.csrfToken() });
    });
  }
};
