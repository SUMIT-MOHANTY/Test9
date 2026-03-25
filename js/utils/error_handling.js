/**
 * GenAI Landing Page Error Handling Utilities
 * Provides robust error handling for frontend components
 */

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  // Send error to monitoring service if available
});

// Form validation error handling
const handleFormError = (formElement, error) => {
  const errorElement = document.createElement('div');
  errorElement.className = 'form-error';
  errorElement.textContent = error.message || 'An error occurred. Please try again.';

  // Remove any existing error messages
  const existingErrors = formElement.querySelectorAll('.form-error');
  existingErrors.forEach(el => el.remove());

  // Add the error message to the form
  formElement.appendChild(errorElement);

  // Log the error for debugging
  console.error('Form validation error:', error);
};

// API request error handling
const handleApiError = async (response) => {
  if (!response.ok) {
    // Try to parse error message from response
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.status}`);
    } catch (e) {
      throw new Error(`API error: ${response.status}`);
    }
  }
  return response.json();
};

// Graceful fallback for image loading errors
const handleImageError = (imgElement) => {
  imgElement.onerror = () => {
    imgElement.src = '/images/placeholder.svg';
    imgElement.alt = 'Image could not be loaded';
    imgElement.classList.add('image-load-error');
  };
};

export { handleFormError, handleApiError, handleImageError };
