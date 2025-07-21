import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookService = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/services/${id}/`)
      .then(res => {
        setService(res.data);

        const cart = JSON.parse(localStorage.getItem("cart_services")) || [];
        const match = cart.find(item => item.service_id === parseInt(id));
        if (match) setSelected(match.subservices);
      })
      .catch(err => console.error("❌ Failed to fetch service", err));
  }, [id]);

  const toggleSubService = (subId) => {
    setSelected(prev =>
      prev.includes(subId) ? prev.filter(id => id !== subId) : [...prev, subId]
    );
  };

  const confirmBookingStep = () => {
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

    // Save selected subservices to localStorage
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
  };

  if (!service) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2">Loading service details...</p>
      </div>
    );
  }

  const basePrice = parseFloat(service.price || 0);
  const selectedSubs = service.grouped_subservices?.flatMap(group => group.items)
    ?.filter(sub => selected.includes(sub.id)) || [];
  const subTotal = selectedSubs.reduce((sum, sub) => sum + parseFloat(sub.price), 0);
  const total = basePrice + subTotal;

  return (
    <div className="container py-5">
      <h2 className="fw-bold">{service.name}</h2>
      <p className="text-muted">4.7 ⭐ (10.9M+ bookings)</p>

      <div className="row g-4">
        {/* LEFT */}
        <div className="col-md-8">
          <img src={service.image_url} className="img-fluid rounded mb-4" alt={service.name} />
          <p>{service.description}</p>

          {service.grouped_subservices?.map(group => (
            <div key={group.category} className="mb-4">
              <h5 className="fw-bold">{group.category}</h5>
              <div className="row">
                {group.items.map(sub => (
                  <div className="col-md-6" key={sub.id}>
                    <div className="card mb-3 p-3 shadow-sm">
                      <div className="d-flex align-items-center">
                        {sub.image_url && (
                          <img
                            src={sub.image_url}
                            alt={sub.title}
                            className="me-3 rounded"
                            style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                          />
                        )}
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{sub.title}</h6>
                          <p className="text-muted mb-1">₹{sub.price}</p>
                        </div>
                        <button
                          onClick={() => toggleSubService(sub.id)}
                          className={`btn btn-sm ${selected.includes(sub.id) ? 'btn-danger' : 'btn-outline-primary'}`}
                        >
                          {selected.includes(sub.id) ? 'Remove' : 'Add'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT - Summary */}
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h5 className="text-success fw-bold">Cart Summary</h5>
            <ul className="list-unstyled small">
              <li>Base Price: ₹{basePrice}</li>
              <li>Extras: ₹{subTotal}</li>
            </ul>
            {selectedSubs.length > 0 && (
              <div className="mt-2">
                <strong className="small">Selected Extras:</strong>
                <ul className="small ps-3 mb-0">
                  {selectedSubs.map(sub => (
                    <li key={sub.id}>{sub.title} - ₹{sub.price}</li>
                  ))}
                </ul>
              </div>
            )}
            <hr />
            <h6>Total: ₹{total}</h6>

            <button className="btn btn-primary w-100 mt-3" onClick={confirmBookingStep}>
              Proceed to Confirm
            </button>

            <div className="bg-light p-2 mt-3 rounded text-center small">
              💸 Up to ₹150 cashback on Paytm UPI
            </div>

            <div className="border-top mt-3 pt-3 small">
              <strong>Why Urban Services?</strong>
              <ul className="ps-3 mb-0">
                <li>✔ Verified Professionals</li>
                <li>✔ Transparent Pricing</li>
                <li>✔ Hassle-Free Booking</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookService;
