import React from 'react';
import '../styles/components.css';
import { FeatureSectionProps } from '../types';

interface Feature {
  id: string;
  title: string;
  description: string;
  iconName?: string;
  icon?: string;
}

const FeatureSection: React.FC<FeatureSectionProps> = ({
  title = "GenAI Features",
  features = [],
  isLoading = false,
  error = null
}) => {
  // Fallback empty state when no features are provided
  const emptyStateMessage = "No features available at the moment.";
  
  // Default features when none are provided
  const defaultFeatures: Feature[] = [
    {
      id: "feature-1",
      title: "Text Generation",
      description: "Create human-like text for various applications including content writing, summarization, and translation.",
      iconName: "text-generation"
    },
    {
      id: "feature-2",
      title: "Image Creation",
      description: "Transform text prompts into stunning visuals with our advanced image generation AI.",
      iconName: "image-creation"
    },
    {
      id: "feature-3",
      title: "Code Assistance",
      description: "Get help writing, debugging, and optimizing code across multiple programming languages.",
      iconName: "code-assist"
    },
    {
      id: "feature-4",
      title: "Voice Synthesis",
      description: "Convert text to natural-sounding speech in multiple languages and voices.",
      iconName: "voice-synthesis"
    },
  ];

  const displayFeatures = features.length > 0 ? features : defaultFeatures;

  return (
    <section id="features" className="feature-section" aria-labelledby="features-heading">
      <div className="container">
        <h2 id="features-heading" className="section-title">{title}</h2>
        <p className="section-subtitle">Powerful tools to enhance your creativity and productivity</p>

        {isLoading && (
          <div className="loading-state">
            <p>Loading features...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <p>Error loading features: {error}</p>
          </div>
        )}

        {!isLoading && !error && features.length === 0 && defaultFeatures.length === 0 && (
          <div className="empty-state">
            <p>{emptyStateMessage}</p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="features-grid">
            {displayFeatures.map((feature) => (
              <div
                key={feature.id}
                className="feature-card"
                id={`feature-${feature.id}`}
              >
                <div className="feature-icon" aria-hidden="true">
                  {feature.icon && <img src={feature.icon} alt={`${feature.title} icon`} />}
                  {feature.iconName && <span className={`icon icon-${feature.iconName}`}></span>}
                  {!feature.icon && !feature.iconName && <span className="icon-placeholder"></span>}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeatureSection;
