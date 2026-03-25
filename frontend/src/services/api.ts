/**
 * API service for communicating with the backend
 */

// Base URL for API requests
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Types for API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

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
  comment: string;
  avatar: string;
}

export interface PricingPlan {
  id: number;
  name: string;
  price: string;
  features: string[];
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;

    // Set default headers for JSON
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `API request failed with status ${response.status}`);
    }

    return data as ApiResponse<T>;
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * API methods for the GenAI Landing Page
 */
const api = {
  /**
   * Fetch all features
   */
  getFeatures: async (): Promise<ApiResponse<Feature[]>> => {
    return fetchAPI<Feature[]>('/features');
  },

  /**
   * Fetch all testimonials
   */
  getTestimonials: async (): Promise<ApiResponse<Testimonial[]>> => {
    return fetchAPI<Testimonial[]>('/testimonials');
  },

  /**
   * Fetch pricing plans
   */
  getPricing: async (): Promise<ApiResponse<PricingPlan[]>> => {
    return fetchAPI<PricingPlan[]>('/pricing');
  },

  /**
   * Submit contact form
   */
  submitContactForm: async (formData: ContactFormData): Promise<ApiResponse<null>> => {
    return fetchAPI<null>('/contact', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
  },

  /**
   * Subscribe to newsletter
   */
  subscribeNewsletter: async (email: string): Promise<ApiResponse<null>> => {
    return fetchAPI<null>('/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }
};

export default api;
