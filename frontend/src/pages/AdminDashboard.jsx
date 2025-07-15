import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddServiceModal from './AddServiceModal';
import EditServiceModal from './EditServiceModal';

const AdminDashboard = () => {
  const [services, setServices] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editService, setEditService] = useState(null);

  const fetchServices = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/services/');
      setServices(res.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await axios.delete(`http://localhost:8000/api/services/${id}/`);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error('Failed to delete service:', error);
    }
  };

  return (
    <div className="bg-light min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold fs-4">ServiCity Admin</span>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container py-5">
        <h2 className="mb-4 text-dark fw-bold">All Services</h2>
        <div className="row g-4">
          {/* Add Service Card */}
          <div className="col-sm-6 col-md-4 col-lg-3">
            <div
              className="card h-100 text-center border-dashed border-2 border-primary bg-white shadow-sm"
              onClick={() => setShowAddModal(true)}
              style={{ cursor: 'pointer', borderStyle: 'dashed' }}
            >
              <div className="card-body d-flex flex-column justify-content-center">
                <h1 className="text-primary display-4 mb-2">+</h1>
                <p className="text-muted fw-semibold">Add New Service</p>
              </div>
            </div>
          </div>

          {/* Service Cards */}
          {services.map((service) => (
            <div key={service.id} className="col-sm-6 col-md-4 col-lg-3">
              <div className="card h-100 shadow-sm">
               <img src={service.image_url} alt={service.name} className="card-img-top" />

                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-primary">{service.name}</h5>
                  <p className="card-text text-muted small">{service.description}</p>
                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-success">₹{service.price}</span>
                    <div>
                      <button
                        className="btn btn-sm btn-outline-warning me-2"
                        onClick={() => setEditService(service)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(service.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddServiceModal
          show={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            fetchServices();
          }}
        />
      )}

      {editService && (
        <EditServiceModal
          service={editService}
          onClose={() => {
            setEditService(null);
            fetchServices();
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
