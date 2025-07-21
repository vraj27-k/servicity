import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  // Input change handler
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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

      // Check user role
      if (role === "employee") {
        const profileRes = await axios.get("http://127.0.0.1:8000/api/employee/profile-status/", {
          headers: {
            Authorization: `Bearer ${access}`
          }
        });

        const isComplete = profileRes.data.profile_complete;
        if (!isComplete) {
          navigate("/employee/setup");
        } else {
          navigate("/employee/dashboard");
        }
      } else if (role === "admin") {
        navigate("/admin-dashboard");
      } else {
        // ✅ Check if redirect was stored before login
        const redirectPath = localStorage.getItem("redirect_after_login");
        if (redirectPath) {
          localStorage.removeItem("redirect_after_login");
          navigate(redirectPath);
        } else {
          navigate("/");
        }
      }

    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        alert("Invalid username or password.");
      } else {
        alert("Server error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-5" style={{ maxWidth: "400px" }}>
      <h3 className="text-center mb-4">Login</h3>

      <div className="mb-3">
        <input
          className="form-control"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <input
          className="form-control"
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary w-100" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default Login;
