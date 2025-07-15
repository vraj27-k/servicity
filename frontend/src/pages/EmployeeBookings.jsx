import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EmployeeBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/bookings/my-assignments/', {
          headers: {
            // Replace with your token logic if needed
          }
        });
        setBookings(res.data);
      } catch (err) {
        console.error("Failed to fetch assigned bookings", err);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="container py-4">
      <h3 className="mb-4">📦 Assigned Bookings</h3>
      {bookings.length === 0 ? (
        <p>No bookings assigned.</p>
      ) : (
        <div className="list-group">
          {bookings.map(b => (
            <div key={b.id} className="list-group-item mb-2 shadow-sm">
              <h5>{b.service_name}</h5>
              <p><strong>Client:</strong> {b.name} | 📞 {b.phone}</p>
              <p><strong>Address:</strong> {b.address}</p>
              <p><strong>Date:</strong> {b.date} | ⏰ {b.time}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeBookings;
