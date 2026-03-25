/**
 * API Service for making requests to the backend
 */

// Define the base URL for API requests
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-production-domain.com/api'
  : 'http://localhost:5000/api';

// Common interface for API responses
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Type definitions for various API resources
export interface Feature {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  id: number;
  name: string;
  company: string;
  quote: string;
  avatar: string;
}

export interface PricingPlan {
  id: number;
  name: string;
  price: number;
  period: string;
  features: string[];
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  company?: string;
  phone?: string;
}

/**
 * Generic function for handling API requests
 * @param endpoint The API endpoint to call
 * @param options Request options (method, headers, body, etc.)
 * @returns Promise with the API response
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    // Set default headers if not provided
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Make the API request
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Parse the JSON response
    const data: ApiResponse<T> = await response.json();

    // Check if the response was successful
    if (!response.ok) {
      throw new Error(data.error || `HTTP error ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// API functions for different endpoints
export const api = {
  /**
   * Get all features
   * @returns Promise with features data
   */
  getFeatures: async (): Promise<Feature[]> => {
    const response = await apiRequest<Feature[]>('/features');
    return response.data || [];
  },

  /**
   * Get all testimonials
   * @returns Promise with testimonials data
   */
  getTestimonials: async (): Promise<Testimonial[]> => {
    const response = await apiRequest<Testimonial[]>('/testimonials');
    return response.data || [];
  },

  /**
   * Get pricing plans
   * @returns Promise with pricing data
   */
  getPricingPlans: async (): Promise<PricingPlan[]> => {
    const response = await apiRequest<PricingPlan[]>('/pricing');
    return response.data || [];
  },

  /**
   * Submit contact form
   * @param formData The contact form data
   * @returns Promise with submission result
   */
  submitContactForm: async (formData: ContactFormData): Promise<{ success: boolean; message?: string }> => {
    try {
      // Validate form data before submission
      if (!formData.name || !formData.email || !formData.message) {
        throw new Error('Please fill in all required fields');
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      const response = await apiRequest<{ message: string }>('/contact', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      return {
        success: true,
        message: response.message || 'Form submitted successfully',
      };
    } catch (error) {
      console.error('Contact form submission failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  },

  /**
   * Health check for the API
   * @returns Promise with health status
   */
  checkHealth: async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
      const data = await response.json();
      return data.status === 'healthy';
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  },
};

export default api;
