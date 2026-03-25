/**
 * Accessibility utilities for GenAI Landing Page
 * Helps identify and fix common accessibility issues
 */

// Check for missing alt attributes on images
const checkImageAlt = () => {
  const images = document.querySelectorAll('img');
  const issuesFound = [];

  images.forEach((img, index) => {
    if (!img.hasAttribute('alt')) {
      console.warn(`Accessibility issue: Image #${index} missing alt attribute:`, img);
      issuesFound.push({
        element: img,
        issue: 'Missing alt attribute'
      });
    }
  });

  return {
    passed: issuesFound.length === 0,
    issues: issuesFound
  };
};

// Check for proper heading structure
const checkHeadingStructure = () => {
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const headingLevels = Array.from(headings).map(h => parseInt(h.tagName.charAt(1)));
  const issuesFound = [];

  // Check if there's exactly one h1
  const h1Count = headingLevels.filter(level => level === 1).length;
  if (h1Count !== 1) {
    console.warn(`Accessibility issue: Found ${h1Count} h1 elements, should be exactly 1`);
    issuesFound.push({
      issue: `Found ${h1Count} h1 elements, should be exactly 1`
    });
  }

  // Check for skipped heading levels
  let previousLevel = 1;
  headingLevels.forEach((level, index) => {
    if (level > previousLevel + 1) {
      console.warn(`Accessibility issue: Skipped heading level at heading #${index + 1}`);
      issuesFound.push({
        element: headings[index],
        issue: `Skipped heading level: h${previousLevel} to h${level}`
      });
    }
    previousLevel = level;
  });

  return {
    passed: issuesFound.length === 0,
    issues: issuesFound
  };
};

// Check for sufficient color contrast
const checkColorContrast = () => {
  console.log('Note: Automated color contrast checking requires additional libraries');
  console.log('Consider using axe-core for comprehensive accessibility testing');

  return {
    passed: null,
    message: 'Manual check required for color contrast'
  };
};

// Run all accessibility checks
const runAccessibilityChecks = () => {
  const results = {
    imageAlt: checkImageAlt(),
    headingStructure: checkHeadingStructure(),
    colorContrast: checkColorContrast()
  };

  console.log('Accessibility check results:', results);
  return results;
};

export { runAccessibilityChecks, checkImageAlt, checkHeadingStructure, checkColorContrast };
