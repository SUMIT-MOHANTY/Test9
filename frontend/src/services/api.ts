import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configure axios instance
const apiClient = axios.create({
  baseURL: API_URL,
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

// Function to fetch home page data from the API
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

// Additional API functions can be exported here

export default apiClient;
