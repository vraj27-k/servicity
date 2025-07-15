import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AhmedabadMap from './components/AhmedabadMap';

const ConfirmBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [selected, setSelected] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    date: '',
    time: ''
  });
  const [latLng, setLatLng] = useState(null);

  // Fetch service and selected subservices
  useEffect(() => {
    axios.get(`http://localhost:8000/api/services/${id}/`)
      .then(res => {
        setService(res.data);

        // ✅ Load selected subservice IDs from localStorage
        const stored = localStorage.getItem("selected_subservices");
        const parsed = stored ? JSON.parse(stored) : [];
        setSelected(parsed);
      })
      .catch(err => console.error("Error loading service", err));
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLocationSelect = (lat, lng, fullAddress) => {
    setLatLng({ lat, lng });
    setFormData(prev => ({ ...prev, address: fullAddress }));
  };

  const handleBooking = () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("Please log in first.");
      localStorage.setItem("redirect_after_login", window.location.pathname);
      return navigate("/login");
    }

    const { name, phone, address, date, time } = formData;
    if (!name || !phone || !address || !date || !time) {
      alert("Please fill all required fields.");
      return;
    }

    axios.post('http://localhost:8000/api/bookings/', {
      user: userId,
      service: service.id,
      subservices: selected,
      ...formData,
      latitude: latLng?.lat,
      longitude: latLng?.lng,
    })
    .then(() => {
      alert("🎉 Booking confirmed!");

      // ✅ Keep cart data (do not clear subservices)
      // ❌ localStorage.removeItem("selected_subservices");

      navigate("/my-bookings");
    })
    .catch(err => {
      console.error("Booking failed", err);
      alert("Something went wrong while booking.");
    });
  };

  if (!service) return <p className="text-center mt-5">Loading service details...</p>;

  // Get selected subservice objects
  const basePrice = parseFloat(service.price || 0);
  const selectedSubs = service.grouped_subservices
    .flatMap(group => group.items)
    .filter(sub => selected.includes(sub.id));
  const subTotal = selectedSubs.reduce((sum, sub) => sum + parseFloat(sub.price), 0);
  const total = basePrice + subTotal;

  return (
    <div className="container py-4">
      <div className="row">
        {/* LEFT SIDE - FORM */}
        <div className="col-md-8">
          <h3 className="mb-3">Confirm Your Booking</h3>

          <div className="mb-3">
            <input
              type="text"
              name="name"
              className="form-control mb-2"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              type="tel"
              name="phone"
              className="form-control mb-2"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />

            {/* 📍 Map Component */}
            <AhmedabadMap onLocationSelect={handleLocationSelect} />

            {formData.address && (
              <p className="text-success small mt-2">
                📍 Selected Address: {formData.address}
              </p>
            )}

            {!formData.address && (
              <textarea
                name="address"
                rows="3"
                className="form-control mb-2"
                placeholder="Enter your full address"
                value={formData.address}
                onChange={handleChange}
              />
            )}

            <div className="row">
              <div className="col-md-6">
                <input
                  type="date"
                  name="date"
                  className="form-control mb-2"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <input
                  type="time"
                  name="time"
                  className="form-control mb-2"
                  value={formData.time}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="d-flex gap-2 mt-3">
              <button className="btn btn-primary" onClick={handleBooking}>
                Confirm Booking
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Cart Summary */}
        <div className="col-md-4">
          <div className="card p-3 shadow-sm">
            <h5 className="text-success fw-bold">Cart Summary</h5>
            <p>Base Price: ₹{basePrice}</p>

            {selectedSubs.length > 0 ? (
              <>
                <p><strong>Selected Extras:</strong></p>
                <ul className="list-unstyled ps-2">
                  {selectedSubs.map(sub => (
                    <li key={sub.id} className="d-flex justify-content-between align-items-center">
                      <span>{sub.title}</span>
                      <span>₹{sub.price}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-muted small">No extras selected</p>
            )}

            <hr />
            <h6>Total: ₹{total.toFixed(2)}</h6>
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate("/services")}
            >
              Add More Services
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmBooking;
