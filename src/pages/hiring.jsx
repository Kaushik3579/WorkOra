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
    profile: '',
    type: '',
    description: '',
    sampleWork: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      sampleWork: e.target.files[0]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    
    // Redirect to ClientDashboard after submission
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
          <h2 className="form-title">Freelancer Registration</h2>

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
          
          <input 
            type="text" 
            name="profile"
            placeholder="Your Profile (e.g., Web Developer)" 
            className="form-input" 
            value={formData.profile}
            onChange={handleInputChange}
            required 
          />

          <select 
            className="form-input" 
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Type</option>
            <option value="web">Web Development</option>
            <option value="design">UI/UX Design</option>
            <option value="writing">Content Writing</option>
            <option value="marketing">Digital Marketing</option>
            <option value="video">Video Editing</option>
          </select>

          <textarea
            name="description"
            placeholder="Describe your experience, tools, or past work..."
            className="form-textarea"
            rows="4"
            value={formData.description}
            onChange={handleInputChange}
            required
          />

          <label className="upload-label">
            Upload Sample Work
            <input 
              type="file" 
              className="form-upload" 
              onChange={handleFileChange}
              required 
            />
          </label>

          <button 
            type="submit" 
            className="submit-button"
            onMouseEnter={() => setHoveredButton('submit')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default WorkoraLogin;