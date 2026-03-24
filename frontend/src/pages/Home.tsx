// /workspace/frontend/src/pages/Home.tsx
import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import FeatureSection from '../components/FeatureSection';
import AboutAI from '../components/AboutAI';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import '../styles/global.css';

/**
 * Home page component
 * Aggregates all sections of the landing page
 */
const Home: React.FC = () => {
  return (
    <div className="home-page">
      <Header />
      <main>
        <Hero />
        <FeatureSection />
        <AboutAI />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
