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

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
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
