// src/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await axios.post("http://localhost:8000/api/login/", formData);

      // ✅ Save session info
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("user_id", res.data.user_id);

      // ✅ Redirect after login
      const redirectTo = localStorage.getItem("redirect_after_login");
      if (redirectTo) {
        localStorage.removeItem("redirect_after_login");
        navigate(redirectTo);
      } else {
        const role = res.data.role;
        if (role === "admin") navigate("/admin-dashboard");
        else if (role === "employee") navigate("/employee-dashboard");
        else navigate("/"); // regular user
      }
    } catch (err) {
      const msg = err.response?.data?.error || "Invalid credentials";
      setErrorMsg("❌ " + msg);
    }
  };

  return (
    <>
      <Navbar />
      <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
        <div className="card shadow-sm p-4" style={{ maxWidth: "400px", width: "100%" }}>
          <h2 className="text-center text-primary mb-4">Login</h2>

          {errorMsg && (
            <div className="alert alert-danger text-center py-2 small">{errorMsg}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>

          <p className="text-center mt-4 mb-1 small">
            New user?{" "}
            <Link to="/signup" className="text-decoration-none text-primary fw-medium">
              Sign up here
            </Link>
          </p>
          <p className="text-center small">
            <Link to="/forgot-password" className="text-decoration-none text-primary">
              Forgot Password?
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
