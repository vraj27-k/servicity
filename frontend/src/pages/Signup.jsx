// src/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user", // default
  });

  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const response = await fetch("http://localhost:8000/api/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const text = await response.text(); // Try parsing response manually

      try {
        const data = JSON.parse(text); // Try parsing as JSON

        if (response.ok) {
          alert("✅ Signup successful! Please log in.");
          navigate("/login");
        } else {
          if (data.username) {
            setErrorMsg("❌ Username: " + data.username);
          } else if (data.email) {
            setErrorMsg("❌ Email: " + data.email);
          } else {
            setErrorMsg("❌ Signup failed. Try again.");
          }
        }
      } catch (jsonErr) {
        console.error("❌ Non-JSON response received:", text);
        setErrorMsg("❌ Server error. Please check your backend logs.");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      setErrorMsg("❌ Unable to connect to the server.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="d-flex justify-content-center align-items-center mt-5">
        <div className="card shadow p-4 w-100" style={{ maxWidth: "450px" }}>
          <h2 className="text-center text-success mb-4">Create Account</h2>

          {errorMsg && (
            <div className="alert alert-danger text-center small py-2">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSignup}>
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
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
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

            <div className="mb-3">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="user">User</option>
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button type="submit" className="btn btn-success w-100">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
