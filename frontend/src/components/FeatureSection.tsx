import React from 'react';

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: string;
}

const FeatureSection: React.FC = () => {
  const features: Feature[] = [
    {
      id: 1,
      title: "Natural Language Processing",
      description: "Our advanced NLP technology understands and responds to human language with unprecedented accuracy.",
      icon: "language"
    },
    {
      id: 2,
      title: "Computer Vision",
      description: "Analyze and interpret visual information from the world with our powerful computer vision systems.",
      icon: "visibility"
    },
    {
      id: 3,
      title: "Predictive Analytics",
      description: "Make data-driven decisions with our AI-powered predictive analytics that forecast trends and outcomes.",
      icon: "trending_up"
    },
    {
      id: 4,
      title: "Automated Decision Making",
      description: "Streamline operations with intelligent automation that learns and improves over time.",
      icon: "auto_awesome"
    }
  ];

  return (
    <section id="features" className="features">
      <div className="container">
        <div className="section-header">
          <h2>Powerful AI Features</h2>
          <p>Discover how our technology can transform your business</p>
        </div>

        <div className="features-grid">
          {features.map(feature => (
            <div key={feature.id} className="feature-card">
              <div className="feature-icon">
                <span className="material-icons">{feature.icon}</span>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
