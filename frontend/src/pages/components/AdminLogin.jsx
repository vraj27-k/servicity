// src/components/AdminLogin.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  // Animation on mount
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!form.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 3) {
      newErrors.password = 'Password must be at least 3 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setErrors({});

    try {
      console.log('Attempting to connect to:', 'http://localhost:8000/api/admin-login/');
      
      const response = await fetch('http://localhost:8000/api/admin-login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: form.username,
          password: form.password
        })
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      
      if (!contentType || !contentType.includes('application/json')) {
        const htmlText = await response.text();
        console.error('Received HTML instead of JSON:', htmlText);
        
        if (response.status === 404 || htmlText.includes('Page not found')) {
          throw new Error('API endpoint not found. Please check Django URL configuration.');
        } else {
          throw new Error('Server returned HTML instead of JSON. Check if the API endpoint exists.');
        }
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        // Store tokens and user info
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('username', data.username);
        localStorage.setItem('role', data.role);
        localStorage.setItem('user_id', data.id);
        localStorage.setItem('email', data.email);

        // Success animation
        const formElement = document.querySelector('.admin-login-form');
        if (formElement) {
          formElement.classList.add('success-animation');
        }
        
        setTimeout(() => {
          navigate('/admin-dashboard');
        }, 500);

      } else {
        let errorMessage = data.error || "Login failed";
        
        switch (response.status) {
          case 400:
            errorMessage = "Invalid request. Please check your credentials.";
            break;
          case 401:
            errorMessage = "Invalid username or password.";
            break;
          case 403:
            errorMessage = data.error || "Access denied. Admin privileges required.";
            break;
          case 404:
            errorMessage = "User not found in database.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
        }
        
        setErrors({ general: errorMessage });
      }
    } catch (error) {
      console.error('Login error:', error);
      
      const formElement = document.querySelector('.admin-login-form');
      if (formElement) {
        formElement.classList.add('error-shake');
        setTimeout(() => {
          formElement.classList.remove('error-shake');
        }, 500);
      }
      
      if (error.message.includes('API endpoint not found')) {
        setErrors({ 
          general: 'API endpoint not configured. Please ensure Django server is running and URLs are configured.'
        });
      } else if (error.message.includes('HTML instead of JSON')) {
        setErrors({ 
          general: 'Server configuration error. Check Django view implementation.'
        });
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setErrors({ 
          general: 'Network error. Please check if Django server is running on http://localhost:8000'
        });
      } else {
        setErrors({ 
          general: error.message || 'An unexpected error occurred. Please try again.'
        });
      }
    }

    setLoading(false);
  };

  return (
    <>
      <div className="admin-login-page">
        {/* Animated Background */}
        <div className="admin-background">
          <div className="bg-particle particle-1"></div>
          <div className="bg-particle particle-2"></div>
          <div className="bg-particle particle-3"></div>
          <div className="bg-particle particle-4"></div>
          <div className="bg-particle particle-5"></div>
          <div className="bg-grid"></div>
        </div>

        <div className="container-fluid">
          <div className="row min-vh-100">
            {/* Left Side - Branding */}
            <div className="col-lg-6 d-none d-lg-flex admin-branding-section">
              <div className="branding-content">
                <div className="brand-logo">
                  <div className="logo-icon">
                    <i className="bi bi-shield-lock-fill"></i>
                  </div>
                  <h1 className="brand-title">ServiCity Admin</h1>
                </div>
                <div className="brand-description">
                  <h2>Secure Administrative Access</h2>
                  <p>Advanced control panel for system administrators. Monitor, manage, and maintain your platform with enterprise-grade security.</p>
                  
                  <div className="feature-list">
                    <div className="feature-item">
                      <i className="bi bi-shield-check"></i>
                      <span>Role-based authentication</span>
                    </div>
                    <div className="feature-item">
                      <i className="bi bi-graph-up"></i>
                      <span>Real-time analytics</span>
                    </div>
                    <div className="feature-item">
                      <i className="bi bi-lock"></i>
                      <span>Encrypted data protection</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="col-lg-6 admin-form-section">
              <div className="form-container">
                <div className={`admin-login-card ${isVisible ? 'slide-in' : ''}`}>
                  
                  {/* Mobile Logo */}
                  <div className="mobile-logo d-lg-none">
                    <div className="mobile-logo-icon">
                      <i className="bi bi-shield-lock-fill"></i>
                    </div>
                    <h3>Admin Access</h3>
                  </div>

                  {/* Form Header */}
                  <div className="form-header">
                    <h2>Administrator Login</h2>
                    <p>Enter your credentials to access the admin dashboard</p>
                  </div>

                  {/* Error Alert */}
                  {errors.general && (
                    <div className="error-alert">
                      <div className="error-icon">
                        <i className="bi bi-exclamation-triangle"></i>
                      </div>
                      <div className="error-content">
                        <strong>Authentication Failed</strong>
                        <p>{errors.general}</p>
                      </div>
                    </div>
                  )}

                  {/* Login Form */}
                  <form onSubmit={handleSubmit} className="admin-login-form">
                    {/* Username Field */}
                    <div className="input-group">
                      <label className="input-label">Username</label>
                      <div className="input-container">
                        <div className="input-icon">
                          <i className="bi bi-person"></i>
                        </div>
                        <input
                          className={`form-input ${errors.username ? 'error' : ''}`}
                          name="username"
                          type="text"
                          placeholder="Enter your admin username"
                          value={form.username}
                          onChange={handleChange}
                          required
                        />
                        <div className="input-border"></div>
                      </div>
                      {errors.username && (
                        <div className="field-error">
                          <i className="bi bi-exclamation-circle"></i>
                          {errors.username}
                        </div>
                      )}
                    </div>

                    {/* Password Field */}
                    <div className="input-group">
                      <label className="input-label">Password</label>
                      <div className="input-container">
                        <div className="input-icon">
                          <i className="bi bi-lock"></i>
                        </div>
                        <input
                          className={`form-input ${errors.password ? 'error' : ''}`}
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={form.password}
                          onChange={handleChange}
                          required
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                        </button>
                        <div className="input-border"></div>
                      </div>
                      {errors.password && (
                        <div className="field-error">
                          <i className="bi bi-exclamation-circle"></i>
                          {errors.password}
                        </div>
                      )}
                    </div>

                    {/* Security Notice */}
                    

                    {/* Submit Button */}
                    <button 
                      type="submit" 
                      className="submit-btn" 
                      disabled={loading}
                    >
                      <div className="btn-content">
                        {loading ? (
                          <>
                            <div className="loading-spinner"></div>
                            <span>Authenticating...</span>
                          </>
                        ) : (
                          <>
                            <i className="bi bi-shield-lock"></i>
                            <span>Access Dashboard</span>
                          </>
                        )}
                      </div>
                      <div className="btn-shine"></div>
                    </button>

                    {/* Footer Links */}
                    <div className="form-footer">
                      <Link to="/" className="back-link">
                        <i className="bi bi-arrow-left"></i>
                        <span>Back to home</span>
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Base Styles */
        * {
          box-sizing: border-box;
        }

        .admin-login-page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* Animated Background */
        .admin-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          z-index: -1;
        }

        .bg-grid {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: gridMove 20s linear infinite;
        }

        .bg-particle {
          position: absolute;
          background: radial-gradient(circle, rgba(220,53,69,0.6) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }

        .particle-1 {
          width: 80px;
          height: 80px;
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .particle-2 {
          width: 60px;
          height: 60px;
          top: 60%;
          right: 20%;
          animation-delay: -2s;
        }

        .particle-3 {
          width: 40px;
          height: 40px;
          bottom: 30%;
          left: 30%;
          animation-delay: -4s;
        }

        .particle-4 {
          width: 100px;
          height: 100px;
          top: 40%;
          right: 10%;
          animation-delay: -1s;
        }

        .particle-5 {
          width: 50px;
          height: 50px;
          bottom: 20%;
          right: 40%;
          animation-delay: -3s;
        }

        /* Branding Section */
        .admin-branding-section {
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
          position: relative;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: white;
          overflow: hidden;
        }

        .admin-branding-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
        }

        .branding-content {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 400px;
          padding: 2rem;
        }

        .brand-logo {
          margin-bottom: 3rem;
        }

        .logo-icon {
          width: 120px;
          height: 120px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          animation: logoFloat 3s ease-in-out infinite;
        }

        .logo-icon i {
          font-size: 3rem;
          color: white;
        }

        .brand-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin: 0;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .brand-description h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
          opacity: 0.95;
        }

        .brand-description p {
          font-size: 1.1rem;
          line-height: 1.6;
          opacity: 0.9;
          margin-bottom: 2rem;
        }

        .feature-list {
          text-align: left;
        }

        .feature-item {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
          font-size: 1rem;
          opacity: 0.9;
        }

        .feature-item i {
          font-size: 1.2rem;
          margin-right: 1rem;
          color: rgba(255, 255, 255, 0.8);
        }

        /* Form Section */
        .admin-form-section {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(20px);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .form-container {
          width: 100%;
          max-width: 450px;
          padding: 2rem;
        }

        .admin-login-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(30px);
          border-radius: 24px;
          padding: 3rem 2.5rem;
          box-shadow: 
            0 25px 80px rgba(0, 0, 0, 0.15),
            0 0 0 1px rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
          opacity: 0;
          transform: translateX(50px);
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .admin-login-card.slide-in {
          opacity: 1;
          transform: translateX(0);
        }

        .admin-login-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(220,53,69,0.1), transparent);
          transition: left 0.6s ease;
        }

        .admin-login-card:hover::before {
          left: 100%;
        }

        /* Mobile Logo */
        .mobile-logo {
          text-align: center;
          margin-bottom: 2rem;
        }

        .mobile-logo-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(45deg, #dc3545, #c82333);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }

        .mobile-logo-icon i {
          font-size: 1.8rem;
          color: white;
        }

        .mobile-logo h3 {
          color: #333;
          font-weight: 700;
          margin: 0;
        }

        /* Form Header */
        .form-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .form-header h2 {
          color: #1a1a2e;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .form-header p {
          color: #666;
          font-size: 1rem;
          margin: 0;
        }

        /* Error Alert */
        .error-alert {
          background: linear-gradient(135deg, #fff5f5, #fed7d7);
          border: 1px solid #feb2b2;
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: flex-start;
          animation: errorSlide 0.3s ease-out;
        }

        .error-icon {
          color: #e53e3e;
          font-size: 1.2rem;
          margin-right: 0.75rem;
          margin-top: 0.1rem;
        }

        .error-content strong {
          color: #742a2a;
          font-weight: 600;
          display: block;
          margin-bottom: 0.25rem;
        }

        .error-content p {
          color: #742a2a;
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        /* Form Inputs */
        .input-group {
          margin-bottom: 1.5rem;
        }

        .input-label {
          display: block;
          color: #333;
          font-weight: 600;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .input-container {
          position: relative;
        }

        .form-input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          background: rgba(255, 255, 255, 0.8);
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          backdrop-filter: blur(10px);
        }

        .form-input:focus {
          outline: none;
          border-color: #dc3545;
          background: rgba(255, 255, 255, 0.95);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(220, 53, 69, 0.1);
        }

        .form-input.error {
          border-color: #e53e3e;
          background: rgba(254, 215, 215, 0.3);
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #718096;
          font-size: 1.1rem;
          transition: color 0.3s ease;
          z-index: 2;
        }

        .form-input:focus + .password-toggle + .input-border + .input-icon,
        .form-input:focus ~ .input-icon {
          color: #dc3545;
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #718096;
          font-size: 1rem;
          cursor: pointer;
          transition: color 0.3s ease;
          z-index: 3;
        }

        .password-toggle:hover {
          color: #dc3545;
        }

        .input-border {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          background: linear-gradient(45deg, #dc3545, #c82333);
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        .form-input:focus ~ .input-border {
          width: 100%;
        }

        .field-error {
          color: #e53e3e;
          font-size: 0.8rem;
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          animation: fieldErrorSlide 0.3s ease-out;
        }

        .field-error i {
          margin-right: 0.5rem;
        }

        /* Security Notice */
        .security-notice {
          background: linear-gradient(135deg, rgba(220,53,69,0.05), rgba(200,35,51,0.05));
          border: 1px solid rgba(220,53,69,0.1);
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 2rem;
        }

        .security-header {
          display: flex;
          align-items: center;
          color: #dc3545;
          font-weight: 600;
          margin-bottom: 0.75rem;
          font-size: 0.9rem;
        }

        .security-header i {
          margin-right: 0.5rem;
          font-size: 1rem;
        }

        .security-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .security-list li {
          color: #666;
          font-size: 0.85rem;
          margin-bottom: 0.25rem;
          position: relative;
          padding-left: 1rem;
        }

        .security-list li::before {
          content: '•';
          color: #dc3545;
          position: absolute;
          left: 0;
        }

        /* Submit Button */
        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
          border: none;
          color: white;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          cursor: pointer;
          margin-bottom: 1.5rem;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(220, 53, 69, 0.4);
        }

        .submit-btn:active {
          transform: translateY(-1px);
        }

        .submit-btn:disabled {
          opacity: 0.8;
          cursor: not-allowed;
          transform: none;
        }

        .btn-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          position: relative;
          z-index: 2;
        }

        .btn-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.6s ease;
        }

        .submit-btn:hover .btn-shine {
          left: 100%;
        }

        .loading-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        /* Form Footer */
        .form-footer {
          text-align: center;
        }

        .back-link {
          color: #718096;
          text-decoration: none;
          font-size: 0.9rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .back-link:hover {
          color: #dc3545;
          transform: translateX(-3px);
        }

        /* Animations */
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }

        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.05); }
        }

        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        @keyframes errorSlide {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fieldErrorSlide {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-shake {
          animation: shake 0.5s ease-in-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
          20%, 40%, 60%, 80% { transform: translateX(3px); }
        }

        .success-animation {
          animation: successPulse 0.6s ease-out;
        }

        @keyframes successPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }

        /* Responsive Design */
        @media (max-width: 991.98px) {
          .admin-login-card {
            margin: 1rem;
            padding: 2rem;
          }
          
          .form-header h2 {
            font-size: 1.75rem;
          }
          
          .brand-title {
            font-size: 2rem;
          }
          
          .form-container {
            padding: 1rem;
          }
        }

        @media (max-width: 575.98px) {
          .admin-login-card {
            padding: 1.5rem;
          }
          
          .form-header h2 {
            font-size: 1.5rem;
          }
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.1);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #dc3545, #c82333);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #c82333, #a71e2a);
        }
      `}</style>
    </>
  );
};

export default AdminLogin;
