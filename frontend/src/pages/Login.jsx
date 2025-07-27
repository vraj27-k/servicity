import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
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
      // Login API
      const res = await axios.post("http://127.0.0.1:8000/api/login/", {
        username: form.username,
        password: form.password
      });

      const { access, username, role, id } = res.data;

      // Save data to localStorage
      localStorage.setItem("token", access);
      localStorage.setItem("username", username);
      localStorage.setItem("role", role);
      localStorage.setItem("user_id", id);

      // Success animation
      document.querySelector('.login-form').classList.add('success-animation');
      
      setTimeout(() => {
        // Check user role
        if (role === "employee") {
          axios.get("http://127.0.0.1:8000/api/employee/profile-status/", {
            headers: {
              Authorization: `Bearer ${access}`
            }
          }).then(profileRes => {
            const isComplete = profileRes.data.profile_complete;
            if (!isComplete) {
              navigate("/employee/setup");
            } else {
              navigate("/employee/dashboard");
            }
          }).catch(() => {
            navigate("/employee/dashboard");
          });
        } else if (role === "admin") {
          navigate("/admin-dashboard");
        } else {
          // Check if redirect was stored before login
          const redirectPath = localStorage.getItem("redirect_after_login");
          if (redirectPath) {
            localStorage.removeItem("redirect_after_login");
            navigate(redirectPath);
          } else {
            navigate("/");
          }
        }
      }, 500);

    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      
      // Error animation
      document.querySelector('.login-form').classList.add('error-shake');
      setTimeout(() => {
        document.querySelector('.login-form').classList.remove('error-shake');
      }, 500);
      
      if (err.response?.status === 401) {
        setErrors({ general: "Invalid username or password." });
      } else {
        setErrors({ general: "Server error. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Login Page */}
      <div className="login-page">
        {/* Background Elements */}
        <div className="login-background">
          <div className="bg-shape shape-1"></div>
          <div className="bg-shape shape-2"></div>
          <div className="bg-shape shape-3"></div>
        </div>

        <div className="container">
          <div className="row justify-content-center align-items-center min-vh-100">
            <div className="col-lg-5 col-md-7 col-sm-9">
              {/* Login Card */}
              <div className={`login-card ${isVisible ? 'fade-in' : ''}`}>
                {/* Card Header */}
                <div className="login-header">
                  <div className="logo-container">
                    <div className="logo-circle">
                      <i className="bi bi-house-heart"></i>
                    </div>
                    <h2 className="logo-text">ServiCity</h2>
                  </div>
                  <h3 className="welcome-text">Welcome Back!</h3>
                  <p className="welcome-subtitle">Sign in to access your account</p>
                </div>

                {/* Error Alert */}
                {errors.general && (
                  <div className="alert alert-danger alert-custom" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {errors.general}
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="login-form">
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
                    {errors.password && (
                      <div className="error-message">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {errors.password}
                      </div>
                    )}
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="form-options">
                    <div className="form-check custom-checkbox">
                      <input className="form-check-input" type="checkbox" id="rememberMe" />
                      <label className="form-check-label" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>
                    <Link to="/forgot-password" className="forgot-link">
                      Forgot Password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    className="btn btn-login" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Logging in...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Sign In
                      </>
                    )}
                    <div className="btn-ripple"></div>
                  </button>

                  {/* Divider */}
                  <div className="divider">
                    <span>or</span>
                  </div>

                  {/* Social Login */}
                  <div className="social-login">
                    <button type="button" className="btn btn-social btn-google">
                      <i className="bi bi-google me-2"></i>
                      Continue with Google
                    </button>
                  </div>

                  {/* Sign Up Link */}
                  <div className="signup-link">
                    <p>Don't have an account? 
                      <Link to="/signup" className="link-primary ms-1">Sign up here</Link>
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
        /* Login Page */
        .login-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
        }

        /* Background Shapes */
        .login-background {
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
          animation: floatUpDown 6s ease-in-out infinite;
        }

        .shape-1 {
          width: 200px;
          height: 200px;
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 150px;
          height: 150px;
          top: 60%;
          right: 15%;
          animation-delay: -2s;
        }

        .shape-3 {
          width: 100px;
          height: 100px;
          bottom: 20%;
          left: 20%;
          animation-delay: -4s;
        }

        /* Login Card */
        .login-card {
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

        .login-card.fade-in {
          opacity: 1;
          transform: translateY(0);
        }

        .login-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }

        .login-card:hover::before {
          transform: translateX(100%);
        }

        /* Header */
        .login-header {
          text-align: center;
          margin-bottom: 2.5rem;
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
        .login-form {
          position: relative;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .input-wrapper {
          position: relative;
        }

        .custom-input {
          background: rgba(255, 255, 255, 0.8);
          border: 2px solid rgba(102, 126, 234, 0.2);
          border-radius: 15px;
          padding: 1rem 1rem 1rem 3.5rem;
          font-size: 1rem;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .custom-input:focus {
          background: rgba(255, 255, 255, 0.95);
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
          transform: translateY(-2px);
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

        .custom-input:focus + .password-toggle + .input-line,
        .custom-input:focus ~ .input-line {
          width: 100%;
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

        /* Form Options */
        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .custom-checkbox .form-check-input {
          border-radius: 5px;
          border: 2px solid #667eea;
        }

        .custom-checkbox .form-check-input:checked {
          background-color: #667eea;
          border-color: #667eea;
        }

        .forgot-link {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .forgot-link:hover {
          color: #764ba2;
        }

        /* Login Button */
        .btn-login {
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

        .btn-login:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
          color: white;
        }

        .btn-login:disabled {
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

        .btn-login:active .btn-ripple {
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

        /* Social Login */
        .social-login {
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

        /* Signup Link */
        .signup-link {
          text-align: center;
          margin-top: 1rem;
        }

        .signup-link p {
          color: #666;
          margin: 0;
        }

        .signup-link .link-primary {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .signup-link .link-primary:hover {
          color: #764ba2;
        }

        /* Animations */
        @keyframes floatUpDown {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
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
          .login-card {
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

          .form-options {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
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

export default Login;
