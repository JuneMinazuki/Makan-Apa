import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import './LocationPicker.css';

import Navbar from '../Navbar/Navbar.jsx';
import FlyToLocation from '../Map/FlyToLocation';
import { iconInfomation } from '../Map/mapIcons.js';

function ClickHandler({ setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return null;
}

function LocationPicker() {
  const defaultPos = [3.0327, 101.6188];
  const [position, setPosition] = useState(null);
  const [activeTypes, setActiveTypes] = useState(Object.keys(iconInfomation));

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition({ lat: latitude, lng: longitude });
      },
      () => {
        alert("Unable to retrieve your location. Please check permissions.");
      }
    );
  };

  return (
    <div className="location-picker-page">
      <Navbar 
        activeTypes={activeTypes} 
        setActiveTypes={setActiveTypes}
        onSearch={(loc) => setPosition(loc)} 
        showSearch={false}
      />

      <div className="picker-container">
        <div className="picker-ui">
          <Link to="/" className="back-btn">← Back Home</Link>
        
          <div className="coords-card">
            <h3>Select Location</h3>
  
            <button className="locate-btn" onClick={handleLocateMe}>
              Find My Current Location
            </button>

            <div className="coords-display">
              {position ? (
                <>
                  <span className="label">Latitude</span>
                  <code>{position.lat.toFixed(6)}</code>
                  <hr style={{ margin: '8px 0', opacity: 0.1 }} />
                  <span className="label">Longitude</span>
                  <code>{position.lng.toFixed(6)}</code>
                </>
                ) : (
                  <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                    Click anywhere on the map to drop a pin.
                  </p>
                )}
            </div>
  
            {position && (
              <button className="confirm-btn">Confirm Selection</button>
            )}
          </div>
        </div>

        <MapContainer center={defaultPos} zoom={13} className="full-map">
          <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
          
          <ClickHandler setPosition={setPosition} />
          
          <FlyToLocation targetLocation={position} />

          {position && <Marker position={position} />}
        </MapContainer>
      </div>
    </div>
  );
}

export default LocationPicker;
