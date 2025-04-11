// src/components/WorkoraLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const WorkoraLogin = () => {
  const [hoveredButton, setHoveredButton] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Client form submitted:', formData);
    navigate('/client-dashboard');
  };

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

      {/* Right section with login form */}
      <div className="login-options-section">
        <form className="freelancer-form" onSubmit={handleSubmit}>
          <h2 className="form-title">Client Registration</h2>

          <input 
            type="text" 
            name="fullName"
            placeholder="Full Name" 
            className="form-input" 
            value={formData.fullName}
            onChange={handleInputChange}
            required 
          />
          
          <input 
            type="tel" 
            name="phoneNumber"
            placeholder="Phone Number" 
            className="form-input" 
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required 
          />
          
          <input 
            type="email" 
            name="email"
            placeholder="Email Address" 
            className="form-input" 
            value={formData.email}
            onChange={handleInputChange}
            required 
          />
          
          <button 
            type="submit"
            className={`submit-button ${hoveredButton === 'submit' ? 'button-hover' : ''}`}
            onMouseEnter={() => setHoveredButton('submit')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => navigate('/clientdash')}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default WorkoraLogin;