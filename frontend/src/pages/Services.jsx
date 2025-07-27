import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import './Services.css'; // Move CSS to external file

const Services = React.memo(() => {
  const [searchTerm, setSearchTerm] = useState('');

  // Predefined services (same data, but memoized)
  const services = useMemo(() => [
    {
      id: 1,
      name: "AC Services",
      description: "AC installation, repair & servicing",
      image: "/images/ac.webp",
      price: "Starting ₹399",
      rating: 4.8,
      category: "Home Repair",
      features: ["Installation", "Repair", "Maintenance", "Gas Refill"]
    },
    {
      id: 2,
      name: "Plumbing",
      description: "Fix taps, leaks & fittings",
      image: "/images/plumbing.jpg",
      price: "Starting ₹249",
      rating: 4.7,
      category: "Home Repair",
      features: ["Tap Repair", "Pipe Fixing", "Leak Detection", "Bathroom Fitting"]
    },
    {
      id: 3,
      name: "Salon",
      description: "Beauty & grooming at home",
      image: "/images/salon.jpeg",
      price: "Starting ₹299",
      rating: 4.9,
      category: "Beauty & Wellness",
      features: ["Hair Cut", "Facial", "Manicure", "Massage"]
    },
    {
      id: 4,
      name: "Cleaning",
      description: "Deep home & kitchen cleaning",
      image: "/images/cleaning.webp",
      price: "Starting ₹199",
      rating: 4.6,
      category: "Home Care",
      features: ["Deep Cleaning", "Kitchen Clean", "Bathroom Clean", "Floor Polish"]
    },
  ], []);

  // Optimized search filter with useMemo
  const filteredServices = useMemo(() => 
    services.filter(service =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase())
    ), [services, searchTerm]
  );

  return (
    <>
      <Navbar />
      
      {/* Simplified Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row justify-content-center text-center text-white">
            <div className="col-lg-8">
              <h1 className="hero-title display-3 fw-bold mb-4">Our Services</h1>
              <p className="hero-subtitle fs-4 mb-5">
                Professional home services at your doorstep. Quality, reliability, and affordability guaranteed.
              </p>
              
              {/* Simple Search Bar */}
              <div className="search-container">
                <div className="input-group input-group-lg">
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search for services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Simplified */}
      <section className="services-section py-5">
        <div className="container">
          {/* Section Header - Simplified */}
          <div className="text-center mb-5">
            <span className="badge bg-primary fs-6 px-3 py-2 mb-3">Top Services</span>
            <h2 className="display-4 fw-bold mb-4">Explore Our Services</h2>
            <p className="lead text-muted">Choose from our wide range of professional home services</p>
          </div>

          {/* Services Grid - Optimized */}
          <div className="row g-4">
            {filteredServices.map((service) => (
              <div key={service.id} className="col-sm-6 col-lg-3">
                <div className="service-card">
                  {/* Card Header */}
                  <div className="card-header">
                    <span className="category-badge">{service.category}</span>
                    <span className="rating-badge">
                      <i className="bi bi-star-fill"></i> {service.rating}
                    </span>
                  </div>

                  {/* Service Image */}
                  <div className="image-wrapper">
                    <img
                      src={service.image}
                      className="service-image"
                      alt={service.name}
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/300x180/667eea/ffffff?text=${service.name}`;
                      }}
                    />
                  </div>

                  {/* Card Body */}
                  <div className="card-body">
                    <h5 className="service-title">{service.name}</h5>
                    <p className="service-description">{service.description}</p>
                    
                    {/* Features - Simplified */}
                    <div className="service-features mb-3">
                      {service.features.slice(0, 2).map((feature, idx) => (
                        <span key={idx} className="feature-tag">
                          <i className="bi bi-check-circle me-1"></i>
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Price */}
                    <div className="service-price mb-3">
                      <span className="price-text">{service.price}</span>
                    </div>

                    {/* Action Button - Simplified */}
                    <Link to={`/book/${service.id}`} className="btn btn-primary w-100">
                      <i className="bi bi-calendar-check me-2"></i>
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results - Simplified */}
          {filteredServices.length === 0 && (
            <div className="text-center py-5">
              <i className="bi bi-search fs-1 text-muted mb-3"></i>
              <h4 className="text-muted">No services found</h4>
              <p className="text-muted">Try searching with different keywords</p>
              <button 
                className="btn btn-primary"
                onClick={() => setSearchTerm('')}
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section - Simplified */}
      <section className="cta-section">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h2 className="display-5 fw-bold mb-4">Need a Custom Service?</h2>
              <p className="fs-5 mb-4">
                Can't find what you're looking for? Contact us for personalized service solutions.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link to="/contact" className="btn btn-warning btn-lg">
                  <i className="bi bi-telephone me-2"></i>
                  Contact Us
                </Link>
                <Link to="/about" className="btn btn-outline-light btn-lg">
                  <i className="bi bi-info-circle me-2"></i>
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
});

export default Services;
