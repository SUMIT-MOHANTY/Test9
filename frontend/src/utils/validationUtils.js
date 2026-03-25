/**
 * Validation utility functions for the GenAI landing page
 * Provides client-side validation for forms and inputs
 */

/**
 * Validates email format
 * @param {string} email - The email to validate
 * @returns {boolean} Whether the email is valid
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates that a string is not empty
 * @param {string} value - The value to validate
 * @returns {boolean} Whether the value is not empty
 */
export const isNotEmpty = (value) => {
  return value !== null && value !== undefined && value.trim() !== '';
};

/**
 * Validates that a string meets minimum length requirements
 * @param {string} value - The value to validate
 * @param {number} minLength - The minimum length required
 * @returns {boolean} Whether the value meets the minimum length
 */
export const meetsMinLength = (value, minLength) => {
  if (!value) return false;
  return value.length >= minLength;
};

/**
 * Validates form fields and returns errors
 * @param {Object} formData - The form data to validate
 * @param {Object} validationRules - The validation rules to apply
 * @returns {Object} Object containing validation errors if any
 */
export const validateForm = (formData, validationRules) => {
  const errors = {};

  Object.keys(validationRules).forEach(field => {
    const rules = validationRules[field];

    if (rules.required && !isNotEmpty(formData[field])) {
      errors[field] = `${field} is required`;
    } else if (rules.email && !isValidEmail(formData[field])) {
      errors[field] = `${field} must be a valid email`;
    } else if (rules.minLength && !meetsMinLength(formData[field], rules.minLength)) {
      errors[field] = `${field} must be at least ${rules.minLength} characters`;
    }
  });

  return errors;
};
