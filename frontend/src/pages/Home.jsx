// src/Home.jsx
import React from "react";
import Navbar from "./components/Navbar";
import HomeImg from "../assets/home.svg";
import './Home.css'; // We'll create this CSS file

const Home = () => {
  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Navbar />

      <main className="flex-grow-1">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-background"></div>
          <div className="container">
            <div className="row align-items-center min-vh-100">
              <div className="col-lg-6 text-white">
                <div className="hero-content">
                  <h1 className="hero-title display-3 fw-bold mb-4">
                    <span className="typing-animation">Book Trusted</span>
                    <br />
                    <span className="gradient-text">Home Services</span>
                  </h1>
                  <p className="hero-subtitle fs-4 mb-5">
                    ServiCity makes home cleaning, plumbing, AC repair, and salon services just one tap away.
                  </p>
                  <div className="hero-buttons d-flex gap-4 flex-wrap">
                    <a href="services" className="btn btn-hero-primary btn-lg px-5 py-3">
                      <i className="bi bi-search me-2"></i>
                      Explore Services
                    </a>
                    <a href="#services" className="btn btn-hero-outline btn-lg px-5 py-3">
                      <i className="bi bi-play-circle me-2"></i>
                      Learn More
                    </a>
                  </div>
                  
                  {/* Stats */}
                  <div className="hero-stats mt-5">
                    <div className="stat-item">
                      <div className="stat-number">10K+</div>
                      <div className="stat-label">Happy Customers</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">4.9★</div>
                      <div className="stat-label">Rating</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">24/7</div>
                      <div className="stat-label">Support</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6 text-center">
                <div className="hero-image-wrapper">
                  <img
                    src={HomeImg}
                    alt="Home Service Illustration"
                    className="hero-image img-fluid"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="services-section py-5">
          <div className="container">
            <div className="text-center mb-5">
              <div className="section-badge">Our Services</div>
              <h2 className="section-title display-4 fw-bold mb-4">Our Services</h2>
              <p className="section-subtitle lead text-muted">
                Choose from our wide range of home services
              </p>
            </div>

            <div className="row g-4">
              {/* Salon Service */}
              <div className="col-6 col-md-4 col-lg-3">
                <div className="service-card">
                  <div className="service-icon-wrapper">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/3304/3304563.png"
                      alt="Salon"
                      className="service-icon"
                    />
                  </div>
                  <h6 className="service-title">Salon at Home</h6>
                  <p className="service-desc">Professional beauty services</p>
                  <div className="service-price">Starting ₹299</div>
                  <button className="btn btn-primary btn-sm">Book Now</button>
                </div>
              </div>

              {/* Cleaning Service */}
              <div className="col-6 col-md-4 col-lg-3">
                <div className="service-card">
                  <div className="service-icon-wrapper">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/2554/2554813.png"
                      alt="Cleaning"
                      className="service-icon"
                    />
                  </div>
                  <h6 className="service-title">Home Cleaning</h6>
                  <p className="service-desc">Deep cleaning services</p>
                  <div className="service-price">Starting ₹199</div>
                  <button className="btn btn-success btn-sm">Book Now</button>
                </div>
              </div>

              {/* AC Repair Service */}
              <div className="col-6 col-md-4 col-lg-3">
                <div className="service-card">
                  <div className="service-icon-wrapper">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/8333/8333899.png"
                      alt="AC Repair"
                      className="service-icon"
                    />
                  </div>
                  <h6 className="service-title">AC Repair</h6>
                  <p className="service-desc">Expert AC maintenance</p>
                  <div className="service-price">Starting ₹399</div>
                  <button className="btn btn-warning btn-sm">Book Now</button>
                </div>
              </div>

              {/* Plumbing Service */}
              <div className="col-6 col-md-4 col-lg-3">
                <div className="service-card">
                  <div className="service-icon-wrapper">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/6009/6009997.png"
                      alt="Plumbing"
                      className="service-icon"
                    />
                  </div>
                  <h6 className="service-title">Plumbing</h6>
                  <p className="service-desc">Emergency plumbing fixes</p>
                  <div className="service-price">Starting ₹249</div>
                  <button className="btn btn-info btn-sm">Book Now</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="features-section py-5">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="display-4 fw-bold text-white mb-4">Why Choose ServiCity?</h2>
              <p className="fs-5 text-white-50 mb-5">
                Your trusted partner for all home service needs
              </p>
            </div>

            <div className="row g-4 text-center">
              <div className="col-6 col-md-3">
                <div className="feature-card">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/1053/1053244.png"
                    alt="Trusted Experts"
                    className="feature-icon"
                  />
                  <h6 className="feature-title">Trusted Experts</h6>
                  <p className="feature-desc">Professionally verified & background-checked service providers.</p>
                </div>
              </div>

              <div className="col-6 col-md-3">
                <div className="feature-card">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/2838/2838912.png"
                    alt="Instant Booking"
                    className="feature-icon"
                  />
                  <h6 className="feature-title">Instant Booking</h6>
                  <p className="feature-desc">Book any service instantly with real-time availability.</p>
                </div>
              </div>

              <div className="col-6 col-md-3">
                <div className="feature-card">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
                    alt="Verified"
                    className="feature-icon"
                  />
                  <h6 className="feature-title">Verified Services</h6>
                  <p className="feature-desc">All services are pre-verified & quality assured by ServiCity.</p>
                </div>
              </div>

              <div className="col-6 col-md-3">
                <div className="feature-card">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/724/724715.png"
                    alt="Support"
                    className="feature-icon"
                  />
                  <h6 className="feature-title">24x7 Support</h6>
                  <p className="feature-desc">Customer care available anytime, anywhere you need help.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works py-5">
          <div className="container">
            <div className="text-center mb-5">
              <div className="section-badge">Process</div>
              <h2 className="section-title display-4 fw-bold mb-4">How It Works</h2>
            </div>

            <div className="row justify-content-center">
              <div className="col-12 col-md-4 mb-4">
                <div className="step-card">
                  <div className="step-number">1</div>
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/1828/1828843.png"
                    alt="Choose Service"
                    className="step-icon"
                  />
                  <h5 className="step-title">Choose a Service</h5>
                  <p className="step-desc">Browse and select from a variety of home services we offer.</p>
                </div>
              </div>

              <div className="col-12 col-md-4 mb-4">
                <div className="step-card">
                  <div className="step-number">2</div>
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/2921/2921222.png"
                    alt="Schedule"
                    className="step-icon"
                  />
                  <h5 className="step-title">Pick Your Time</h5>
                  <p className="step-desc">Choose a time slot that suits you best, including same-day options.</p>
                </div>
              </div>

              <div className="col-12 col-md-4 mb-4">
                <div className="step-card">
                  <div className="step-number">3</div>
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3140/3140332.png"
                    alt="Get It Done"
                    className="step-icon"
                  />
                  <h5 className="step-title">Sit Back & Relax</h5>
                  <p className="step-desc">Our expert arrives at your doorstep to complete the service hassle-free.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section py-5 bg-light">
          <div className="container">
            <div className="text-center mb-5">
              <div className="section-badge">Reviews</div>
              <h2 className="section-title display-4 fw-bold mb-4">What Our Customers Say</h2>
            </div>

            <div className="row g-4">
              <div className="col-md-6">
                <div className="testimonial-card">
                  <div className="testimonial-header">
                    <img
                      src="https://i.pravatar.cc/60?img=1"
                      className="testimonial-avatar"
                      alt="User"
                    />
                    <div className="testimonial-info">
                      <h6 className="testimonial-name">Riya Sharma</h6>
                      <small className="testimonial-service">Salon Booking</small>
                    </div>
                    <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
                  </div>
                  <p className="testimonial-text">
                    "Amazing service! The beautician arrived on time and was very professional. Loved the experience!"
                  </p>
                </div>
              </div>

              <div className="col-md-6">
                <div className="testimonial-card">
                  <div className="testimonial-header">
                    <img
                      src="https://i.pravatar.cc/60?img=3"
                      className="testimonial-avatar"
                      alt="User"
                    />
                    <div className="testimonial-info">
                      <h6 className="testimonial-name">Amit Patel</h6>
                      <small className="testimonial-service">AC Repair</small>
                    </div>
                    <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
                  </div>
                  <p className="testimonial-text">
                    "Quick and efficient AC repair service. The technician even cleaned the mess before leaving. Highly recommend!"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact-section py-5">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="display-4 fw-bold text-white mb-4">Need Help? Contact Us</h2>
            </div>

            <div className="row text-center g-4">
              <div className="col-md-4">
                <div className="contact-card">
                  <i className="bi bi-telephone-fill contact-icon"></i>
                  <h4 className="contact-title">Call Us</h4>
                  <p className="contact-info">+91 98765 43210</p>
                  <p className="contact-desc">Available 24/7</p>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="contact-card">
                  <i className="bi bi-envelope-fill contact-icon"></i>
                  <h4 className="contact-title">Email</h4>
                  <p className="contact-info">support@servicity.com</p>
                  <p className="contact-desc">Response within 2 hours</p>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="contact-card">
                  <i className="bi bi-geo-alt-fill contact-icon"></i>
                  <h4 className="contact-title">Location</h4>
                  <p className="contact-info">Ahmedabad, Gujarat, India</p>
                  <p className="contact-desc">Serving across India</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer-section bg-dark text-white py-5">
          <div className="container">
            <div className="row g-4">
              <div className="col-lg-4">
                <h5 className="fw-bold text-warning mb-3">ServiCity</h5>
                <p className="mb-3">Urban Home Service & Booking Portal</p>
                <p className="small opacity-75">Making home services accessible, reliable, and affordable for everyone.</p>
              </div>
              
              <div className="col-lg-8">
                <div className="row">
                  <div className="col-md-4">
                    <h6 className="fw-semibold mb-3">Services</h6>
                    <ul className="list-unstyled">
                      <li><a href="#" className="footer-link">Salon at Home</a></li>
                      <li><a href="#" className="footer-link">Home Cleaning</a></li>
                      <li><a href="#" className="footer-link">AC Repair</a></li>
                      <li><a href="#" className="footer-link">Plumbing</a></li>
                    </ul>
                  </div>
                  
                  <div className="col-md-4">
                    <h6 className="fw-semibold mb-3">Quick Links</h6>
                    <ul className="list-unstyled">
                      <li><a href="#" className="footer-link">About Us</a></li>
                      <li><a href="#" className="footer-link">Privacy Policy</a></li>
                      <li><a href="#" className="footer-link">Terms of Service</a></li>
                      <li><a href="#" className="footer-link">Support</a></li>
                    </ul>
                  </div>
                  
                  <div className="col-md-4">
                    <h6 className="fw-semibold mb-3">Contact Info</h6>
                    <p className="small">
                      <i className="bi bi-telephone me-2"></i>+91 98765 43210<br/>
                      <i className="bi bi-envelope me-2"></i>support@servicity.com<br/>
                      <i className="bi bi-geo-alt me-2"></i>Ahmedabad, Gujarat
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <hr className="my-4 opacity-25" />
            <div className="text-center">
              <p className="mb-0 small opacity-75">
                &copy; {new Date().getFullYear()} ServiCity. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Home;
