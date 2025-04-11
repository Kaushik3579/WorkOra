// src/components/WorkoraLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const WorkoraLogin = () => {
  const [hoveredButton, setHoveredButton] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="login-container">
      {/* Left section with logo */}
      <div className="logo-section">
        <div className="logo-container">
          <img 
            src="src/assets/logo.jpg" 
            alt="Workora Logo" 
            className="workora-logo"
          />
        </div>
      </div>

      {/* Right section with login options */}
      <div className="login-options-section">
        <div className="buttons-container">
          <button 
            className={`login-button ${hoveredButton === 'admin' ? 'button-hover' : ''}`}
            onMouseEnter={() => setHoveredButton('admin')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => navigate('/hired')}
          >
            <svg className="button-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
            </svg>
            ARE YOU HIRING?
        
          </button>

          <button 
            className={`login-button ${hoveredButton === 'admin' ? 'button-hover' : ''}`}
            onMouseEnter={() => setHoveredButton('admin')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => navigate('/hiring')}
          >
            <svg className="button-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
            </svg>
            DO YOU WANT TO BE HIRED?
        
            </button>
          
        </div>
      </div>
    </div>
  );

};

export default WorkoraLogin;
