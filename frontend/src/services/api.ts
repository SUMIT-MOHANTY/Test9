/**
 * API Service for making requests to the backend
 */
import axios, { AxiosError, AxiosResponse } from 'axios';

// Define API base URL
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-production-domain.com/api'
  : process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms

// Configure axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
  withCredentials: true, // Enables sending cookies with requests
});

// Request interceptor for handling common request tasks
apiClient.interceptors.request.use(
  (config) => {
    // Add authorization token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Get CSRF token from cookie if it exists
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
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
  async (error: AxiosError) => {
    const config = error.config;
    // Property doesn't exist on type 'AxiosRequestConfig', adding a custom property
    const customConfig = config as any;

    // Retry logic for network errors or 5xx responses
    if (
      (error.response?.status && error.response.status >= 500) ||
      error.code === 'ECONNABORTED' ||
      !error.response
    ) {
      if (!customConfig._retry || customConfig._retry < MAX_RETRIES) {
        customConfig._retry = (customConfig._retry || 0) + 1;

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));

        return apiClient(config);
      }
    }

    // Handle 401 Unauthorized - redirect to login
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');

      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
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

// Helper function to extract CSRF token from cookies
function getCsrfToken(): string | null {
  const match = document.cookie.match(/(^|;)\s*csrftoken=([^;]+)/);
  return match ? match[2] : null;
}

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

// Type-safe API methods
export const fetchData = async <T>(url: string): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient.get(url);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const postData = async <T>(url: string, data: any): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient.post(url, data);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Generic error handler for API requests
 * @param error The error object
 * @returns Formatted error message
 */
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    // Log different types of errors appropriately
    if (!axiosError.response) {
      console.error('Network Error:', axiosError.message);
    } else {
      console.error(`API Error ${axiosError.response.status}:`,
        axiosError.response.data);
    }
  } else {
    console.error('Unexpected Error:', error);
  }

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
    try {
      const response = await apiClient.get<ApiResponse<Feature[]>>('/features');
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Failed to fetch features');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching features:', error);
      throw error;
    }
  },

  /**
   * Get a specific feature by ID
   */
  getFeature: async (id: number): Promise<Feature> => {
    try {
      const response = await apiClient.get<ApiResponse<Feature>>(`/features/${id}`);
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Failed to fetch feature');
      }
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching feature ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get all testimonials
   * @returns Promise with testimonials data
   */
  getTestimonials: async (): Promise<Testimonial[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Testimonial[]>>('/testimonials');
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Failed to fetch testimonials');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      throw error;
    }
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

      const response = await apiClient.post<ApiResponse<null>>('/contact', formData);
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to submit form');
      }

      return {
        success: true,
        message: response.data.message || 'Form submitted successfully',
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        // Client-side validation error
        throw new Error(error.response.data.error || 'Invalid form data');
      } else if (axios.isAxiosError(error) && !error.response) {
        // Network error
        throw new Error('Network error. Please check your connection and try again.');
      }
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
      const response = await apiClient.get('/health');
      return response.status === 200;
    } catch (error) {
      console.error('API health check failed:', error);
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
