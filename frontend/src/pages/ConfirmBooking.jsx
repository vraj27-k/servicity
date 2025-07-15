import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AhmedabadMap from './components/AhmedabadMap';

const ConfirmBooking = () => {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    date: '',
    time: ''
  });
  const [latLng, setLatLng] = useState(null);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart_services")) || [];

    const fetchServiceDetails = async () => {
      const updated = await Promise.all(
        cart.map(async item => {
          const res = await axios.get(`http://localhost:8000/api/services/${item.service_id}/`);
          return {
            ...res.data,
            selectedSubservices: item.subservices
          };
        })
      );
      setServices(updated);
    };

    fetchServiceDetails();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLocationSelect = (lat, lng, fullAddress) => {
    setLatLng({ lat, lng });
    setFormData(prev => ({ ...prev, address: fullAddress }));
  };

  const removeService = (serviceId) => {
    const updatedServices = services.filter(s => s.id !== serviceId);
    setServices(updatedServices);

    const cart = JSON.parse(localStorage.getItem("cart_services")) || [];
    const newCart = cart.filter(item => item.service_id !== serviceId);
    localStorage.setItem("cart_services", JSON.stringify(newCart));
  };

  const removeSubservice = (serviceId, subId) => {
    const updated = services.map(service => {
      if (service.id === serviceId) {
        return {
          ...service,
          selectedSubservices: service.selectedSubservices.filter(id => id !== subId)
        };
      }
      return service;
    });
    setServices(updated);

    const cart = JSON.parse(localStorage.getItem("cart_services")) || [];
    const newCart = cart.map(item => {
      if (item.service_id === serviceId) {
        return {
          ...item,
          subservices: item.subservices.filter(id => id !== subId)
        };
      }
      return item;
    });
    localStorage.setItem("cart_services", JSON.stringify(newCart));
  };

  const handleBooking = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("Please log in first.");
      return navigate("/login");
    }

    const { name, phone, address, date, time } = formData;
    if (!name || !phone || !address || !date || !time) {
      return alert("Please fill all required fields.");
    }

    try {
      for (let service of services) {
        await axios.post("http://localhost:8000/api/bookings/", {
          user: userId,
          service: service.id,
          subservices: service.selectedSubservices,
          ...formData,
          latitude: latLng?.lat,
          longitude: latLng?.lng,
        });
      }

      localStorage.removeItem("cart_services");
      alert("✅ Booking Confirmed!");
      navigate("/my-bookings");
    } catch (err) {
      console.error(err);
      alert("Booking failed");
    }
  };

  const getTotalForService = (service) => {
    const base = parseFloat(service.price || 0);
    const extras = service.grouped_subservices
      .flatMap(g => g.items)
      .filter(sub => service.selectedSubservices.includes(sub.id))
      .reduce((sum, sub) => sum + parseFloat(sub.price), 0);
    return base + extras;
  };

  const getGrandTotal = () => {
    return services.reduce((total, s) => total + getTotalForService(s), 0);
  };

  return (
    <div className="container py-4">
      <div className="row">
        {/* LEFT SIDE FORM */}
        <div className="col-md-8">
          <h3 className="mb-3">Confirm Your Booking</h3>

          <input
            name="name"
            placeholder="Name"
            className="form-control mb-2"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            name="phone"
            placeholder="Phone"
            className="form-control mb-2"
            value={formData.phone}
            onChange={handleChange}
          />

          <AhmedabadMap onLocationSelect={handleLocationSelect} />

          <textarea
            name="address"
            placeholder="Address"
            className="form-control mb-2"
            value={formData.address}
            onChange={handleChange}
          />

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

          <button className="btn btn-primary mt-2" onClick={handleBooking}>
            ✅ Confirm All Bookings
          </button>
        </div>

        {/* RIGHT SIDE - CART */}
        <div className="col-md-4">
          <div className="card p-3 shadow-sm">
            <h5 className="fw-bold text-success">Cart Summary</h5>

            {services.length === 0 ? (
              <p className="text-muted">No services selected</p>
            ) : (
              services.map(service => {
                const selectedSubs = service.grouped_subservices
                  .flatMap(g => g.items)
                  .filter(sub => service.selectedSubservices.includes(sub.id));

                return (
                  <div key={service.id} className="border-bottom mb-3 pb-2">
                    <div className="d-flex justify-content-between">
                      <strong>{service.name}</strong>
                    </div>
                    <ul className="ps-3 small">
                      {selectedSubs.map(sub => (
                        <li key={sub.id}>
                          {sub.title} – ₹{sub.price}
                          <button
                            className="btn btn-sm btn-link text-danger"
                            onClick={() => removeSubservice(service.id, sub.id)}
                          >
                            ❌
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div>Total: ₹{getTotalForService(service).toFixed(2)}</div>
                  </div>
                );
              })
            )}

            {services.length > 0 && (
              <>
                <hr />
                <h6>Grand Total: ₹{getGrandTotal().toFixed(2)}</h6>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmBooking;
