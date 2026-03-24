// /workspace/frontend/src/types/index.ts
/**
 * Centralized type definitions for the application
 */

// Re-export types from API service for convenience
export type { Feature, Testimonial, ContactInfo } from '../services/api';

// Additional app-specific types
export interface ErrorState {
  message: string;
  code?: number;
}

export interface LoadingState {
  isLoading: boolean;
  loadingMessage?: string;
}
