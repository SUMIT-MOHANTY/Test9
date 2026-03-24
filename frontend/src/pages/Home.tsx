import React from 'react';
import Hero from '../components/Hero';
import FeatureSection from '../components/FeatureSection';
import AboutAI from '../components/AboutAI';
import ContactForm from '../components/ContactForm';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <Hero />
      <FeatureSection />
      <AboutAI />
      <ContactForm />
    </div>
  );
};

export default Home;
