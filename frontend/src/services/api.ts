/**
 * API Service for making requests to the backend
 */
import axios from 'axios';
import { AxiosError } from 'axios';

// Define API base URL
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-production-domain.com/api'
  : process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configure axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for handling common request tasks
apiClient.interceptors.request.use(
  (config) => {
    // Add authorization token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common response tasks
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle expired tokens or authentication issues
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('authToken');
    }

    // Create a more user-friendly error message
    const errorMessage = error.response?.data?.message ||
                         error.message ||
                         'An unexpected error occurred';

    // Create a custom error object with additional information
    const customError = new Error(errorMessage);
    customError.name = error.name;
    customError.stack = error.stack;
    customError.response = error.response;

    return Promise.reject(customError);
  }
);

// Common interface for API responses
export interface ApiResponse<T> {
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
  comment?: string;
  avatar: string;
}

export interface PricingPlan {
  id: number;
  name: string;
  price: number | string;
  period?: string;
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
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Generic error handler for API requests
 * @param error The error object
 * @returns Formatted error message
 */
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
};

/**
 * Function to fetch home page data from the API
 */
export const fetchHomePageData = async () => {
  try {
    const response = await apiClient.get('/content/home');
    return response.data;
  } catch (error) {
    // Use retry logic for network errors
    if (error.message === 'Network Error') {
      try {
        // Wait 2 seconds and retry once
        await new Promise(resolve => setTimeout(resolve, 2000));
        const response = await apiClient.get('/content/home');
        return response.data;
      } catch (retryError) {
        throw retryError;
      }
    }
    throw error;
  }
};

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

  /**
   * Subscribe to newsletter
   * @param email Email to subscribe
   * @returns Promise with subscription result
   */
  subscribeNewsletter: async (email: string): Promise<ApiResponse<null>> => {
    return apiRequest<null>('/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  /**
   * Fetches general information about the API
   * @returns Promise with the API information
   */
  getApiInfo: async (): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/hello`);

      if (!response.ok) {
        throw new Error('Failed to fetch API information');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};

export default apiClient;
