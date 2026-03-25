// Common interfaces for component props

export interface HeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface FeaturesProps {
  features: Feature[];
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

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
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
