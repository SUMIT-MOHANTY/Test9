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

/**
 * Home page component
 * Aggregates all sections of the landing page
 */
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

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          <AlertTitle>Oops! Something went wrong</AlertTitle>
          {error}
        </Alert>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </Box>
      </Container>
    );
  }

  return (
    <div className="home-page">
      <Header />
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

        {/* Contact Form */}
        <ContactForm />
        
        {/* CTA Section */}
        <CTA
          title={pageData.ctaSection?.title || "Ready to transform your business?"}
          subtitle={pageData.ctaSection?.subtitle || "Join thousands of satisfied customers today."}
          buttonText={pageData.ctaSection?.buttonText || "Start Free Trial"}
        />
      </Box>
      <Footer />
    </div>
  );
};

export default Home;
