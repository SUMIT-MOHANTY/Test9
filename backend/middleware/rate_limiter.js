/**
 * Rate limiting middleware to prevent abuse of the API
 */
const rateLimit = require('express-rate-limit');

const generateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    error: true,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  },
  skip: (req, res) => {
    // Skip rate limiting for certain trusted IPs or admin users
    // Example: return req.ip === 'trusted-ip' || req.user?.role === 'admin';
    return false;
  },
  keyGenerator: (req) => {
    // Use user ID for logged-in users to prevent user-based abuse
    return req.user?.id || req.ip;
  },
});

module.exports = generateLimiter;
