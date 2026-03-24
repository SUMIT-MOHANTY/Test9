/**
 * Security middleware for the GenAI landing page backend
 * Provides protection against common API vulnerabilities
 */

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { randomBytes } = require('crypto');

// Rate limiting configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.'
});

// AI generation endpoint needs stricter limits
const aiGenerationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 AI generations per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: 'You have exceeded the AI generation limit. Please try again later.'
});

// Apply security headers using Helmet
const securityHeaders = (app) => {
  app.use(helmet());

  // Generate a new nonce for CSP with each request
  app.use((req, res, next) => {
    res.locals.nonce = randomBytes(16).toString('base64');
    next();
  });

  // Apply custom CSP with nonce
  app.use((req, res, next) => {
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'", "https://api.openai.com"]
      }
    })(req, res, next);
  });
};

module.exports = {
  apiLimiter,
  aiGenerationLimiter,
  securityHeaders
};
