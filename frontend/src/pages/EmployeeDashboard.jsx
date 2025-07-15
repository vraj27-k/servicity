// src/pages/EmployeeDashboard.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";

const EmployeeDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token"); // optional if you're using token auth

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/employee/bookings/", {
        headers: {
          // optional auth
          // Authorization: `Token ${token}`
        },
      })
      .then((res) => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching employee bookings:", err);
        setLoading(false);
      });
  }, []);

  const updateStatus = (id, status) => {
    axios
      .post(`http://localhost:8000/api/employee/bookings/${id}/update_status/`, { status })
      .then(() => {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status } : b))
        );
      })
      .catch((err) => {
        alert("Failed to update status");
        console.error(err);
      });
  };

  if (loading) {
    return <div className="text-center mt-5">Loading assigned bookings...</div>;
  }

  return (
    <div className="container py-4">
      <h3 className="mb-4">📋 Assigned Bookings</h3>
      {bookings.length === 0 ? (
        <p className="text-muted">No bookings assigned yet.</p>
      ) : (
        bookings.map((booking) => (
          <div key={booking.id} className="card mb-3 p-3">
            <h5>{booking.service}</h5>
            <p>
              <strong>Name:</strong> {booking.name} <br />
              <strong>Phone:</strong> {booking.phone} <br />
              <strong>Address:</strong> {booking.address}
            </p>
            <p>
              <strong>Date:</strong> {booking.date} | <strong>Time:</strong> {booking.time}
            </p>
            <p>Status: <strong>{booking.status}</strong></p>
            <div className="d-flex gap-2">
              {["Accepted", "Completed", "Cancelled"].map((s) => (
                <button
                  key={s}
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => updateStatus(booking.id, s)}
                >
                  Mark as {s}
                </button>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default EmployeeDashboard;
