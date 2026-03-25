import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';
import { logError } from '../utils/errorHandling';

const Features = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchFeatures = async () => {
      try {
        const data = await ApiService.getFeatures();

        // Only update state if component is still mounted
        if (isMounted && data.features) {
          setFeatures(data.features);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load features. Please try again later.');
          logError(err, { component: 'Features' });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFeatures();

    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="features-loading" aria-live="polite">
        <div className="spinner"></div>
        <p>Loading features...</p>
      </div>
    );
  }

  // Show error state with retry button
  if (error) {
    return (
      <div className="features-error" role="alert">
        <p>{error}</p>
        <button
          onClick={() => {
            setLoading(true);
            setError(null);
            ApiService.getFeatures()
              .then(data => {
                setFeatures(data.features);
                setLoading(false);
              })
              .catch(err => {
                setError('Failed to load features. Please try again later.');
                setLoading(false);
              });
          }}
          className="btn btn-secondary"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Show features
  return (
    <div className="features-container">
      <h2>Our Features</h2>
      <div className="features-grid">
        {features.map(feature => (
          <div key={feature.id} className="feature-card">
            <div className="feature-icon">
              <img
                src={`/images/icons/${feature.icon}`}
                alt=""
                onError={(e) => {
                  e.target.src = '/images/icons/default-icon.svg';
                  logError(new Error('Feature icon not found'), { icon: feature.icon });
                }}
              />
            </div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
