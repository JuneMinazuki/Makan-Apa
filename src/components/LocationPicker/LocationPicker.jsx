import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Link } from 'react-router-dom';
import './LocationPicker.css';

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

  return (
    <div className="picker-container">
      <div className="picker-ui">
        <Link to="/" className="back-btn">← Back Home</Link>
        <div className="coords-card">
          <h3>Select Location</h3>
          {position ? (
            <code>
              Lat: {position.lat.toFixed(6)}<br />
              Lng: {position.lng.toFixed(6)}
            </code>
          ) : (
            <p>Click anywhere on the map to get coordinates</p>
          )}
        </div>
      </div>

      <MapContainer 
        center={defaultPos} 
        zoom={13} 
        className="full-map"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <ClickHandler setPosition={setPosition} />
        
        {position && <Marker position={position} />}
      </MapContainer>
    </div>
  );
}

export default LocationPicker;
