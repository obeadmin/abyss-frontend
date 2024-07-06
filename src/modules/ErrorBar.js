import React, { useEffect } from 'react';
import './ErrorBar.css';

function ErrorBar({ message, clearError }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        clearError();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [message, clearError]);

  return (
    <div className={`error-bar ${message ? 'show' : ''}`}>
      {message}
    </div>
  );
}

export default ErrorBar;
