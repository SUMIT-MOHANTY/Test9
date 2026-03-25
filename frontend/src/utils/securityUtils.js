/**
 * Security utility functions for the GenAI landing page
 * Provides sanitization and protection against common web vulnerabilities
 */

/**
 * Sanitizes user input to prevent XSS attacks
 * @param {string} input - The user input to sanitize
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return '';

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Creates a Content Security Policy header value
 * @returns {string} CSP header value
 */
export const getCSPDirectives = () => {
  return "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://api.openai.com;";
};

/**
 * Validates URLs to prevent open redirect vulnerabilities
 * @param {string} url - The URL to validate
 * @returns {boolean} Whether the URL is valid and safe
 */
export const isValidUrl = (url) => {
  if (!url) return false;

  // Check if relative URL (safe)
  if (url.startsWith('/') && !url.startsWith('//')) return true;

  try {
    const urlObj = new URL(url);
    // Add allowed domains here
    const allowedDomains = ['yourdomain.com', 'api.openai.com'];
    return allowedDomains.includes(urlObj.hostname);
  } catch (e) {
    return false;
  }
};
