import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'user' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/register/', form);
      alert("Signup successful");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Signup failed. Please check console for errors.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white text-center">
              <h4>Signup</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input
                    name="username"
                    className="form-control"
                    placeholder="Enter username"
                    value={form.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    name="email"
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    name="password"
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <select
                    name="role"
                    className="form-select"
                    value={form.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="employee">Employee</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary w-100">Signup</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
