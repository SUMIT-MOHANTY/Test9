import { handleApiError, logError } from '../utils/errorHandling';

const API_URL = process.env.REACT_APP_API_URL || '';

/**
 * API Service for handling all backend requests
 */
export default class ApiService {
  /**
   * Submit contact form with retry capability
   */
  static async submitContactForm(formData, retries = 2) {
    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add CSRF token if using CSRF protection
          // 'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(formData),
        credentials: 'include' // Include cookies for CSRF
      });

      return await handleApiError(response);
    } catch (error) {
      if (retries > 0) {
        // Wait for a second before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
        return ApiService.submitContactForm(formData, retries - 1);
      }

      logError(error, { action: 'submitContactForm', data: formData });
      throw error;
    }
  }

  /**
   * Get features list with caching
   */
  static async getFeatures() {
    // Try to get from session storage cache first
    const cachedFeatures = sessionStorage.getItem('features_cache');
    const cacheTime = sessionStorage.getItem('features_cache_time');

    // Use cache if it's less than 5 minutes old
    if (cachedFeatures && cacheTime) {
      const now = new Date().getTime();
      if (now - parseInt(cacheTime) < 5 * 60 * 1000) {
        try {
          return JSON.parse(cachedFeatures);
        } catch (e) {
          // If parse fails, continue to fetch fresh data
          console.warn('Cache parse failed');
        }
      }
    }

    try {
      const response = await fetch(`${API_URL}/api/features`);
      const data = await handleApiError(response);

      // Cache the result
      sessionStorage.setItem('features_cache', JSON.stringify(data));
      sessionStorage.setItem('features_cache_time', new Date().getTime());

      return data;
    } catch (error) {
      logError(error, { action: 'getFeatures' });
      throw error;
    }
  }
}
