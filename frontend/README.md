# GenAI Landing Page Frontend

This is the frontend application for GenAI Landing Page, built with React and TypeScript.

## Security Features

- Strict Content Security Policy
- XSS prevention with DOMPurify
- CSRF protection
- Secure HTTP headers
- Error boundaries for resilience
- Input sanitization
- Strict TypeScript configuration
- Regular dependency updates

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env` and configure your environment variables
3. Install dependencies: `npm install`
4. Run the development server: `npm start`

## Security Best Practices

- Never store sensitive data in localStorage or sessionStorage
- Always sanitize user input
- Use HTTPS in all environments
- Keep dependencies updated
- Run security scans regularly: `npm run security-check`
- Follow the principle of least privilege

## Production Deployment

Before deploying to production:

1. Run a security audit: `npm audit`
2. Run type checking: `npm run typecheck`
3. Run linting: `npm run lint`
4. Build the production bundle: `npm run build`
5. Test the production build locally before deployment

## License

Copyright  GenAI Landing Page. All rights reserved.
