/**
 * Test configuration for GenAI Landing Page
 */

const config = {
  // Server configuration for testing
  server: {
    baseUrl: process.env.TEST_SERVER_URL || 'http://localhost:3000',
    apiPath: '/api',
    timeout: 5000 // ms
  },

  // Browser testing configuration
  browser: {
    viewports: {
      mobile: { width: 375, height: 667 },
      tablet: { width: 768, height: 1024 },
      desktop: { width: 1200, height: 800 }
    },
    browsers: ['chrome', 'firefox', 'safari'],
    headless: true
  },

  // Test data
  testData: {
    validUser: {
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test message'
    },
    invalidUser: {
      name: '',
      email: 'invalid-email',
      message: 'Test'
    }
  },

  // Report configuration
  reporting: {
    outputDir: './test-reports',
    screenshotsDir: './test-reports/screenshots',
    generateHtmlReport: true,
    captureScreenshotOnFailure: true
  }
};

module.exports = config;
