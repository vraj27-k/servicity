// components/AddServiceModal.js
import React, { useState } from 'react';
import axios from 'axios';

const AddServiceModal = ({ show, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    if (formData.image) data.append('image', formData.image);

    try {
      await axios.post('http://localhost:8000/api/services/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('✅ Service added!');
      onSuccess(); // refresh service list
      setFormData({ name: '', description: '', price: '', image: null }); // clear form
      onClose(); // close modal
    } catch (err) {
      console.error(err);
      
    }
  };

  return (
    <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Add New Service</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              {message && <div className="alert alert-info">{message}</div>}
              <input type="text" name="name" className="form-control mb-3" placeholder="Service Name" required onChange={handleChange} />
              <textarea name="description" className="form-control mb-3" placeholder="Description" required onChange={handleChange} />
              <input type="number" name="price" className="form-control mb-3" placeholder="Price (₹)" required onChange={handleChange} />
              <input type="file" name="image" className="form-control mb-3" accept="image/*" onChange={handleChange} required />
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">Add Service</button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddServiceModal;
