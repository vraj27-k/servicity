import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AhmedabadMap from './components/AhmedabadMap';
import './ConfirmBooking.css'; // Move CSS to external file

const ConfirmBooking = React.memo(() => {
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
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  // Animation on mount
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart_services")) || [];

    const fetchServiceDetails = async () => {
      try {
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
      } catch (error) {
        console.error("Failed to fetch services:", error);
      }
    };

    fetchServiceDetails();
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handleLocationSelect = useCallback((lat, lng, fullAddress) => {
    setLatLng({ lat, lng });
    setFormData(prev => ({ ...prev, address: fullAddress }));
    if (errors.address) {
      setErrors(prev => ({ ...prev, address: '' }));
    }
  }, [errors.address]);

  const removeService = useCallback((serviceId) => {
    setServices(prev => prev.filter(s => s.id !== serviceId));

    const cart = JSON.parse(localStorage.getItem("cart_services")) || [];
    const newCart = cart.filter(item => item.service_id !== serviceId);
    localStorage.setItem("cart_services", JSON.stringify(newCart));
  }, []);

  const removeSubservice = useCallback((serviceId, subId) => {
    setServices(prev => prev.map(service => {
      if (service.id === serviceId) {
        return {
          ...service,
          selectedSubservices: service.selectedSubservices.filter(id => id !== subId)
        };
      }
      return service;
    }));

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
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = 'Please select a future date';
      }
    }
    
    if (!formData.time) {
      newErrors.time = 'Time is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBooking = async () => {
    if (!validateForm()) return;

    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("Please log in to continue.");
      navigate('/login');
      return;
    }

    if (services.length === 0) {
      alert("No services selected for booking.");
      return;
    }

    setLoading(true);

    try {
      const createdBookings = [];

      for (let service of services) {
        const response = await axios.post(
          "http://localhost:8000/api/bookings/",
          {
            service: service.id,
            subservices: service.selectedSubservices,
            user: userId,
            ...formData,
            latitude: latLng?.lat,
            longitude: latLng?.lng,
          }
        );
        createdBookings.push(response.data);
      }

      localStorage.removeItem("cart_services");

      if (createdBookings.length > 0) {
        const lastBooking = createdBookings[createdBookings.length - 1];
        navigate(`/payment/deposit/${lastBooking.id}`, {
          state: {
            total: getGrandTotal(),
            bookingId: lastBooking.id,
            bookingDetails: lastBooking
          }
        });
      }
    } catch (err) {
      console.error("Booking failed", err.response || err);
      alert(`Booking failed: ${err.response?.data?.detail || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  // Memoized calculations
  const { getTotalForService, getGrandTotal } = useMemo(() => {
    const getTotalForService = (service) => {
      const base = parseFloat(service.price || 0);
      const extras = service.grouped_subservices
        ?.flatMap(g => g.items)
        ?.filter(sub => service.selectedSubservices.includes(sub.id))
        ?.reduce((sum, sub) => sum + parseFloat(sub.price), 0) || 0;
      return base + extras;
    };

    const getGrandTotal = () => {
      return services.reduce((total, s) => total + getTotalForService(s), 0);
    };

    return { getTotalForService, getGrandTotal };
  }, [services]);

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="confirm-booking-page">
      <div className="container py-5">
        {/* Page Header - Fixed Layout */}
        <div className={`page-header text-center mb-5 ${isVisible ? 'animate-fade-in' : ''}`}>
          <div className="header-content">
            <div className="header-icon">
              <i className="bi bi-calendar-check"></i>
            </div>
            <h1 className="page-title display-4 fw-bold mb-3">
              Confirm Your <span className="gradient-text">Booking</span>
            </h1>
            <p className="page-subtitle lead text-muted">
              Complete your service booking with just a few details
            </p>
          </div>
        </div>

        <div className="row g-4">
          {/* Left Form Section - Fixed Layout */}
          <div className="col-lg-8">
            <div className={`booking-form-section ${isVisible ? 'animate-slide-up' : ''}`}>
              <div className="form-card">
                {/* Card Header */}
                <div className="form-card-header">
                  <h3 className="form-title">
                    <i className="bi bi-person-lines-fill me-2"></i>
                    Booking Details
                  </h3>
                  <p className="form-subtitle">Please provide your information and preferences</p>
                </div>

                {/* Form Body */}
                <div className="form-card-body">
                  <form className="booking-form">
                    {/* Personal Information Section */}
                    <div className="form-section">
                      <h5 className="section-title">
                        <i className="bi bi-person text-primary me-2"></i>
                        Personal Information
                      </h5>
                      
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="form-group">
                            <div className="input-container">
                              <div className="input-icon">
                                <i className="bi bi-person"></i>
                              </div>
                              <input
                                name="name"
                                type="text"
                                placeholder="Full Name"
                                className={`form-control form-input ${errors.name ? 'is-invalid' : ''}`}
                                value={formData.name}
                                onChange={handleChange}
                                required
                              />
                              <div className="input-underline"></div>
                            </div>
                            {errors.name && (
                              <div className="error-text">
                                <i className="bi bi-exclamation-circle me-1"></i>
                                {errors.name}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <div className="input-container">
                              <div className="input-icon">
                                <i className="bi bi-telephone"></i>
                              </div>
                              <input
                                name="phone"
                                type="tel"
                                placeholder="Phone Number"
                                className={`form-control form-input ${errors.phone ? 'is-invalid' : ''}`}
                                value={formData.phone}
                                onChange={handleChange}
                                required
                              />
                              <div className="input-underline"></div>
                            </div>
                            {errors.phone && (
                              <div className="error-text">
                                <i className="bi bi-exclamation-circle me-1"></i>
                                {errors.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Location Section */}
                    <div className="form-section">
                      <h5 className="section-title">
                        <i className="bi bi-geo-alt text-primary me-2"></i>
                        Service Location
                      </h5>
                      
                      <div className="map-section mb-3">
                        <div className="map-container">
                          <AhmedabadMap onLocationSelect={handleLocationSelect} />
                        </div>
                      </div>

                      <div className="form-group">
                        <div className="input-container">
                          <div className="input-icon">
                            <i className="bi bi-house"></i>
                          </div>
                          <textarea
                            name="address"
                            placeholder="Complete Address (House/Flat No., Area, Landmarks)"
                            className={`form-control form-textarea ${errors.address ? 'is-invalid' : ''}`}
                            value={formData.address}
                            onChange={handleChange}
                            rows="3"
                            required
                          />
                          <div className="input-underline"></div>
                        </div>
                        {errors.address && (
                          <div className="error-text">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {errors.address}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Schedule Section */}
                    <div className="form-section">
                      <h5 className="section-title">
                        <i className="bi bi-calendar-event text-primary me-2"></i>
                        Schedule Service
                      </h5>
                      
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label">Preferred Date</label>
                            <div className="input-container">
                              <div className="input-icon">
                                <i className="bi bi-calendar3"></i>
                              </div>
                              <input
                                type="date"
                                name="date"
                                className={`form-control form-input ${errors.date ? 'is-invalid' : ''}`}
                                value={formData.date}
                                onChange={handleChange}
                                min={getMinDate()}
                                required
                              />
                              <div className="input-underline"></div>
                            </div>
                            {errors.date && (
                              <div className="error-text">
                                <i className="bi bi-exclamation-circle me-1"></i>
                                {errors.date}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label">Preferred Time</label>
                            <div className="input-container">
                              <div className="input-icon">
                                <i className="bi bi-clock"></i>
                              </div>
                              <input
                                type="time"
                                name="time"
                                className={`form-control form-input ${errors.time ? 'is-invalid' : ''}`}
                                value={formData.time}
                                onChange={handleChange}
                                required
                              />
                              <div className="input-underline"></div>
                            </div>
                            {errors.time && (
                              <div className="error-text">
                                <i className="bi bi-exclamation-circle me-1"></i>
                                {errors.time}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Confirm Button */}
                    <div className="form-actions text-center">
                      <button 
                        type="button" 
                        className="btn btn-confirm-booking" 
                        onClick={handleBooking}
                        disabled={loading || services.length === 0}
                      >
                        {loading ? (
                          <>
                            <div className="spinner-border spinner-border-sm me-2" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-2"></i>
                            Confirm All Bookings
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Right Cart Section - Fixed Layout */}
          <div className="col-lg-4">
            <div className={`cart-section ${isVisible ? 'animate-slide-left' : ''}`}>
              <div className="cart-summary sticky-top">
                <div className="cart-card">
                  {/* Cart Header */}
                  <div className="cart-header">
                    <h5 className="cart-title">
                      <i className="bi bi-cart3 me-2"></i>
                      Cart Summary
                    </h5>
                    <div className="cart-badge">
                      {services.length} {services.length === 1 ? 'Service' : 'Services'}
                    </div>
                  </div>

                  {/* Cart Content */}
                  <div className="cart-content">
                    {services.length === 0 ? (
                      <div className="empty-cart-state">
                        <div className="empty-cart-icon">
                          <i className="bi bi-cart-x"></i>
                        </div>
                        <p className="empty-cart-text">No services selected</p>
                        <button 
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => navigate('/services')}
                        >
                          <i className="bi bi-plus me-1"></i>
                          Browse Services
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* Cart Items */}
                        <div className="cart-items">
                          {services.map((service, index) => {
                            const selectedSubs = service.grouped_subservices
                              ?.flatMap(g => g.items)
                              ?.filter(sub => service.selectedSubservices.includes(sub.id)) || [];

                            return (
                              <div 
                                key={service.id} 
                                className={`cart-item ${isVisible ? 'animate-fade-in-item' : ''}`} 
                                style={{animationDelay: `${index * 0.1}s`}}
                              >
                                <div className="cart-item-header">
                                  <h6 className="item-name">{service.name}</h6>
                                  <button
                                    className="btn btn-remove-service"
                                    onClick={() => removeService(service.id)}
                                    title="Remove service"
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                </div>

                                {selectedSubs.length > 0 && (
                                  <div className="cart-item-subservices">
                                    {selectedSubs.map(sub => (
                                      <div key={sub.id} className="subservice-item">
                                        <div className="subservice-details">
                                          <span className="subservice-name">{sub.title}</span>
                                          <span className="subservice-price">₹{sub.price}</span>
                                        </div>
                                        <button
                                          className="btn btn-remove-subservice"
                                          onClick={() => removeSubservice(service.id, sub.id)}
                                          title="Remove item"
                                        >
                                          <i className="bi bi-x"></i>
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                <div className="cart-item-total">
                                  <strong>Service Total: ₹{getTotalForService(service).toFixed(2)}</strong>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Cart Footer */}
                        <div className="cart-footer">
                          <div className="grand-total-section">
                            <div className="grand-total-row">
                              <span className="grand-total-label">Grand Total</span>
                              <span className="grand-total-amount">₹{getGrandTotal().toFixed(2)}</span>
                            </div>
                            <div className="total-note">
                              <i className="bi bi-info-circle me-1"></i>
                              Includes all selected services
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ConfirmBooking;
