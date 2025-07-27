// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav className={`navbar navbar-expand-lg fixed-top transition-all ${
        isScrolled ? 'navbar-scrolled' : 'navbar-transparent'
      }`}>
        <div className="container">
          {/* Animated Logo */}
          <Link className="navbar-brand logo-animated" to="/">
            <div className="logo-container">
              <i className="bi bi-house-heart logo-icon"></i>
              <span className="logo-text">ServiCity</span>
              <div className="logo-underline"></div>
            </div>
          </Link>

          {/* Animated Hamburger for mobile */}
          <button
            className={`navbar-toggler custom-toggler ${isMenuOpen ? 'active' : ''}`}
            type="button"
            onClick={toggleMenu}
            aria-label="Toggle navigation"
          >
            <span className="toggler-line line1"></span>
            <span className="toggler-line line2"></span>
            <span className="toggler-line line3"></span>
          </button>

          {/* Navigation Links */}
          <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
              {!username ? (
                <>
                  <li className="nav-item">
                    <Link 
                      className={`nav-link nav-link-animated ${isActive('/login') ? 'active' : ''}`} 
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Login
                      <div className="nav-link-underline"></div>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link 
                      className="nav-link btn-signup-animated" 
                      to="/signup"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="btn-text">
                        <i className="bi bi-person-plus me-2"></i>
                        Sign Up
                      </span>
                      <div className="btn-ripple"></div>
                    </Link>
                  </li>
                  
                  {/* Admin Login Icon */}
                  <li className="nav-item">
                    <Link 
                      className={`nav-link admin-icon-link ${isActive('/admin-login') ? 'active' : ''}`}
                      to="/admin-login"
                      onClick={() => setIsMenuOpen(false)}
                      title="Admin Login"
                    >
                      <div className="admin-icon-container" style={{height:"5px"}}>
                        <i className="bi bi-shield-lock admin-icon"></i>
                        <span className="admin-tooltip">Admin</span>
                      </div>
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  {/* Welcome Message with Animation */}
                  <li className="nav-item">
                    <div className="welcome-user">
                      <div className="user-avatar">
                        <i className="bi bi-person-circle"></i>
                      </div>
                      <span className="welcome-text">
                        Hi, <span className="username-highlight">{username}</span>
                      </span>
                      <div className="user-status-dot"></div>
                    </div>
                  </li>

                  {/* Role-based Navigation */}
                  {role === "admin" && (
                    <li className="nav-item">
                      <Link 
                        className={`nav-link nav-link-animated admin-link ${isActive('/admin-dashboard') ? 'active' : ''}`} 
                        to="/admin-dashboard"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <i className="bi bi-person-gear me-2"></i>
                        Admin Panel
                        <div className="nav-link-underline admin-underline"></div>
                      </Link>
                    </li>
                  )}

                  {role === "employee" && (
                    <li className="nav-item">
                      <Link 
                        className={`nav-link nav-link-animated employee-link ${isActive('/employee-dashboard') ? 'active' : ''}`} 
                        to="/employee-dashboard"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <i className="bi bi-briefcase me-2"></i>
                        Employee Panel
                        <div className="nav-link-underline employee-underline"></div>
                      </Link>
                    </li>
                  )}

                  {role === "user" && (
                    <li className="nav-item">
                      <Link 
                        className={`nav-link nav-link-animated user-link ${isActive('/') ? 'active' : ''}`} 
                        to="/"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <i className="bi bi-house me-2"></i>
                        Home
                        <div className="nav-link-underline user-underline"></div>
                      </Link>
                    </li>
                  )}

                  {/* Animated Logout Button */}
                  <li className="nav-item">
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="btn btn-logout-animated"
                    >
                      <span className="btn-content">
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Logout
                      </span>
                      <div className="btn-hover-effect"></div>
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Navbar Background Effect */}
        <div className="navbar-bg-effect"></div>
      </nav>

      {/* Navbar Spacer */}
      <div className="navbar-spacer"></div>

      {/* Enhanced CSS Styles */}
      <style jsx>{`
        /* Navbar Base Styles */
        .navbar {
          padding: 1rem 0;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          backdrop-filter: blur(20px);
          z-index: 1050;
          position: relative;
        }

        .navbar-transparent {
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        }

        .navbar-scrolled {
          background: rgba(255, 255, 255, 0.98);
          padding: 0.5rem 0;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.15);
        }

        .navbar-bg-effect {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .navbar-scrolled .navbar-bg-effect {
          opacity: 1;
        }

        .navbar-spacer {
          height: 80px;
        }

        /* Animated Logo */
        .logo-animated {
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .logo-container {
          display: flex;
          align-items: center;
          position: relative;
          padding: 0.5rem 0;
        }

        .logo-icon {
          font-size: 2rem;
          background: linear-gradient(45deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-right: 0.5rem;
          animation: logoIconPulse 2s ease-in-out infinite;
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: 800;
          background: linear-gradient(45deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          position: relative;
        }

        .logo-underline {
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 3px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        .logo-animated:hover .logo-underline {
          width: 100%;
        }

        .logo-animated:hover {
          transform: translateY(-2px);
        }

        /* Custom Hamburger Menu */
        .custom-toggler {
          border: none;
          background: none;
          padding: 0.5rem;
          position: relative;
          width: 30px;
          height: 30px;
          cursor: pointer;
        }

        .toggler-line {
          display: block;
          height: 3px;
          width: 25px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          margin: 5px 0;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          border-radius: 2px;
        }

        .custom-toggler.active .line1 {
          transform: rotate(45deg) translate(5px, 8px);
        }

        .custom-toggler.active .line2 {
          opacity: 0;
          transform: translateX(-20px);
        }

        .custom-toggler.active .line3 {
          transform: rotate(-45deg) translate(5px, -8px);
        }

        /* Navigation Links */
        .nav-link-animated {
          position: relative;
          color: #555 !important;
          font-weight: 600;
          padding: 0.7rem 1.2rem !important;
          border-radius: 25px;
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .nav-link-animated:hover {
          color: #667eea !important;
          background: rgba(102, 126, 234, 0.1);
          transform: translateY(-2px);
        }

        .nav-link-animated.active {
          color: #667eea !important;
          background: rgba(102, 126, 234, 0.15);
        }

        .nav-link-underline {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          background: #667eea;
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        .nav-link-animated:hover .nav-link-underline,
        .nav-link-animated.active .nav-link-underline {
          width: 80%;
        }

        /* Admin Icon Link Styles */
        .admin-icon-link {
          text-decoration: none;
          padding: 0.5rem !important;
          margin-left: 0.5rem;
          border-radius: 50%;
          transition: all 0.3s ease;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .admin-icon-container {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .admin-icon {
          font-size: 1.8rem;
          color: #dc3545;
          transition: all 0.3s ease;
          padding: 0.8rem;
          background: rgba(220, 53, 69, 0.1);
          border-radius: 50%;
          border: 2px solid transparent;
        }

        .admin-tooltip {
          font-size: 0.7rem;
          font-weight: 600;
          color: #dc3545;
          margin-top: 0.2rem;
          opacity: 0.8;
          transition: all 0.3s ease;
        }

        .admin-icon-link:hover .admin-icon {
          color: white;
          background: linear-gradient(135deg, #dc3545, #e74c3c);
          transform: scale(1.1) rotate(10deg);
          border-color: #dc3545;
          box-shadow: 0 8px 25px rgba(220, 53, 69, 0.4);
        }

        .admin-icon-link:hover .admin-tooltip {
          color: #dc3545;
          opacity: 1;
          transform: translateY(-2px);
        }

        .admin-icon-link.active .admin-icon {
          color: white;
          background: linear-gradient(135deg, #dc3545, #e74c3c);
          animation: adminIconPulse 2s ease-in-out infinite;
        }

        @keyframes adminIconPulse {
          0%, 100% { 
            transform: scale(1); 
            box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7);
          }
          50% { 
            transform: scale(1.05); 
            box-shadow: 0 0 0 10px rgba(220, 53, 69, 0);
          }
        }

        /* Role-specific link colors */
        .admin-link:hover {
          color: #dc3545 !important;
          background: rgba(220, 53, 69, 0.1);
        }

        .admin-underline {
          background: #dc3545;
        }

        /* Special Admin Icon Animation */
        .admin-link .bi-person-gear {
          transition: all 0.3s ease;
        }

        .admin-link:hover .bi-person-gear {
          transform: rotate(15deg);
          color: #dc3545 !important;
        }

        .admin-link.active .bi-person-gear {
          animation: adminIconSpin 2s ease-in-out infinite;
          color: #dc3545 !important;
        }

        @keyframes adminIconSpin {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(5deg); }
          50% { transform: rotate(10deg); }
          75% { transform: rotate(5deg); }
        }

        .employee-link:hover {
          color: #17a2b8 !important;
          background: rgba(23, 162, 184, 0.1);
        }

        .employee-underline {
          background: #17a2b8;
        }

        .user-link:hover {
          color: #28a745 !important;
          background: rgba(40, 167, 69, 0.1);
        }

        .user-underline {
          background: #28a745;
        }

        /* Animated Sign Up Button */
        .btn-signup-animated {
          background: linear-gradient(45deg, #28a745, #20c997) !important;
          color: white !important;
          font-weight: 600;
          padding: 0.7rem 1.5rem !important;
          border-radius: 25px;
          margin-left: 1rem;
          position: relative;
          overflow: hidden;
          border: none;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .btn-signup-animated:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(40, 167, 69, 0.4);
          color: white !important;
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

        .btn-signup-animated:active .btn-ripple {
          width: 300px;
          height: 300px;
        }

        /* Welcome User Animation */
        .welcome-user {
          display: flex;
          align-items: center;
          background: rgba(102, 126, 234, 0.1);
          padding: 0.5rem 1rem;
          border-radius: 25px;
          margin-right: 1rem;
          position: relative;
          animation: welcomeSlideIn 0.8s ease-out;
        }

        .user-avatar {
          font-size: 1.5rem;
          color: #667eea;
          margin-right: 0.5rem;
          animation: avatarBounce 2s ease-in-out infinite;
        }

        .welcome-text {
          color: #555;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .username-highlight {
          color: #667eea;
          font-weight: 700;
        }

        .user-status-dot {
          width: 8px;
          height: 8px;
          background: #28a745;
          border-radius: 50%;
          margin-left: 0.5rem;
          animation: statusPulse 2s ease-in-out infinite;
        }

        /* Animated Logout Button */
        .btn-logout-animated {
          background: linear-gradient(45deg, #dc3545, #e74c3c);
          color: white;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 25px;
          font-weight: 600;
          margin-left: 1rem;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .btn-logout-animated:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(220, 53, 69, 0.4);
          color: white;
        }

        .btn-content {
          position: relative;
          z-index: 2;
        }

        .btn-hover-effect {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s ease;
        }

        .btn-logout-animated:hover .btn-hover-effect {
          left: 100%;
        }

        /* Mobile Responsive */
        @media (max-width: 991.98px) {
          .navbar-collapse {
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            border-radius: 15px;
            padding: 1rem;
            margin-top: 1rem;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            animation: mobileMenuSlide 0.3s ease-out;
          }

          .welcome-user {
            margin: 0.5rem 0;
            justify-content: center;
          }

          .btn-signup-animated,
          .btn-logout-animated {
            margin: 0.5rem 0;
            display: block;
            text-align: center;
          }

          .nav-link-animated {
            text-align: center;
            margin: 0.2rem 0;
          }

          .admin-icon-link {
            margin: 0.5rem 0;
            justify-content: center;
          }

          .admin-tooltip {
            font-size: 0.8rem;
          }
        }

        /* Keyframe Animations */
        @keyframes logoIconPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes welcomeSlideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes avatarBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        @keyframes statusPulse {
          0%, 100% { 
            opacity: 1;
            transform: scale(1);
          }
          50% { 
            opacity: 0.5;
            transform: scale(1.2);
          }
        }

        @keyframes mobileMenuSlide {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Hover Effects */
        .navbar-nav .nav-item {
          margin: 0 0.2rem;
        }

        .transition-all {
          transition: all 0.3s ease;
        }

        /* Custom scrollbar for mobile menu */
        .navbar-collapse::-webkit-scrollbar {
          width: 4px;
        }

        .navbar-collapse::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.1);
          border-radius: 2px;
        }

        .navbar-collapse::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #667eea, #764ba2);
          border-radius: 2px;
        }
      `}</style>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" />
    </>
  );
};

export default Navbar;
