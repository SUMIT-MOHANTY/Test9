// Common interfaces for component props

/**
 * Centralized type definitions for the application
 */

// API Response Types
export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface UseCase {
  id: string;
  title: string;
  description: string;
  image_url: string;
}

export interface FeaturesResponse {
  features: Feature[];
}

export interface UseCasesResponse {
  use_cases: UseCase[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
}

export interface ContactInfo {
  // Re-exported from API service
}

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Component Props Types
export interface HeaderProps {
  title?: string;
}

export interface HeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  backgroundImage?: string;
}

export interface FeaturesProps {
  features: Feature[];
}

export interface FeatureSectionProps {
  title: string;
  features?: Feature[];
  isLoading?: boolean;
  error?: string | null;
}

export interface AboutAIProps {
  title: string;
  description: string;
  imageUrl?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: string;
  features: string[];
  popular: boolean;
}

export interface PricingSectionProps {
  plans: PricingPlan[];
}

export interface TestimonialsProps {
  testimonials: Testimonial[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQProps {
  faqs: FAQItem[];
}

export interface CTAProps {
  title: string;
  subtitle: string;
  buttonText: string;
}

export interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => Promise<void>;
  isSubmitting?: boolean;
  submitError?: string | null;
  submitSuccess?: boolean;
}

export interface FooterProps {
  companyName: string;
  year: number;
}

export interface NavItem {
  label: string;
  path: string;
  external?: boolean;
}

export interface ErrorState {
  message: string;
  code?: number;
}

export interface LoadingState {
  isLoading: boolean;
  loadingMessage?: string;
}
