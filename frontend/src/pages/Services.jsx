import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './components/Navbar';

const Services = () => {
  // Predefined services (manually matched to backend IDs)
  const services = [
    {
      id: 1,
      name: "AC Services",
      description: "AC installation, repair & servicing",
      image: "/images/ac.webp",  // place images in /public/images
    },
    {
      id: 2,
      name: "Plumbing",
      description: "Fix taps, leaks & fittings",
      image: "/images/plumbing.jpg",
    },
    {
      id: 3,
      name: "Salon",
      description: "Beauty & grooming at home",
      image: "/images/salon.jpeg",
    },
    {
      id: 4,
      name: "Cleaning",
      description: "Deep home & kitchen cleaning",
      image: "/images/cleaning.webp",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <h2 className="text-center fw-bold mb-4">Explore Our Top Services</h2>
        <div className="row g-4">
          {services.map((service) => (
            <div className="col-sm-6 col-md-4 col-lg-3" key={service.id}>
              <div className="card h-100 shadow-sm">
                <img
                  src={service.image}
                  className="card-img-top"
                  alt={service.name}
                  style={{ height: '180px', objectFit: 'cover' }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{service.name}</h5>
                  <p className="card-text text-muted small">{service.description}</p>
                  <Link to={`/book/${service.id}`} className="btn btn-primary mt-auto">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Services;
