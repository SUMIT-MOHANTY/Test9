const rateLimit = require('express-rate-limit');
const { validationResult, body } = require('express-validator');

// Configure rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: "Too many requests, please try again later." }
});

// Common input validation
const validateContactForm = [
  body('name').trim().isLength({ min: 1 }).escape().withMessage('Name is required'),
  body('email').trim().isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('message').trim().isLength({ min: 5 }).escape().withMessage('Message must be at least 5 characters')
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Sanitize all inputs to prevent XSS
const sanitizeInputs = (req, res, next) => {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].replace(/<[^>]*>/g, '');
      }
    }
  }
  next();
};

module.exports = {
  apiLimiter,
  validateContactForm,
  handleValidationErrors,
  sanitizeInputs
};
