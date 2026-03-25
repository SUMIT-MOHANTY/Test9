const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const generateLimiter = require('../middleware/rate_limiter');

// AI generation endpoint with validation and rate limiting
router.post('/generate',
  generateLimiter,
  [
    body('prompt')
      .trim()
      .isLength({ min: 1, max: 1000 })
      .withMessage('Prompt must be between 1 and 1000 characters')
      .escape()
  ],
  async (req, res, next) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: true,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { prompt } = req.body;

      // Optional: sanitize/moderate the input
      // const sanitizedPrompt = await moderateContent(prompt);

      // Call AI service
      let result;
      try {
        // Example: call to AI service
        // result = await aiService.generateResponse(prompt);

        // Temporary mock response for testing
        result = `Generated response for: ${prompt}`;

        // Add artificial delay for testing loading states in frontend
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (aiError) {
        console.error('AI Service Error:', aiError);
        return res.status(503).json({
          error: true,
          message: 'AI service unavailable',
          details: process.env.NODE_ENV === 'development' ? aiError.message : undefined
        });
      }

      // Return successful response
      res.json({
        success: true,
        result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error); // Pass to global error handler
    }
  }
);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
