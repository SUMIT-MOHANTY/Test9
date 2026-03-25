import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';

const NotFound: React.FC = () => {
  return (
    <>
      <SEO
        title="Page Not Found | GenAI Platform"
        description="The page you are looking for does not exist."
        ogType="website"
      />

      <div className="not-found-container">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
        <Link to="/" className="home-button">Go to Homepage</Link>
      </div>

      <style jsx>{`
        .not-found-container {
          padding: 60px 20px;
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
        }
        h1 {
          font-size: 72px;
          margin-bottom: 0;
          color: #3498db;
        }
        h2 {
          margin-top: 0;
          margin-bottom: 20px;
        }
        p {
          margin-bottom: 30px;
          color: #666;
        }
        .home-button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #3498db;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          transition: background-color 0.3s;
        }
        .home-button:hover {
          background-color: #2980b9;
        }
      `}</style>
    </>
  );
};

export default NotFound;
