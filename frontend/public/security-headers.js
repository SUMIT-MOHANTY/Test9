/**
 * Content Security Policy configuration
 *
 * This file is intended to be used with a CSP implementation
 * such as Helmet for Express or a similar middleware
 */

const cspConfig = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      // Add nonce support for inline scripts if needed
      // (nonce-${nonce})
    ],
    styleSrc: [
      "'self'",
      // Add nonce support for inline styles if needed
      // (nonce-${nonce})
    ],
    imgSrc: ["'self'", "data:", "https://images.unsplash.com"],
    connectSrc: ["'self'", "https://api.your-domain.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    frameSrc: ["'none'"],
    // Report violations to this endpoint
    reportUri: '/csp-violation-report'
  }
};

// Example implementation for Express.js with Helmet
/*
const helmet = require('helmet');

app.use(
  helmet.contentSecurityPolicy({
    directives: cspConfig.directives
  })
);

app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.hsts({
  maxAge: 31536000,
  includeSubDomains: true,
  preload: true
}));
*/

module.exports = cspConfig;
