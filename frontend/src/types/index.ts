// Common interfaces used across the application

/**
 * Contact form data interface
 */
export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
}

/**
 * API response interface
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Feature interface for feature section
 */
export interface Feature {
  id: number;
  title: string;
  description: string;
  icon: string;
}

/**
 * Navigation item interface
 */
export interface NavItem {
  label: string;
  path: string;
  external?: boolean;
}
