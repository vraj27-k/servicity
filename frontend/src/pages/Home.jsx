// src/Home.jsx
import React from "react";
import Navbar from "./components/Navbar";
import HomeImg from "../assets/home.svg";


const Home = () => {
  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Navbar />

      <main className="flex-grow-1">
        {/* Hero Split Section */}
        <section className="container mt-5 pt-5">
          <div className="row align-items-center">
            {/* Left: Text */}
            <div className="col-md-6 mb-4 mb-md-0">
              <h1 className="display-5 fw-bold text-primary mb-3">Book Trusted Home Services</h1>
              <p className="text-muted fs-5">
                ServiCity makes home cleaning, plumbing, AC repair, and salon services just one tap away.
              </p>
              <a href="services" className="btn btn-primary btn-lg mt-3">Explore Services</a>
            </div>

            {/* Right: Image */}
            <div className="col-md-6 text-center">
              <img
                src={HomeImg}
                alt="Home Service Illustration"
                className="img-fluid"
                style={{ maxHeight: "360px" }}
              />
            </div>
          </div>
        </section>


        {/* Our Services Section */}
<section id="services" className="container mt-5 pt-4">
  <h2 className="text-center fw-bold mb-4">Our Services</h2>
  <div className="row g-4">
    {/* Service Card - Salon */}
    <div className="col-6 col-md-4 col-lg-3">
      <div className="card text-center border-0 shadow-sm h-100">
        <div className="card-body">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3304/3304563.png"
            alt="Salon"
            className="img-fluid mb-2"
            style={{ width: "60px", height: "60px" }}
          />
          <h6 className="fw-semibold mt-2">Salon at Home</h6>
        </div>
      </div>
    </div>

    {/* Service Card - Cleaning */}
    <div className="col-6 col-md-4 col-lg-3">
      <div className="card text-center border-0 shadow-sm h-100">
        <div className="card-body">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2554/2554813.png"
            alt="Cleaning"
            className="img-fluid mb-2"
            style={{ width: "60px", height: "60px" }}
          />
          <h6 className="fw-semibold mt-2">Home Cleaning</h6>
        </div>
      </div>
    </div>

    {/* Service Card - AC Repair */}
    <div className="col-6 col-md-4 col-lg-3">
      <div className="card text-center border-0 shadow-sm h-100">
        <div className="card-body">
          <img
            src="https://cdn-icons-png.flaticon.com/512/8333/8333899.png"
            alt="AC Repair"
            className="img-fluid mb-2"
            style={{ width: "60px", height: "60px" }}
          />
          <h6 className="fw-semibold mt-2">AC Repair</h6>
        </div>
      </div>
    </div>

    {/* Service Card - Plumbing */}
    <div className="col-6 col-md-4 col-lg-3">
      <div className="card text-center border-0 shadow-sm h-100">
        <div className="card-body">
          <img
            src="https://cdn-icons-png.flaticon.com/512/6009/6009997.png"
            alt="Plumbing"
            className="img-fluid mb-2"
            style={{ width: "60px", height: "60px" }}
          />
          <h6 className="fw-semibold mt-2">Plumbing</h6>
        </div>
      </div>
    </div>
  </div>
</section>
{/* Why Choose ServiCity Section */}
<section className="container mt-5 pt-4">
  <h2 className="text-center fw-bold mb-4">Why Choose ServiCity?</h2>
  <div className="row g-4 text-center">
    {/* Trusted Experts */}
    <div className="col-6 col-md-3">
      <div className="p-3 bg-light rounded shadow-sm h-100">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1053/1053244.png"
          alt="Trusted Experts"
          style={{ width: "50px", marginBottom: "10px" }}
        />
        <h6 className="fw-semibold">Trusted Experts</h6>
        <p className="small text-muted">Professionally verified & background-checked service providers.</p>
      </div>
    </div>

    {/* Instant Booking */}
    <div className="col-6 col-md-3">
      <div className="p-3 bg-light rounded shadow-sm h-100">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2838/2838912.png"
          alt="Instant Booking"
          style={{ width: "50px", marginBottom: "10px" }}
        />
        <h6 className="fw-semibold">Instant Booking</h6>
        <p className="small text-muted">Book any service instantly with real-time availability.</p>
      </div>
    </div>

    {/* Verified Services */}
    <div className="col-6 col-md-3">
      <div className="p-3 bg-light rounded shadow-sm h-100">
        <img
          src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
          alt="Verified"
          style={{ width: "50px", marginBottom: "10px" }}
        />
        <h6 className="fw-semibold">Verified Services</h6>
        <p className="small text-muted">All services are pre-verified & quality assured by ServiCity.</p>
      </div>
    </div>

    {/* 24x7 Support */}
    <div className="col-6 col-md-3">
      <div className="p-3 bg-light rounded shadow-sm h-100">
        <img
          src="https://cdn-icons-png.flaticon.com/512/724/724715.png"
          alt="Support"
          style={{ width: "50px", marginBottom: "10px" }}
        />
        <h6 className="fw-semibold">24x7 Support</h6>
        <p className="small text-muted">Customer care available anytime, anywhere you need help.</p>
      </div>
    </div>
  </div>
</section>

       {/* How It Works Section */}
<section className="container mt-5 pt-4">
  <h2 className="text-center fw-bold mb-4">How It Works</h2>

  <div className="row justify-content-center text-center">
    {/* Step 1 */}
    <div className="col-12 col-md-4 mb-4">
      <div className="p-3 bg-white rounded shadow-sm h-100">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1828/1828843.png"
          alt="Choose Service"
          style={{ width: "50px", marginBottom: "10px" }}
        />
        <h6 className="fw-semibold">1. Choose a Service</h6>
        <p className="small text-muted">Browse and select from a variety of home services we offer.</p>
      </div>
    </div>

    {/* Step 2 */}
    <div className="col-12 col-md-4 mb-4">
      <div className="p-3 bg-white rounded shadow-sm h-100">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2921/2921222.png"
          alt="Schedule"
          style={{ width: "50px", marginBottom: "10px" }}
        />
        <h6 className="fw-semibold">2. Pick Your Time</h6>
        <p className="small text-muted">Choose a time slot that suits you best, including same-day options.</p>
      </div>
    </div>

    {/* Step 3 */}
    <div className="col-12 col-md-4 mb-4">
      <div className="p-3 bg-white rounded shadow-sm h-100">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3140/3140332.png"
          alt="Get It Done"
          style={{ width: "50px", marginBottom: "10px" }}
        />
        <h6 className="fw-semibold">3. Sit Back & Relax</h6>
        <p className="small text-muted">Our expert arrives at your doorstep to complete the service hassle-free.</p>
      </div>
    </div>
  </div>
</section>
{/* Testimonials Section */}
<section className="container mt-5 pt-4">
  <h2 className="text-center fw-bold mb-4">What Our Customers Say</h2>

  <div className="row g-4">
    {/* Testimonial 1 */}
    <div className="col-md-6">
      <div className="p-4 bg-light rounded shadow-sm h-100">
        <div className="d-flex align-items-center mb-3">
          <img
            src="https://i.pravatar.cc/50?img=1"
            className="rounded-circle me-3"
            alt="User"
          />
          <div>
            <h6 className="mb-0 fw-semibold">Riya Sharma</h6>
            <small className="text-muted">Salon Booking</small>
          </div>
        </div>
        <p className="mb-2 text-muted fst-italic">
          "Amazing service! The beautician arrived on time and was very professional. Loved the experience!"
        </p>
        <div className="text-warning">⭐⭐⭐⭐⭐</div>
      </div>
    </div>

    {/* Testimonial 2 */}
    <div className="col-md-6">
      <div className="p-4 bg-light rounded shadow-sm h-100">
        <div className="d-flex align-items-center mb-3">
          <img
            src="https://i.pravatar.cc/50?img=3"
            className="rounded-circle me-3"
            alt="User"
          />
          <div>
            <h6 className="mb-0 fw-semibold">Amit Patel</h6>
            <small className="text-muted">AC Repair</small>
          </div>
        </div>
        <p className="mb-2 text-muted fst-italic">
          "Quick and efficient AC repair service. The technician even cleaned the mess before leaving. Highly recommend!"
        </p>
        <div className="text-warning">⭐⭐⭐⭐⭐</div>
      </div>
    </div>
  </div>
</section>
{/* Contact Us Section */}
<section className="container mt-5 pt-4 mb-5">
  <h2 className="text-center fw-bold mb-4">Need Help? Contact Us</h2>
  <div className="row text-center">
    <div className="col-md-4 mb-4">
      <i className="bi bi-telephone-fill fs-2 text-primary"></i>
      <p className="mt-2 mb-0 fw-semibold">Call Us</p>
      <p className="text-muted">+91 98765 43210</p>
    </div>
    <div className="col-md-4 mb-4">
      <i className="bi bi-envelope-fill fs-2 text-success"></i>
      <p className="mt-2 mb-0 fw-semibold">Email</p>
      <p className="text-muted">support@servicity.com</p>
    </div>
    <div className="col-md-4 mb-4">
      <i className="bi bi-geo-alt-fill fs-2 text-danger"></i>
      <p className="mt-2 mb-0 fw-semibold">Location</p>
      <p className="text-muted">Ahmedabad, Gujarat, India</p>
    </div>
  </div>
</section>

{/* Footer */}
<footer className="bg-dark text-white text-center py-4">
  <div className="container">
    <h5 className="fw-bold mb-2">ServiCity</h5>
    <p className="mb-2 small">Urban Home Service & Booking Portal</p>
    <div className="mb-3">
      <a href="#" className="text-white mx-2 small">Privacy Policy</a>
      |
      <a href="#" className="text-white mx-2 small">Terms of Service</a>
      |
      <a href="#" className="text-white mx-2 small">Support</a>
    </div>
    <p className="mb-0 small">&copy; {new Date().getFullYear()} ServiCity. All rights reserved.</p>
  </div>
</footer>


      </main>
    </div>
  );
};

export default Home;
