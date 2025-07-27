// src/ForgotPassword.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    new_password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:8000/api/forgot-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: data.message });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage({ type: "error", text: data.error || "Failed to reset password." });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Server error. Please try again." });
    }

    setLoading(false);
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <div className="icon-container">
            <i className="bi bi-key-fill reset-icon"></i>
          </div>
          <h2>Reset Password</h2>
          <p>Enter your email and new password to reset your account</p>
        </div>

        <form onSubmit={handleSubmit} className="forgot-password-form">
          {message && (
            <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
              <i className={`bi ${message.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`}></i>
              {message.text}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">
              <i className="bi bi-envelope me-2"></i>
              Email Address
            </label>
            <div className="input-container">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your registered email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-control"
              />
              <div className="input-icon">
                <i className="bi bi-envelope"></i>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="new_password">
              <i className="bi bi-lock me-2"></i>
              New Password
            </label>
            <div className="input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="new_password"
                name="new_password"
                placeholder="Enter your new password"
                value={formData.new_password}
                onChange={handleChange}
                required
                className="form-control"
              />
              <div className="input-icon">
                <i className="bi bi-lock"></i>
              </div>
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-reset-password"
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Resetting Password...
              </>
            ) : (
              <>
                <i className="bi bi-key me-2"></i>
                Reset Password
              </>
            )}
          </button>
        </form>

        <div className="forgot-password-footer">
          <div className="back-to-login">
            <Link to="/login" className="back-link">
              <i className="bi bi-arrow-left me-2"></i>
              Back to Login
            </Link>
          </div>
          <div className="signup-link">
            Don't have an account? 
            <Link to="/signup" className="signup-text">Sign up here</Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .forgot-password-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        .forgot-password-container::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 50%);
          animation: backgroundMove 20s ease-in-out infinite;
        }

        .forgot-password-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 25px;
          padding: 3rem;
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.2);
          max-width: 450px;
          width: 100%;
          animation: slideInUp 0.8s ease-out;
          position: relative;
          z-index: 1;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .forgot-password-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .icon-container {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 50%;
          margin-bottom: 1.5rem;
          animation: iconFloat 3s ease-in-out infinite;
        }

        .reset-icon {
          font-size: 2.5rem;
          color: white;
        }

        .forgot-password-header h2 {
          color: #333;
          font-weight: 700;
          margin-bottom: 0.5rem;
          font-size: 2rem;
        }

        .forgot-password-header p {
          color: #666;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #333;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .input-container {
          position: relative;
        }

        .form-control {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border: 2px solid #e1e5e9;
          border-radius: 15px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.8);
        }

        .form-control:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.1);
          outline: none;
          background: white;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
          font-size: 1.1rem;
          transition: color 0.3s ease;
        }

        .form-control:focus + .input-icon {
          color: #667eea;
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          font-size: 1.1rem;
          transition: color 0.3s ease;
        }

        .password-toggle:hover {
          color: #667eea;
        }

        .btn-reset-password {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 15px;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .btn-reset-password::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s ease;
        }

        .btn-reset-password:hover::before {
          left: 100%;
        }

        .btn-reset-password:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }

        .btn-reset-password:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .alert {
          padding: 1rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          border: none;
          animation: alertSlideIn 0.5s ease-out;
        }

        .alert-success {
          color: #155724;
          background: linear-gradient(135deg, #d4edda, #c3e6cb);
        }

        .alert-danger {
          color: #721c24;
          background: linear-gradient(135deg, #f8d7da, #f5c6cb);
        }

        .forgot-password-footer {
          margin-top: 2rem;
          text-align: center;
        }

        .back-to-login {
          margin-bottom: 1rem;
        }

        .back-link {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
        }

        .back-link:hover {
          color: #764ba2;
          transform: translateX(-3px);
        }

        .signup-link {
          color: #666;
          font-size: 0.9rem;
        }

        .signup-text {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          margin-left: 0.5rem;
          transition: color 0.3s ease;
        }

        .signup-text:hover {
          color: #764ba2;
        }

        .spinner-border-sm {
          width: 1rem;
          height: 1rem;
        }

        /* Keyframe Animations */
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes iconFloat {
          0%, 100% { 
            transform: translateY(0); 
          }
          50% { 
            transform: translateY(-10px); 
          }
        }

        @keyframes backgroundMove {
          0%, 100% { 
            transform: rotate(0deg) scale(1); 
          }
          50% { 
            transform: rotate(180deg) scale(1.1); 
          }
        }

        @keyframes alertSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .forgot-password-container {
            padding: 1rem;
          }

          .forgot-password-card {
            padding: 2rem;
          }

          .forgot-password-header h2 {
            font-size: 1.5rem;
          }

          .icon-container {
            width: 60px;
            height: 60px;
          }

          .reset-icon {
            font-size: 2rem;
          }
        }

        /* Custom animations for better UX */
        .form-control {
          animation: inputFadeIn 0.6s ease-out;
        }

        @keyframes inputFadeIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;
