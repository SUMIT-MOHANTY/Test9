/**
 * Final validation script for the GenAI landing page
 * Runs all tests and generates a validation report
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function runCommand(command, args, options = {}) {
  console.log(`\n> ${command} ${args.join(' ')}`);

  const result = spawnSync(command, args, {
    stdio: 'inherit',
    ...options,
  });

  return result.status === 0;
}

async function validateProject() {
  console.log('=== GenAI Landing Page Final Validation ===');
  const results = {};
  const startTime = Date.now();

  // Check if frontend and backend are running
  console.log('\n Checking if services are running...');
  try {
    const frontendResponse = await fetch('http://localhost:3000');
    results.frontendRunning = frontendResponse.ok;
    console.log(` Frontend is ${results.frontendRunning ? 'running' : 'not running'}`);
  } catch (e) {
    results.frontendRunning = false;
    console.log(' Frontend is not running');
  }

  try {
    const backendResponse = await fetch('http://localhost:5000/api/health');
    results.backendRunning = backendResponse.ok;
    console.log(` Backend is ${results.backendRunning ? 'running' : 'not running'}`);
  } catch (e) {
    results.backendRunning = false;
    console.log(' Backend is not running');
  }

  if (!results.frontendRunning || !results.backendRunning) {
    console.log('\n Please start both frontend and backend services before running validation.');
    return false;
  }

  // Run linting
  console.log('\n Running linting checks...');
  results.lintingPassed = await runCommand('npm', ['run', 'lint']);

  // Run unit tests
  console.log('\n Running unit tests...');
  results.unitTestsPassed = await runCommand('npm', ['test']);

  // Run browser compatibility tests
  console.log('\n Running browser compatibility tests...');
  results.compatibilityTestsPassed = await runCommand('node', ['tests/browser-compatibility.js']);

  // Run accessibility tests
  console.log('\n Running accessibility tests...');
  results.accessibilityTestsPassed = await runCommand('node', ['tests/accessibility-check.js']);

  // Run performance tests
  console.log('\n Running performance tests...');
  results.performanceTestsPassed = await runCommand('node', ['tests/performance-check.js']);

  // Generate summary report
  const elapsedTime = (Date.now() - startTime) / 1000;

  console.log(`\n=== Validation Report (completed in ${elapsedTime.toFixed(1)}s) ===`);

  const allPassed = Object.values(results).every(Boolean);

  console.table({
    'Frontend Running': results.frontendRunning ? ' Pass' : ' Fail',
    'Backend Running': results.backendRunning ? ' Pass' : ' Fail',
    'Linting': results.lintingPassed ? ' Pass' : ' Fail',
    'Unit Tests': results.unitTestsPassed ? ' Pass' : ' Fail',
    'Browser Compatibility': results.compatibilityTestsPassed ? ' Pass' : ' Fail',
    'Accessibility': results.accessibilityTestsPassed ? ' Pass' : ' Fail',
    'Performance': results.performanceTestsPassed ? ' Pass' : ' Fail',
    'Overall Result': allPassed ? ' PASS' : ' FAIL',
  });

  if (allPassed) {
    console.log('\n SUCCESS: The GenAI landing page has passed all validation checks!');
    console.log('The site is ready for production deployment.');
  } else {
    console.log('\n FAILED: Some validation checks have failed.');
    console.log('Please fix the issues before proceeding to deployment.');
  }

  return allPassed;
}

if (require.main === module) {
  validateProject().then(passed => {
    process.exit(passed ? 0 : 1);
  });
}

module.exports = { validateProject };
