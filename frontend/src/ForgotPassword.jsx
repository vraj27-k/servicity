// src/ForgotPassword.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    new_password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8000/api/forgot-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(data.error || "Failed to reset password.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error. Please try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <div className="card shadow p-4 w-100" style={{ maxWidth: "450px" }}>
        <h2 className="text-center text-primary mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              placeholder="Registered Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              name="new_password"
              placeholder="New Password"
              value={formData.new_password}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Reset Password
          </button>
        </form>

        {message && (
          <div className="alert alert-success text-center mt-3 py-2 small" role="alert">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
