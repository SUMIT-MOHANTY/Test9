import React from 'react';

interface LoadingFallbackProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

const LoadingFallback: React.FC<LoadingFallbackProps> = ({
  message = 'Loading content...',
  size = 'medium'
}) => {
  const getSize = () => {
    switch (size) {
      case 'small': return { width: '30px', height: '30px' };
      case 'large': return { width: '80px', height: '80px' };
      default: return { width: '50px', height: '50px' };
    }
  };

  const { width, height } = getSize();

  return (
    <div className="loading-container" aria-live="polite" role="status">
      <div
        className="loading-spinner"
        style={{
          width,
          height,
          border: '5px solid #f3f3f3',
          borderTop: '5px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto'
        }}
      />
      {message && <p className="loading-message">{message}</p>}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          min-height: 200px;
        }
        .loading-message {
          margin-top: 15px;
          color: #666;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default LoadingFallback;
