const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');

const setupSecurity = (app) => {
  // Set security HTTP headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://via.placeholder.com"],
        connectSrc: ["'self'", "https://api.example.com"]
      }
    },
    xssFilter: true,
    noSniff: true,
    referrerPolicy: { policy: "same-origin" }
  }));

  // Parse cookies for CSRF protection
  app.use(cookieParser());

  // CSRF protection middleware
  const csrfProtection = csrf({ cookie: true });

  return {
    csrfProtection
  };
};

module.exports = setupSecurity;
