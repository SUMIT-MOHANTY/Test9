// Cross-browser testing configuration for Playwright

const browsers = [
  { name: 'chromium', use: { browserName: 'chromium' } },
  { name: 'firefox', use: { browserName: 'firefox' } },
  { name: 'webkit', use: { browserName: 'webkit' } } // Safari engine
];

const viewports = [
  { width: 1920, height: 1080, name: 'desktop' },
  { width: 1024, height: 768, name: 'tablet-landscape' },
  { width: 768, height: 1024, name: 'tablet-portrait' },
  { width: 375, height: 812, name: 'mobile' }
];

const runCompatibilityTests = async () => {
  const { chromium, firefox, webkit } = require('playwright');
  const results = [];

  for (const browser of browsers) {
    console.log(`Testing on ${browser.name}...`);

    let browserInstance;
    switch(browser.name) {
      case 'chromium': browserInstance = await chromium.launch(); break;
      case 'firefox': browserInstance = await firefox.launch(); break;
      case 'webkit': browserInstance = await webkit.launch(); break;
    }

    try {
      for (const viewport of viewports) {
        console.log(`  Testing viewport ${viewport.name} (${viewport.width}x${viewport.height})...`);

        const context = await browserInstance.newContext({
          viewport: { width: viewport.width, height: viewport.height }
        });

        const page = await context.newPage();

        // Test main page load
        const pageResult = { browser: browser.name, viewport: viewport.name, tests: {} };

        try {
          const mainPageStart = Date.now();
          await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
          pageResult.tests.mainPageLoad = {
            success: true,
            loadTime: Date.now() - mainPageStart,
          };

          // Test interactive elements
          await page.waitForSelector('.ai-demo-container', { state: 'visible' });
          await page.fill('textarea', 'Test prompt for AI');
          await page.click('button[type="submit"]');

          // Wait for result
          await page.waitForSelector('.result-container', { timeout: 10000 });
          pageResult.tests.aiInteraction = { success: true };

        } catch (error) {
          console.error(`    Error testing ${browser.name} at ${viewport.name}:`, error.message);
          if (!pageResult.tests.mainPageLoad) {
            pageResult.tests.mainPageLoad = { success: false, error: error.message };
          } else {
            pageResult.tests.aiInteraction = { success: false, error: error.message };
          }
        }

        results.push(pageResult);
        await context.close();
      }
    } finally {
      await browserInstance.close();
    }
  }

  // Output results
  console.log('\nBrowser Compatibility Test Results:');
  console.table(results.map(r => ({
    'Browser': r.browser,
    'Viewport': r.viewport,
    'Page Load': r.tests.mainPageLoad?.success ? '' : '',
    'Load Time': r.tests.mainPageLoad?.loadTime || 'N/A',
    'AI Interaction': r.tests.aiInteraction?.success ? '' : ''
  })));

  // Check for failures
  const failures = results.filter(r =>
    !r.tests.mainPageLoad?.success ||
    !r.tests.aiInteraction?.success
  );

  if (failures.length > 0) {
    console.error('\n Some tests failed!');
    process.exit(1);
  } else {
    console.log('\n All browser compatibility tests passed!');
  }
};

if (require.main === module) {
  runCompatibilityTests().catch(console.error);
}

module.exports = { runCompatibilityTests, browsers, viewports };
