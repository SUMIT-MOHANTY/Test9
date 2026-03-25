import axios, { AxiosError, AxiosResponse } from 'axios';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enables sending cookies with requests
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
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

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
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

        return api(config);
      }
    }

    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      // Clear any stored authentication
      localStorage.removeItem('user');

      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Helper function to extract CSRF token from cookies
function getCsrfToken(): string | null {
  const match = document.cookie.match(/(^|;)\s*csrftoken=([^;]+)/);
  return match ? match[2] : null;
}

// Type-safe API methods
export const fetchData = async <T>(url: string): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api.get(url);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const postData = async <T>(url: string, data: any): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api.post(url, data);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Enhanced error handling
const handleApiError = (error: any): void => {
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
};

export default api;
