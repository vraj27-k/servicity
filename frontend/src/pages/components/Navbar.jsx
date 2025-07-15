// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
      <div className="container">
        {/* Logo / Brand */}
        <Link className="navbar-brand fw-bold text-primary" to="/">
          ServiCity
        </Link>

        {/* Hamburger menu for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation links */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarContent">
          <ul className="navbar-nav mb-2 mb-lg-0 align-items-center">
            {!username ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-primary" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-success" to="/signup">
                    Signup
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <span className="nav-link text-dark fw-semibold">
                    Hi, {username}
                  </span>
                </li>

                {role === "admin" && (
                  <li className="nav-item">
                    <Link className="nav-link text-primary" to="/admin-dashboard">
                      Admin Panel
                    </Link>
                  </li>
                )}
                {role === "employee" && (
                  <li className="nav-item">
                    <Link className="nav-link text-info" to="/employee-dashboard">
                      Employee Panel
                    </Link>
                  </li>
                )}
                {role === "user" && (
                  <li className="nav-item">
                    <Link className="nav-link text-primary" to="/">
                      Home
                    </Link>
                  </li>
                )}

                <li className="nav-item">
                  <button
                    onClick={logout}
                    className="btn btn-sm btn-outline-danger ms-3"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
