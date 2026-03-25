import React, { useEffect, useState } from 'react';
import { api, Feature } from '../services/api';

const FeatureSection: React.FC = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch features when component mounts
    const fetchFeatures = async () => {
      try {
        setLoading(true);
        const data = await api.getFeatures();
        setFeatures(data);
        setError(null);
      } catch (err) {
        setError('Failed to load features. Please try again later.');
        console.error('Error fetching features:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  if (loading) {
    return <div className="loading">Loading features...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <section className="features-section">
      <h2>Our Features</h2>
      <div className="features-container">
        {features.length > 0 ? (
          features.map((feature) => (
            <div key={feature.id} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))
        ) : (
          <p>No features available.</p>
        )}
      </div>
    </section>
  );
};

export default FeatureSection;
