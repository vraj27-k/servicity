import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    role: 'user' 
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Animation on mount
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
    
    // Update password strength
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
    
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
    } else if (form.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
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
      const { confirmPassword, ...submitData } = form;
      await axios.post('http://127.0.0.1:8000/api/register/', submitData);
      
      // Success animation
      document.querySelector('.signup-form').classList.add('success-animation');
      
      setTimeout(() => {
        alert("Signup successful! Please login to continue.");
        navigate('/login');
      }, 1000);

    } catch (err) {
      console.error(err.response?.data || err.message);
      
      // Error animation
      document.querySelector('.signup-form').classList.add('error-shake');
      setTimeout(() => {
        document.querySelector('.signup-form').classList.remove('error-shake');
      }, 500);
      
      if (err.response?.data) {
        const backendErrors = err.response.data;
        setErrors({ 
          general: typeof backendErrors === 'string' 
            ? backendErrors 
            : "Signup failed. Please check your details and try again." 
        });
      } else {
        setErrors({ general: "Network error. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthText = () => {
    const strengths = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return strengths[passwordStrength] || 'Very Weak';
  };

  const getPasswordStrengthColor = () => {
    const colors = ['#dc3545', '#fd7e14', '#ffc107', '#20c997', '#28a745'];
    return colors[passwordStrength] || '#dc3545';
  };

  return (
    <>
      {/* Signup Page */}
      <div className="signup-page">
        {/* Background Elements */}
        <div className="signup-background">
          <div className="bg-shape shape-1"></div>
          <div className="bg-shape shape-2"></div>
          <div className="bg-shape shape-3"></div>
          <div className="bg-shape shape-4"></div>
        </div>

        <div className="container">
          <div className="row justify-content-center align-items-center min-vh-100 py-5">
            <div className="col-lg-6 col-md-8 col-sm-10">
              {/* Signup Card */}
              <div className={`signup-card ${isVisible ? 'fade-in' : ''}`}>
                {/* Card Header */}
                <div className="signup-header">
                  <div className="logo-container">
                    <div className="logo-circle">
                      <i className="bi bi-person-plus"></i>
                    </div>
                    <h2 className="logo-text">ServiCity</h2>
                  </div>
                  <h3 className="welcome-text">Create Account</h3>
                  <p className="welcome-subtitle">Join us and start booking services</p>
                </div>

                {/* Error Alert */}
                {errors.general && (
                  <div className="alert alert-danger alert-custom" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {errors.general}
                  </div>
                )}

                {/* Signup Form */}
                <form onSubmit={handleSubmit} className="signup-form">
                  {/* Username Field */}
                  <div className="form-group">
                    <div className="input-wrapper">
                      <div className="input-icon">
                        <i className="bi bi-person"></i>
                      </div>
                      <input
                        className={`form-control custom-input ${errors.username ? 'is-invalid' : ''}`}
                        name="username"
                        type="text"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        required
                      />
                      <div className="input-line"></div>
                    </div>
                    {errors.username && (
                      <div className="error-message">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {errors.username}
                      </div>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="form-group">
                    <div className="input-wrapper">
                      <div className="input-icon">
                        <i className="bi bi-envelope"></i>
                      </div>
                      <input
                        className={`form-control custom-input ${errors.email ? 'is-invalid' : ''}`}
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                      <div className="input-line"></div>
                    </div>
                    {errors.email && (
                      <div className="error-message">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {errors.email}
                      </div>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="form-group">
                    <div className="input-wrapper">
                      <div className="input-icon">
                        <i className="bi bi-lock"></i>
                      </div>
                      <input
                        className={`form-control custom-input ${errors.password ? 'is-invalid' : ''}`}
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
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
                      <div className="input-line"></div>
                    </div>
                    {form.password && (
                      <div className="password-strength">
                        <div className="strength-bar">
                          <div 
                            className="strength-fill" 
                            style={{ 
                              width: `${(passwordStrength / 5) * 100}%`,
                              backgroundColor: getPasswordStrengthColor()
                            }}
                          ></div>
                        </div>
                        <span 
                          className="strength-text"
                          style={{ color: getPasswordStrengthColor() }}
                        >
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                    )}
                    {errors.password && (
                      <div className="error-message">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {errors.password}
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="form-group">
                    <div className="input-wrapper">
                      <div className="input-icon">
                        <i className="bi bi-shield-check"></i>
                      </div>
                      <input
                        className={`form-control custom-input ${errors.confirmPassword ? 'is-invalid' : ''}`}
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                      <div className="input-line"></div>
                    </div>
                    {errors.confirmPassword && (
                      <div className="error-message">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>

                  {/* Role Selection */}
                  <div className="form-group">
                    <div className="input-wrapper">
                      <div className="input-icon">
                        <i className="bi bi-person-badge"></i>
                      </div>
                      
                      <div className="input-line"></div>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="form-group">
                    <div className="form-check custom-checkbox">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="agreeTerms"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="agreeTerms">
                        I agree to the <Link to="/terms" className="link-primary">Terms & Conditions</Link> and 
                        <Link to="/privacy" className="link-primary ms-1">Privacy Policy</Link>
                      </label>
                    </div>
                    {errors.terms && (
                      <div className="error-message">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {errors.terms}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    className="btn btn-signup" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Creating account...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-plus me-2"></i>
                        Create Account
                      </>
                    )}
                    <div className="btn-ripple"></div>
                  </button>

                  {/* Divider */}
                  <div className="divider">
                    <span>or</span>
                  </div>

                  {/* Social Signup */}
                  <div className="social-signup">
                    <button type="button" className="btn btn-social btn-google">
                      <i className="bi bi-google me-2"></i>
                      Sign up with Google
                    </button>
                  </div>

                  {/* Login Link */}
                  <div className="login-link">
                    <p>Already have an account? 
                      <Link to="/login" className="link-primary ms-1">Sign in here</Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CSS Styles */}
      <style jsx>{`
        /* Signup Page */
        .signup-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow: hidden;
          padding: 2rem 0;
        }

        /* Background Shapes */
        .signup-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .bg-shape {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          animation: floatUpDown 8s ease-in-out infinite;
        }

        .shape-1 {
          width: 150px;
          height: 150px;
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 200px;
          height: 200px;
          top: 20%;
          right: 10%;
          animation-delay: -2s;
        }

        .shape-3 {
          width: 100px;
          height: 100px;
          bottom: 30%;
          left: 20%;
          animation-delay: -4s;
        }

        .shape-4 {
          width: 120px;
          height: 120px;
          bottom: 15%;
          right: 25%;
          animation-delay: -6s;
        }

        /* Signup Card */
        .signup-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 25px;
          padding: 3rem 2.5rem;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          position: relative;
          overflow: hidden;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.6s ease;
        }

        .signup-card.fade-in {
          opacity: 1;
          transform: translateY(0);
        }

        .signup-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
          transform: translateX(-100%);
          transition: transform 0.8s ease;
        }

        .signup-card:hover::before {
          transform: translateX(100%);
        }

        /* Header */
        .signup-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .logo-container {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .logo-circle {
          width: 60px;
          height: 60px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1rem;
          animation: logoPulse 2s ease-in-out infinite;
        }

        .logo-circle i {
          font-size: 1.8rem;
          color: white;
        }

        .logo-text {
          background: linear-gradient(45deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 800;
          margin: 0;
        }

        .welcome-text {
          color: #333;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .welcome-subtitle {
          color: #666;
          margin-bottom: 0;
        }

        /* Form Styles */
        .signup-form {
          position: relative;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .input-wrapper {
          position: relative;
        }

        .custom-input, .custom-select {
          background: rgba(255, 255, 255, 0.8);
          border: 2px solid rgba(102, 126, 234, 0.2);
          border-radius: 15px;
          padding: 1rem 1rem 1rem 3.5rem;
          font-size: 1rem;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          width: 100%;
        }

        .custom-input:focus, .custom-select:focus {
          background: rgba(255, 255, 255, 0.95);
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
          transform: translateY(-2px);
          outline: none;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #667eea;
          font-size: 1.2rem;
          z-index: 2;
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #667eea;
          font-size: 1.1rem;
          cursor: pointer;
          z-index: 2;
          transition: color 0.3s ease;
        }

        .password-toggle:hover {
          color: #764ba2;
        }

        .input-line {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          transition: width 0.3s ease;
        }

        .custom-input:focus ~ .input-line,
        .custom-select:focus ~ .input-line {
          width: 100%;
        }

        /* Password Strength */
        .password-strength {
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .strength-bar {
          flex: 1;
          height: 4px;
          background: #e9ecef;
          border-radius: 2px;
          overflow: hidden;
        }

        .strength-fill {
          height: 100%;
          transition: all 0.3s ease;
          border-radius: 2px;
        }

        .strength-text {
          font-size: 0.8rem;
          font-weight: 600;
          min-width: 80px;
        }

        /* Error Messages */
        .error-message {
          color: #dc3545;
          font-size: 0.875rem;
          margin-top: 0.5rem;
          animation: slideDown 0.3s ease;
        }

        .alert-custom {
          background: rgba(220, 53, 69, 0.1);
          border: 1px solid rgba(220, 53, 69, 0.3);
          border-radius: 15px;
          margin-bottom: 1.5rem;
          animation: slideDown 0.3s ease;
        }

        /* Custom Checkbox */
        .custom-checkbox {
          margin-bottom: 1rem;
        }

        .custom-checkbox .form-check-input {
          border-radius: 5px;
          border: 2px solid #667eea;
        }

        .custom-checkbox .form-check-input:checked {
          background-color: #667eea;
          border-color: #667eea;
        }

        .custom-checkbox .form-check-label {
          font-size: 0.9rem;
          color: #666;
        }

        /* Signup Button */
        .btn-signup {
          width: 100%;
          background: linear-gradient(45deg, #667eea, #764ba2);
          border: none;
          color: white;
          padding: 1rem 2rem;
          border-radius: 15px;
          font-weight: 600;
          font-size: 1.1rem;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          margin-bottom: 1.5rem;
        }

        .btn-signup:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
          color: white;
        }

        .btn-signup:disabled {
          opacity: 0.7;
        }

        .btn-ripple {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .btn-signup:active .btn-ripple {
          width: 300px;
          height: 300px;
        }

        /* Divider */
        .divider {
          text-align: center;
          margin: 1.5rem 0;
          position: relative;
        }

        .divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: rgba(102, 126, 234, 0.2);
        }

        .divider span {
          background: rgba(255, 255, 255, 0.95);
          padding: 0 1rem;
          color: #666;
          font-weight: 500;
        }

        /* Social Signup */
        .social-signup {
          margin-bottom: 1.5rem;
        }

        .btn-social {
          width: 100%;
          background: white;
          border: 2px solid rgba(102, 126, 234, 0.2);
          color: #333;
          padding: 0.8rem 1.5rem;
          border-radius: 15px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-google:hover {
          background: #f8f9fa;
          border-color: #667eea;
          transform: translateY(-2px);
        }

        /* Login Link */
        .login-link {
          text-align: center;
          margin-top: 1rem;
        }

        .login-link p {
          color: #666;
          margin: 0;
        }

        .login-link .link-primary {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .login-link .link-primary:hover {
          color: #764ba2;
        }

        /* Animations */
        @keyframes floatUpDown {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-25px);
          }
        }

        @keyframes logoPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes error-shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        .error-shake {
          animation: error-shake 0.5s ease-in-out;
        }

        @keyframes success-scale {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        .success-animation {
          animation: success-scale 0.5s ease-in-out;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .signup-card {
            margin: 1rem;
            padding: 2rem 1.5rem;
          }

          .logo-circle {
            width: 50px;
            height: 50px;
            margin-right: 0.5rem;
          }

          .logo-circle i {
            font-size: 1.5rem;
          }

          .welcome-text {
            font-size: 1.5rem;
          }

          .custom-input, .custom-select {
            padding: 0.8rem 0.8rem 0.8rem 3rem;
          }

          .input-icon {
            left: 0.8rem;
          }

          .password-toggle {
            right: 0.8rem;
          }
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.1);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #667eea, #764ba2);
          border-radius: 4px;
        }
      `}</style>
    </>
  );
};

export default Signup;
