import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditServiceModal = ({ service, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
    preview: '',
  });

  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || '',
        description: service.description || '',
        price: service.price || '',
        image: null,
        preview: service.image || '',
      });
    }
  }, [service]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      await axios.put(`http://localhost:8000/api/services/${service.id}/`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('✅ Service updated successfully');
      setShowMessage(true);

      // Close modal after 1 second
      setTimeout(() => {
        setShowMessage(false);
        setMessage('');
        onClose(); // closes modal & refreshes list
      }, 1000);
    } catch (err) {
      console.error('Edit failed:', err.response?.data || err.message);
      setMessage('❌ Failed to update service');
      setShowMessage(true);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Edit Service</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              {showMessage && (
                <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'}`}>
                  {message}
                </div>
              )}

              <input
                type="text"
                name="name"
                className="form-control mb-2"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <textarea
                name="description"
                className="form-control mb-2"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="price"
                className="form-control mb-2"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                required
              />
              <input
                type="file"
                name="image"
                className="form-control mb-2"
                onChange={handleChange}
                accept="image/*"
              />
              {formData.preview && (
                <img
                  src={formData.preview.startsWith('http') ? formData.preview : `http://localhost:8000${formData.preview}`}
                  alt="preview"
                  className="img-thumbnail mt-2"
                  width="100"
                />
              )}
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-success">Update</button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditServiceModal;
