// /workspace/frontend/src/pages/Home.tsx
import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Alert, AlertTitle, CircularProgress } from '@mui/material';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import PricingSection from '../components/PricingSection';
import FAQ from '../components/FAQ';
import CTA from '../components/CTA';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import { fetchHomePageData } from '../services/api';
import '../styles/global.css';
import ErrorBoundary from '../components/common/ErrorBoundary';
import LoadingFallback from '../components/common/LoadingFallback';
import SEO from '../components/common/SEO';

interface HomePageData {
  heroContent?: {
    title: string;
    subtitle: string;
    ctaText: string;
    imageUrl?: string;
  };
  features?: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    iconName?: string;
  }>;
  testimonials?: Array<{
    id: string;
    name: string;
    role?: string;
    company: string;
    content?: string;
    quote?: string;
    avatar?: string;
    avatarUrl?: string;
  }>;
  faq?: Array<{
    id: string;
    question: string;
    answer: string;
  }>;
  pricingPlans?: Array<{
    id: string;
    name: string;
    price: number;
    billingCycle: string;
    features: string[];
    popular: boolean;
  }>;
  ctaSection?: {
    title: string;
    subtitle: string;
    buttonText: string;
  };
}

/**
 * Home page component
 * Aggregates all sections of the landing page
 */
const Home: React.FC = () => {
  const [pageData, setPageData] = useState<HomePageData>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    const loadPageData = async () => {
      try {
        setLoading(true);
        const data = await fetchHomePageData();
        setPageData(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load page data:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadPageData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading amazing content...</Typography>
      </Box>
    );
  }

  if (error || validationError) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          <AlertTitle>Oops! Something went wrong</AlertTitle>
          {error || validationError}
        </Alert>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <SEO
        title="GenAI Platform - Transform Your Business with AI"
        description="Our GenAI platform helps businesses leverage artificial intelligence to automate tasks, gain insights, and improve productivity."
        keywords="AI, artificial intelligence, generative AI, machine learning, business automation"
        ogImage="/images/og-home.png"
        ogUrl="https://genai-platform.com"
      />
      
      <div className="home-page">
        <Header />
        <Box component="main">
          <ErrorBoundary>
            {/* Hero Section */}
            <Hero
              title={pageData.heroContent?.title || "AI-Powered Solutions for Modern Businesses"}
              subtitle={pageData.heroContent?.subtitle || "Transform your workflow with our cutting-edge AI tools"}
              ctaText={pageData.heroContent?.ctaText || "Get Started"}
            />
          </ErrorBoundary>

          <ErrorBoundary>
            {/* Features Section */}
            <Features features={pageData.features || []} />
          </ErrorBoundary>

          <ErrorBoundary>
            {/* Pricing Section */}
            <PricingSection plans={pageData.pricingPlans || []} />
          </ErrorBoundary>

          <ErrorBoundary>
            {/* Testimonials Section */}
            <Testimonials testimonials={pageData.testimonials || []} />
          </ErrorBoundary>

          <ErrorBoundary>
            {/* FAQ Section */}
            <FAQ faqs={pageData.faq || []} />
          </ErrorBoundary>

          <ErrorBoundary>
            {/* Contact Form */}
            <ContactForm />
          </ErrorBoundary>
          
          <ErrorBoundary>
            {/* CTA Section */}
            <CTA
              title={pageData.ctaSection?.title || "Ready to transform your business?"}
              subtitle={pageData.ctaSection?.subtitle || "Join thousands of satisfied customers today."}
              buttonText={pageData.ctaSection?.buttonText || "Start Free Trial"}
            />
          </ErrorBoundary>
        </Box>
        <Footer />
      </div>
    </>
  );
};

export default Home;
