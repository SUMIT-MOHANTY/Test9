import React, { useEffect, useState } from 'react';
import { FeatureSectionProps, Feature } from '../types';

const FeatureSection: React.FC<FeatureSectionProps> = ({
  title,
  features = [],
  isLoading = false,
  error = null
}) => {
  // Fallback empty state when no features are provided
  const emptyStateMessage = "No features available at the moment.";

  return (
    <section id="features" className="feature-section">
      <div className="container">
        <h2 className="section-title">{title}</h2>

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

        {!isLoading && !error && features.length === 0 && (
          <div className="empty-state">
            <p>{emptyStateMessage}</p>
          </div>
        )}

        {!isLoading && !error && features.length > 0 && (
          <div className="features-grid">
            {features.map((feature) => (
              <div key={feature.id} className="feature-card">
                <div className="feature-icon">
                  <img src={feature.icon} alt={`${feature.title} icon`} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeatureSection;
