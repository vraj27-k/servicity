import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

// Helper to center map
const MapFlyTo = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 15);
  }, [position, map]);
  return null;
};

const AhmedabadMap = ({ onLocationSelect }) => {
  const [markerPos, setMarkerPos] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [houseInfo, setHouseInfo] = useState('');
  const [fullAddress, setFullAddress] = useState('');

  const handleSearch = async () => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery} Ahmedabad India`);
      const data = await res.json();
      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const full = `${houseInfo}, ${display_name}`;
        setMarkerPos([parseFloat(lat), parseFloat(lon)]);
        setFullAddress(full);
        onLocationSelect(parseFloat(lat), parseFloat(lon), full);
      } else {
        alert("❌ Location not found. Try another area or society.");
      }
    } catch (err) {
      console.error("Search error:", err);
      alert("⚠️ Something went wrong during location search.");
    }
  };

  return (
    <div className="mb-3">
      <div className="d-flex gap-2 mb-2">
        <input
          type="text"
          className="form-control"
          placeholder="Search area / society in Ahmedabad"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      <input
        type="text"
        className="form-control mb-2"
        placeholder="Flat / House No (optional)"
        value={houseInfo}
        onChange={e => setHouseInfo(e.target.value)}
      />

      <MapContainer
        center={[23.0225, 72.5714]}
        zoom={12}
        scrollWheelZoom={false}
        style={{ height: "300px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markerPos && <Marker position={markerPos} />}
        <MapFlyTo position={markerPos} />
      </MapContainer>

      {fullAddress && (
        <p className="text-success mt-2">
          📍 <strong>Selected Address:</strong> {fullAddress}
        </p>
      )}
    </div>
  );
};

export default AhmedabadMap;
