const express = require('express');
const router = express.Router();
const { validateContactForm, handleValidationErrors } = require('../middleware/security');

// POST /api/contact
router.post('/', validateContactForm, handleValidationErrors, async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Here would be the logic to save the contact form or send an email

    // Log the contact attempt (excluding sensitive data)
    console.info(`Contact form submission from ${name} at ${new Date().toISOString()}`);

    return res.status(200).json({ success: true, message: 'Thank you for your message!' });
  } catch (error) {
    // Don't expose error details to client in production
    console.error('Contact form error:', error);
    return res.status(500).json({
      success: false,
      message: 'There was a problem submitting your message. Please try again later.'
    });
  }
});

module.exports = router;
