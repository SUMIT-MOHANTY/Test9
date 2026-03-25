import DOMPurify from 'dompurify';

/**
 * Sanitize HTML to prevent XSS attacks
 */
export const sanitizeHTML = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel']
  });
};

/**
 * Validate and sanitize user input
 */
export const sanitizeInput = (input: string): string => {
  return input.trim();
};

/**
 * Encode data for URL parameters
 */
export const encodeURLParam = (param: string): string => {
  return encodeURIComponent(param);
};

/**
 * Security headers for fetch requests
 */
export const securityHeaders = {
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  'X-Content-Type-Options': 'nosniff',
};

/**
 * Validate CSRF token (to be implemented with backend)
 */
export const validateCSRFToken = (token: string): boolean => {
  // Implement validation logic
  return token !== undefined && token.length > 0;
};

/**
 * Secure storage wrapper
 */
export const secureStorage = {
  setItem: (key: string, value: string): void => {
    // Consider encryption for sensitive data in production
    localStorage.setItem(key, value);
  },

  getItem: (key: string): string | null => {
    return localStorage.getItem(key);
  },

  removeItem: (key: string): void => {
    localStorage.removeItem(key);
  },

  clear: (): void => {
    localStorage.clear();
  }
};
