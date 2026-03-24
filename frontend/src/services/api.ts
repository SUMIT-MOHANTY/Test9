import { AxiosError } from 'axios';

// Define API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Interface for contact form data
interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
}

/**
 * Sends contact form data to the backend API
 * @param formData The contact form data
 * @returns Promise with the response data
 */
export const sendContactForm = async (formData: ContactFormData): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send contact form');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Fetches general information about the API
 * @returns Promise with the API information
 */
export const getApiInfo = async (): Promise<any> => {
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
};

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
