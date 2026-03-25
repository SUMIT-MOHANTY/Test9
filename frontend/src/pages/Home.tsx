import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Alert, AlertTitle, CircularProgress } from '@mui/material';
import Hero from '../components/Hero';
import Features from '../components/Features';
import PricingSection from '../components/PricingSection';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import CTA from '../components/CTA';
import { fetchHomePageData } from '../services/api';

interface HomePageData {
  heroContent?: {
    title: string;
    subtitle: string;
    ctaText: string;
  };
  features?: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
  }>;
  testimonials?: Array<{
    id: string;
    name: string;
    role: string;
    company: string;
    content: string;
    avatar: string;
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

const Home: React.FC = () => {
  const [pageData, setPageData] = useState<HomePageData>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPageData = async () => {
      try {
        setLoading(true);
        const data = await fetchHomePageData();
        setPageData(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load page data:', err);
        setError('Failed to load page content. Please try again later.');
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
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box component="main">
      {/* Hero Section */}
      <Hero
        title={pageData.heroContent?.title || "AI-Powered Solutions for Modern Businesses"}
        subtitle={pageData.heroContent?.subtitle || "Transform your workflow with our cutting-edge AI tools"}
        ctaText={pageData.heroContent?.ctaText || "Get Started"}
      />

      {/* Features Section */}
      <Features features={pageData.features || []} />

      {/* Pricing Section */}
      <PricingSection plans={pageData.pricingPlans || []} />

      {/* Testimonials Section */}
      <Testimonials testimonials={pageData.testimonials || []} />

      {/* FAQ Section */}
      <FAQ faqs={pageData.faq || []} />

      {/* CTA Section */}
      <CTA
        title={pageData.ctaSection?.title || "Ready to transform your business?"}
        subtitle={pageData.ctaSection?.subtitle || "Join thousands of satisfied customers today."}
        buttonText={pageData.ctaSection?.buttonText || "Start Free Trial"}
      />
    </Box>
  );
};

export default Home;
