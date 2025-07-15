// src/pages/UserServices.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const UserServices = () => {
  const [services, setServices] = useState([]);

  const fetchServices = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/services/");
      setServices(res.data);
    } catch (err) {
      console.error("Error loading services", err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Available Services</h1>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white shadow-md rounded-lg p-4 border hover:shadow-lg transition"
          >
            {service.image && (
              <img
                src={`http://localhost:8000${service.image}`}
                alt={service.name}
                className="w-full h-40 object-cover rounded mb-3"
              />
            )}
            <h2 className="text-xl font-semibold">{service.name}</h2>
            <p className="text-gray-600">{service.description}</p>
            <p className="mt-2 text-blue-600 font-bold">₹{service.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserServices;
