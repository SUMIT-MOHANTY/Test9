// Accessibility testing using Axe with Playwright

const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');

async function runAccessibilityTests() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto('http://localhost:3000');

    console.log('Running accessibility tests on the landing page...');
    const results = await new AxeBuilder({ page }).analyze();

    if (results.violations.length === 0) {
      console.log(' No accessibility violations found!');
    } else {
      console.error(` Found ${results.violations.length} accessibility violations:`);

      results.violations.forEach((violation, index) => {
        console.error(`\n${index + 1}) ${violation.help} (${violation.id})`);
        console.error(`   Impact: ${violation.impact}`);
        console.error(`   Description: ${violation.description}`);
        console.error(`   WCAG: ${violation.tags.filter(tag => tag.includes('wcag')).join(', ')}`);
        console.error('   Affected elements:');

        violation.nodes.forEach((node, nodeIdx) => {
          console.error(`     ${nodeIdx + 1}. ${node.html}`);
          if (node.failureSummary) {
            console.error(`        ${node.failureSummary.replace(/\n/g, '\n        ')}`);
          }
        });
      });

      // Group violations by WCAG guidelines
      const wcagViolations = {};
      results.violations.forEach(v => {
        v.tags.filter(tag => tag.includes('wcag')).forEach(tag => {
          wcagViolations[tag] = (wcagViolations[tag] || 0) + 1;
        });
      });

      console.error('\nWCAG Violations Summary:');
      Object.entries(wcagViolations)
        .sort(([, countA], [, countB]) => countB - countA)
        .forEach(([guideline, count]) => {
          console.error(`  ${guideline}: ${count} violations`);
        });

      return false;
    }

    return true;
  } catch (error) {
    console.error('Error running accessibility tests:', error);
    return false;
  } finally {
    await browser.close();
  }
}

if (require.main === module) {
  runAccessibilityTests().then(passed => {
    process.exit(passed ? 0 : 1);
  });
}

module.exports = { runAccessibilityTests };
