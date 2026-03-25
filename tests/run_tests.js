// Test Runner
const uiTests = require('./frontend/ui_tests');
const componentTests = require('./frontend/component_tests');
const apiTests = require('./backend/api_tests');
const e2eTests = require('./integration/end_to_end_tests');

console.log("=== Running GenAI Landing Page Tests ===");

// Run UI tests
console.log("\n=== UI Tests ===");
uiTests.testResponsiveness();
uiTests.testAccessibility();
uiTests.testAnimations();

// Run component tests
console.log("\n=== Component Tests ===");
componentTests.testHeroSection();
componentTests.testFeatureSection();
componentTests.testContactForm();
componentTests.testNavigation();

// Run API tests
console.log("\n=== API Tests ===");
apiTests.testContactFormEndpoint();
apiTests.testNewsletterEndpoint();
apiTests.testErrorHandling();

// Run end-to-end tests
console.log("\n=== End-to-End Tests ===");
e2eTests.testUserJourney();
e2eTests.testLoadPerformance();

console.log("\n=== All tests completed ===");
