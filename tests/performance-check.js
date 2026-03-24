// Performance testing using Lighthouse

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const { writeFileSync } = require('fs');
const { join } = require('path');

async function runLighthouseTest() {
  console.log('Starting Lighthouse performance test...');

  // Launch Chrome
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox']
  });

  // Run Lighthouse
  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
    emulatedFormFactor: 'mobile',
  };

  const url = 'http://localhost:3000';
  console.log(`Testing URL: ${url}`);

  try {
    const runnerResult = await lighthouse(url, options);

    // Save report to disk
    const reportHtml = runnerResult.report;
    const outPath = join(process.cwd(), 'lighthouse-report.html');
    writeFileSync(outPath, reportHtml);
    console.log(`Lighthouse report saved to: ${outPath}`);

    // Output results summary
    console.log('\nLighthouse Score Summary:');
    const scores = Object.entries(runnerResult.lhr.categories)
      .map(([key, category]) => ({
        category: category.title,
        score: Math.round(category.score * 100)
      }));

    console.table(scores);

    // Check for critical issues
    const auditResults = runnerResult.lhr.audits;
    const criticalIssues = Object.values(auditResults)
      .filter(audit =>
        audit.score !== null &&
        audit.score < 0.5 &&
        audit.weight >= 3
      );

    if (criticalIssues.length > 0) {
      console.log('\nCritical Performance Issues:');
      criticalIssues.forEach(issue => {
        console.log(` ${issue.title} - Score: ${issue.score * 100}/100`);
        console.log(`   ${issue.description}`);
      });
    }

    // Return success if all scores are above 80
    const allGoodScores = scores.every(s => s.score >= 80);
    if (allGoodScores) {
      console.log(' All Lighthouse scores are above 80/100!');
    } else {
      console.log(' Some Lighthouse scores are below 80/100.');
    }

    return allGoodScores;
  } catch (error) {
    console.error('Error running Lighthouse:', error);
    return false;
  } finally {
    // Close Chrome
    await chrome.kill();
  }
}

if (require.main === module) {
  runLighthouseTest().then(passed => {
    process.exit(passed ? 0 : 1);
  });
}

module.exports = { runLighthouseTest };
