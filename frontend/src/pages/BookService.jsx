import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BookService.css';

const BookService = React.memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [service, setService] = useState(null);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  // Add entrance animation
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/services/${id}/`)
      .then(res => {
        setService(res.data);
        setLoading(false);
        
        const cart = JSON.parse(localStorage.getItem("cart_services")) || [];
        const match = cart.find(item => item.service_id === parseInt(id));
        if (match) setSelected(match.subservices);
      })
      .catch(err => {
        console.error("Failed to fetch service", err);
        setLoading(false);
      });
  }, [id]);

  const toggleSubService = useCallback((subId) => {
    setSelected(prev =>
      prev.includes(subId) ? prev.filter(id => id !== subId) : [...prev, subId]
    );
  }, []);

  const confirmBookingStep = useCallback(() => {
    const userId = localStorage.getItem("user_id");
    
    if (!userId) {
      alert("Please login first.");
      localStorage.setItem("redirect_after_login", `/book/${id}`);
      navigate("/login");
      return;
    }

    if (!selected.length) {
      alert("Please select at least one sub-service.");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart_services")) || [];
    const existingIndex = cart.findIndex(item => item.service_id === parseInt(id));

    if (existingIndex !== -1) {
      cart[existingIndex].subservices = selected;
    } else {
      cart.push({
        service_id: parseInt(id),
        subservices: selected,
      });
    }

    localStorage.setItem("cart_services", JSON.stringify(cart));
    navigate(`/confirm-booking/${id}`);
  }, [id, selected, navigate]);

  const { basePrice, selectedSubs, subTotal, total } = useMemo(() => {
    if (!service) return { basePrice: 0, selectedSubs: [], subTotal: 0, total: 0 };
    
    const basePrice = parseFloat(service.price || 0);
    const selectedSubs = service.grouped_subservices?.flatMap(group => group.items)
      ?.filter(sub => selected.includes(sub.id)) || [];
    const subTotal = selectedSubs.reduce((sum, sub) => sum + parseFloat(sub.price), 0);
    const total = basePrice + subTotal;
    
    return { basePrice, selectedSubs, subTotal, total };
  }, [service, selected]);

  if (loading) {
    return (
      <div className="loading-page">
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner-border spinner-border-lg text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
          <h4 className="loading-text mt-3">Loading service details...</h4>
          <p className="loading-subtitle text-muted">Please wait while we fetch the information</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="error-page">
        <div className="error-container">
          <div className="text-center">
            <i className="bi bi-exclamation-triangle display-1 text-warning mb-3"></i>
            <h3 className="mb-3">Service not found</h3>
            <p className="text-muted mb-4">The service you're looking for doesn't exist or has been removed.</p>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/services')}>
              <i className="bi bi-arrow-left me-2"></i>
              Browse Services
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="book-service-page">
      <div className="container py-5">
        {/* Service Header - Fixed Layout */}
        <div className={`service-header text-center mb-5 ${isVisible ? 'animate-fade-in' : ''}`}>
          <div className="header-content">
            <h1 className="display-4 fw-bold mb-3 text-primary">{service.name}</h1>
            <div className="service-meta d-flex justify-content-center gap-4 align-items-center flex-wrap">
              <div className="meta-badge rating-badge">
                <i className="bi bi-star-fill text-warning"></i>
                <span className="ms-1">4.5</span>
              </div>
              <div className="meta-badge bookings-badge">
                <i className="bi bi-people-fill text-success"></i>
                <span className="ms-1">10.9M+ bookings</span>
              </div>
              <div className="meta-badge verified-badge">
                <i className="bi bi-patch-check-fill text-info"></i>
                <span className="ms-1">Verified</span>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Left Content - Fixed Layout */}
          <div className="col-lg-8">
            <div className={`left-content ${isVisible ? 'animate-slide-up' : ''}`}>
              
              

              {/* Description Card - Fixed Layout */}
              <div className="description-section mb-4">
                <div className="card description-card border-0 shadow-sm">
                  <div className="card-body p-4">
                    <h4 className="card-title d-flex align-items-center mb-3">
                      <i className="bi bi-info-circle text-primary me-2"></i>
                      About This Service
                    </h4>
                    <p className="card-text text-muted mb-4">{service.description}</p>
                    
                    <div className="service-features">
                      <div className="row g-3">
                        <div className="col-md-4">
                          <div className="feature-item">
                            <i className="bi bi-clock text-success"></i>
                            <span>Professional Service</span>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="feature-item">
                            <i className="bi bi-shield-check text-success"></i>
                            <span>100% Safe & Secure</span>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="feature-item">
                            <i className="bi bi-award text-success"></i>
                            <span>Quality Guaranteed</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Options - Fixed Layout */}
              <div className="service-options-section">
                {service.grouped_subservices?.map((group, groupIndex) => (
                  <div 
                    key={group.category} 
                    className={`service-group mb-5 ${isVisible ? 'animate-slide-up' : ''}`}
                    style={{animationDelay: `${groupIndex * 0.1}s`}}
                  >
                    <div className="group-header mb-4">
                      <h4 className="group-title fw-bold d-flex align-items-center">
                        <i className="bi bi-grid-3x3-gap text-primary me-2"></i>
                        {group.category}
                      </h4>
                      <p className="group-subtitle text-muted mb-0">
                        Choose from our professional {group.category.toLowerCase()} options
                      </p>
                    </div>

                    <div className="group-items">
                      <div className="row g-3">
                        {group.items.map((sub, itemIndex) => (
                          <div key={sub.id} className="col-md-6">
                            <div className={`sub-service-card ${selected.includes(sub.id) ? 'selected' : ''}`}>
                              <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body p-3">
                                  <div className="d-flex align-items-start">
                                    {/* Sub Service Image */}
                                    {sub.image_url && (
                                      <div className="sub-image-wrapper me-3 flex-shrink-0">
                                        <img
                                          src={sub.image_url}
                                          alt={sub.title}
                                          className="sub-image rounded"
                                          loading="lazy"
                                          onError={(e) => {
                                            e.target.src = `https://via.placeholder.com/80x80/667eea/ffffff?text=${sub.title.charAt(0)}`;
                                          }}
                                        />
                                        <div className="image-badge">
                                          <i className="bi bi-star-fill"></i>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {/* Sub Service Details */}
                                    <div className="sub-details flex-grow-1">
                                      <h6 className="sub-title mb-2">{sub.title}</h6>
                                      <p className="sub-description text-muted small mb-2">
                                        Professional service with quality guarantee
                                      </p>
                                      <div className="sub-price mb-3">
                                        <span className="price-currency text-success">₹</span>
                                        <span className="price-amount text-success fw-bold fs-5">{sub.price}</span>
                                      </div>
                                    </div>
                                    
                                    {/* Action Button */}
                                    <div className="sub-actions flex-shrink-0">
                                      <button
                                        onClick={() => toggleSubService(sub.id)}
                                        className={`btn btn-sm ${selected.includes(sub.id) ? 'btn-success' : 'btn-outline-primary'} toggle-btn`}
                                      >
                                        {selected.includes(sub.id) ? (
                                          <>
                                            <i className="bi bi-check-circle me-1"></i>
                                            Added
                                          </>
                                        ) : (
                                          <>
                                            <i className="bi bi-plus-circle me-1"></i>
                                            Add
                                          </>
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Selection Indicator */}
                                {selected.includes(sub.id) && (
                                  <div className="selection-indicator">
                                    <i className="bi bi-check-circle-fill text-success"></i>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Fixed Layout */}
          <div className="col-lg-4">
            <div className={`booking-sidebar ${isVisible ? 'animate-slide-left' : ''}`}>
              <div className="booking-summary sticky-top">
                <div className="card summary-card border-0 shadow">
                  
                  {/* Summary Header */}
                  <div className="card-header summary-header bg-primary text-white border-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0 fw-bold">
                        <i className="bi bi-cart3 me-2"></i>
                        Booking Summary
                      </h5>
                      <span className="badge bg-light text-primary">
                        {selected.length} {selected.length === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="card-body p-4">
                    {/* Price Breakdown */}
                    <div className="price-breakdown-section mb-4">
                      <div className="price-breakdown">
                        <div className="price-item d-flex justify-content-between align-items-center mb-3">
                          <span className="price-label">
                            <i className="bi bi-tag text-primary me-2"></i>
                            Base Price
                          </span>
                          <span className="price-value fw-bold">₹{basePrice}</span>
                        </div>
                        <div className="price-item d-flex justify-content-between align-items-center mb-3">
                          <span className="price-label">
                            <i className="bi bi-plus-circle text-success me-2"></i>
                            Extras
                          </span>
                          <span className="price-value fw-bold">₹{subTotal}</span>
                        </div>
                      </div>
                    </div>

                    {/* Selected Items */}
                    {selectedSubs.length > 0 && (
                      <div className="selected-items-section mb-4">
                        <h6 className="selected-title fw-bold mb-3">
                          <i className="bi bi-check-square text-success me-2"></i>
                          Selected Services
                        </h6>
                        <div className="selected-list">
                          {selectedSubs.map((sub, index) => (
                            <div 
                              key={sub.id} 
                              className={`selected-item animate-fade-in-item`}
                              style={{animationDelay: `${index * 0.1}s`}}
                            >
                              <div className="d-flex justify-content-between align-items-center py-2">
                                <div className="item-info">
                                  <span className="item-name d-block small">{sub.title}</span>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                  <span className="item-price text-success fw-bold small">₹{sub.price}</span>
                                  <button 
                                    className="btn btn-sm btn-outline-danger remove-btn"
                                    onClick={() => toggleSubService(sub.id)}
                                    title="Remove item"
                                  >
                                    <i className="bi bi-x"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Total Amount */}
                    <div className="total-section mb-4">
                      <div className="total-container p-3 bg-light rounded-3 border">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="total-label fw-bold fs-5">Total Amount</span>
                          <span className="total-value fw-bold fs-4 text-success">₹{total}</span>
                        </div>
                      </div>
                    </div>

                    {/* Proceed Button */}
                    <div className="action-section mb-4">
                      <button 
                        className="btn btn-success btn-lg w-100 proceed-btn"
                        onClick={confirmBookingStep}
                        disabled={selected.length === 0}
                      >
                        <i className="bi bi-arrow-right-circle me-2"></i>
                        Proceed to Confirm
                      </button>
                    </div>

                    {/* Offer Card */}
                    <div className="offer-section mb-4">
                      <div className="offer-card alert alert-warning border-warning">
                        <div className="d-flex align-items-center">
                          <div className="offer-icon me-3">
                            <i className="bi bi-gift fs-3 text-warning"></i>
                          </div>
                          <div className="offer-content">
                            <div className="offer-title fw-bold">Special Offer!</div>
                            <small className="offer-desc">Up to ₹150 cashback on Paytm UPI</small>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Why Choose Us */}
                    <div className="why-choose-section">
                      <h6 className="why-title fw-bold mb-3">
                        <i className="bi bi-shield-check text-primary me-2"></i>
                        Why Choose ServiCity?
                      </h6>
                      <div className="why-list">
                        <div className="why-item d-flex align-items-center mb-2">
                          <i className="bi bi-check-circle-fill text-success me-2"></i>
                          <small>Verified Professionals</small>
                        </div>
                        <div className="why-item d-flex align-items-center mb-2">
                          <i className="bi bi-check-circle-fill text-success me-2"></i>
                          <small>Transparent Pricing</small>
                        </div>
                        <div className="why-item d-flex align-items-center mb-2">
                          <i className="bi bi-check-circle-fill text-success me-2"></i>
                          <small>Hassle-Free Booking</small>
                        </div>
                        <div className="why-item d-flex align-items-center">
                          <i className="bi bi-check-circle-fill text-success me-2"></i>
                          <small>24/7 Customer Support</small>
                        </div>
                      </div>
                    </div>
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

export default BookService;
