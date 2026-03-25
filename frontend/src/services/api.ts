import axios from 'axios';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Types for our API responses
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
  quote: string;
  avatar: string;
}

export interface ContactForm {
  name: string;
  email: string;
  company?: string;
  message: string;
}

// API service implementation
const apiService = {
  /**
   * Get all features
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
   * Submit contact form
   */
  submitContactForm: async (formData: ContactForm): Promise<string> => {
    try {
      // Validate required fields
      const requiredFields = ['name', 'email', 'message'];
      for (const field of requiredFields) {
        if (!formData[field as keyof ContactForm]) {
          throw new Error(`${field} is required`);
        }
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      const response = await apiClient.post<ApiResponse<null>>('/contact', formData);
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to submit form');
      }

      return response.data.message || 'Form submitted successfully';
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        // Client-side validation error
        throw new Error(error.response.data.error || 'Invalid form data');
      } else if (axios.isAxiosError(error) && !error.response) {
        // Network error
        throw new Error('Network error. Please check your connection and try again.');
      }
      console.error('Error submitting contact form:', error);
      throw error;
    }
  },

  /**
   * Health check endpoint
   */
  checkHealth: async (): Promise<boolean> => {
    try {
      const response = await apiClient.get('/health');
      return response.status === 200;
    } catch (error) {
      console.error('API health check failed:', error);
      return false;
    }
  }
};

export default apiService;
