import React, { useState, useEffect } from 'react';
import ErrorBoundary from '../components/common/ErrorBoundary';
import LoadingFallback from '../components/common/LoadingFallback';
import SEO from '../components/common/SEO';
import { useFetch } from '../hooks/useFetch';
import { isValidApiResponse, validators } from '../utils/validation';

// Define types for our data
interface HeroSection {
  title: string;
  subtitle: string;
  ctaText: string;
  imageUrl: string;
}

interface FeatureItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

interface TestimonialItem {
  id: string;
  name: string;
  company: string;
  quote: string;
  avatarUrl: string;
}

interface HomePageData {
  hero: HeroSection;
  features: FeatureItem[];
  testimonials: TestimonialItem[];
}

// Validate our data structure
const isValidHomePageData = (data: any): data is HomePageData => {
  if (!data || typeof data !== 'object') return false;

  // Check hero section
  if (!data.hero || typeof data.hero !== 'object') return false;
  if (typeof data.hero.title !== 'string' || typeof data.hero.subtitle !== 'string') return false;
  if (typeof data.hero.ctaText !== 'string') return false;

  // Check features array
  if (!Array.isArray(data.features)) return false;
  for (const feature of data.features) {
    if (!feature.id || !feature.title || !feature.description) return false;
  }

  // Check testimonials array
  if (!Array.isArray(data.testimonials)) return false;
  for (const testimonial of data.testimonials) {
    if (!testimonial.id || !testimonial.name || !testimonial.quote) return false;
  }

  return true;
};

const Home: React.FC = () => {
  // Fetch home page data with proper error handling and loading states
  const [{ data, loading, error }, refetch] = useFetch<HomePageData>('/api/home');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Validate data when it arrives
  useEffect(() => {
    if (data) {
      if (!isValidHomePageData(data)) {
        setValidationError('Received invalid data structure from API');
      } else {
        setValidationError(null);
      }
    }
  }, [data]);

  // Error handling fallback
  if (error || validationError) {
    return (
      <div className="error-container">
        <h2>Something went wrong</h2>
        <p>{error?.message || validationError || 'Unknown error'}</p>
        <button
          onClick={() => refetch()}
          className="btn btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Loading state
  if (loading || !data) {
    return <LoadingFallback message="Loading home page content..." />;
  }

  // Render the actual content once we have valid data
  const { hero, features, testimonials } = data;

  return (
    <>
      <SEO
        title="GenAI Platform - Transform Your Business with AI"
        description="Our GenAI platform helps businesses leverage artificial intelligence to automate tasks, gain insights, and improve productivity."
        keywords="AI, artificial intelligence, generative AI, machine learning, business automation"
        ogImage="/images/og-home.png"
        ogUrl="https://genai-platform.com"
      />

      <main className="home-page">
        {/* Hero Section */}
        <ErrorBoundary>
          <section className="hero-section">
            <div className="container">
              <div className="hero-content">
                <h1>{hero.title}</h1>
                <p className="hero-subtitle">{hero.subtitle}</p>
                <button className="cta-button">{hero.ctaText}</button>
              </div>
              <div className="hero-image">
                {hero.imageUrl && (
                  <img
                    src={hero.imageUrl}
                    alt="GenAI Platform Hero"
                    loading="eager"
                    width="500"
                    height="400"
                  />
                )}
              </div>
            </div>
          </section>
        </ErrorBoundary>

        {/* Features Section */}
        <ErrorBoundary>
          <section className="features-section">
            <div className="container">
              <h2 className="section-title">Our Features</h2>
              <div className="features-grid">
                {features.map((feature) => (
                  <div key={feature.id} className="feature-card">
                    <div className="feature-icon">
                      {/* Safe rendering of icon */}
                      <i className={`icon ${feature.iconName}`}></i>
                    </div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ErrorBoundary>

        {/* Testimonials Section */}
        <ErrorBoundary>
          <section className="testimonials-section">
            <div className="container">
              <h2 className="section-title">What Our Clients Say</h2>
              <div className="testimonials-slider">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="testimonial-card">
                    <blockquote>"{testimonial.quote}"</blockquote>
                    <div className="testimonial-author">
                      {testimonial.avatarUrl && (
                        <img
                          src={testimonial.avatarUrl}
                          alt={testimonial.name}
                          width="60"
                          height="60"
                          loading="lazy"
                          className="avatar"
                        />
                      )}
                      <div>
                        <p className="author-name">{testimonial.name}</p>
                        <p className="author-company">{testimonial.company}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ErrorBoundary>
      </main>
    </>
  );
};

export default Home;
