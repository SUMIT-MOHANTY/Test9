import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import Pricing from '../components/Pricing';
import FAQ from '../components/FAQ';
import ContactForm from '../components/ContactForm';
import { fetchDynamicContent } from '../services/api';

interface DynamicContent {
  heroHeadline?: string;
  heroSubheadline?: string;
  featuresData?: any[];
  testimonialsData?: any[];
  pricingPlans?: any[];
  faqItems?: any[];
}

const Home: React.FC = () => {
  const [dynamicContent, setDynamicContent] = useState<DynamicContent>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDynamicContent = async () => {
      try {
        setIsLoading(true);
        const content = await fetchDynamicContent();
        setDynamicContent(content);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch dynamic content:', err);
        setError('Failed to load content. Please refresh the page.');
        setIsLoading(false);
      }
    };

    loadDynamicContent();
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading amazing content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="home-page">
      <Hero
        headline={dynamicContent.heroHeadline}
        subheadline={dynamicContent.heroSubheadline}
      />

      <Features featuresData={dynamicContent.featuresData} />

      <Testimonials testimonialsData={dynamicContent.testimonialsData} />

      <Pricing pricingPlans={dynamicContent.pricingPlans} />

      <FAQ faqItems={dynamicContent.faqItems} />

      <ContactForm />
    </div>
  );
};

export default Home;
