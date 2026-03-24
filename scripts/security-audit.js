/**
 * Basic security audit script for the application
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

console.log(`${colors.blue}Starting security audit...${colors.reset}\n`);

// Check for .env files
try {
  console.log(`${colors.blue}Checking for environment files...${colors.reset}`);
  if (fs.existsSync('.env')) {
    console.log(`${colors.yellow}Warning: .env file found in project root. Ensure it's not committed to version control.${colors.reset}`);
  } else {
    console.log(`${colors.green}No .env file found in project root. Good.${colors.reset}`);
  }
} catch (error) {
  console.error(`${colors.red}Error checking for .env files: ${error.message}${colors.reset}`);
}

// Check for package vulnerabilities
try {
  console.log(`\n${colors.blue}Running npm audit...${colors.reset}`);
  console.log('This may take a moment...');
  const auditOutput = execSync('npm audit --json', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });

  const auditData = JSON.parse(auditOutput);
  const vulnerabilities = auditData.metadata.vulnerabilities;

  if (vulnerabilities.critical > 0 || vulnerabilities.high > 0) {
    console.log(`${colors.red}Found vulnerabilities: ${vulnerabilities.critical} critical, ${vulnerabilities.high} high${colors.reset}`);
    console.log(`Run 'npm audit fix' to attempt to fix these issues.`);
  } else if (vulnerabilities.moderate > 0 || vulnerabilities.low > 0) {
    console.log(`${colors.yellow}Found ${vulnerabilities.moderate} moderate and ${vulnerabilities.low} low severity vulnerabilities${colors.reset}`);
  } else {
    console.log(`${colors.green}No vulnerabilities found. Great!${colors.reset}`);
  }
} catch (error) {
  console.error(`${colors.red}Error running npm audit: ${error.message}${colors.reset}`);
}

// Check for common security issues in source code
try {
  console.log(`\n${colors.blue}Scanning source code for security issues...${colors.reset}`);

  const issues = [];
  const directories = ['./frontend/src', './backend'];

  // Simple patterns to check for
  const patterns = {
    hardcodedSecrets: /['"`](api|jwt|token|secret|password|key|auth)[^'"`]+['"`]/gi,
    dangerousEval: /eval\s*\(/g,
    dangerousInnerHTML: /dangerouslySetInnerHTML/g,
    insecureLocalStorage: /localStorage\.(get|set)Item\(\s*['"`](token|auth|jwt|password|secret)/gi
  };

  // Recursive file scanning
  const scanDirectory = (dir) => {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        scanDirectory(filePath);
      } else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
        const content = fs.readFileSync(filePath, 'utf8');

        // Check patterns
        Object.entries(patterns).forEach(([type, pattern]) => {
          const matches = content.match(pattern);
          if (matches) {
            issues.push({
              file: filePath,
              type,
              matches: matches.length
            });
          }
        });
      }
    });
  };

  directories.forEach(dir => {
    if (fs.existsSync(dir)) {
      scanDirectory(dir);
    }
  });

  if (issues.length > 0) {
    console.log(`${colors.yellow}Found ${issues.length} potential security issues:${colors.reset}`);
    issues.forEach(issue => {
      console.log(`- ${issue.file}: ${issue.matches} potential ${issue.type} issue(s)`);
    });
  } else {
    console.log(`${colors.green}No common security issues found in source code.${colors.reset}`);
  }
} catch (error) {
  console.error(`${colors.red}Error scanning source code: ${error.message}${colors.reset}`);
}

console.log(`\n${colors.blue}Security audit complete.${colors.reset}`);
