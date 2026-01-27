import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'; 
import 'leaflet/dist/leaflet.css';
import './Home.css';

// Set marker icon in React-Leaflet
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function Home() {
    // Coordinates for the Cyberjaya
  const position = [2.9278, 101.6419];

  // Get user location
  const [userLocation, setUserLocation] = useState(null);

  const handleGetUserLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Set the user location pin
        setUserLocation({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location.");
      }
    );
  }

  useEffect(() => {
    handleGetUserLocation();
  }, []);

  function FlyToUserLocation({ userLocation }) {
    const map = useMap();

    useEffect(() => {
      if (userLocation) {
        map.flyTo([userLocation.lat, userLocation.lng], 14.5, {
          duration: 1
        });
      }
    }, [userLocation, map]);

    return null;
  }

  return (
    <div className="home-container">
      {/* Top Menu Bar */}
      <nav className="navbar">
        <div className="nav-logo">Makan Apa?</div>
      </nav>

      {/* Main Content Area */}
      <div className="main-content">
        <MapContainer 
          center={position} 
          zoom={14.5} 
          scrollWheelZoom={true} 
          className="leaflet-container"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FlyToUserLocation userLocation={userLocation} />

          {userLocation && (
            <CircleMarker 
              center={[userLocation.lat, userLocation.lng]}
              radius={9} 
              pathOptions={{ 
                color: 'white', 
                fillColor: '#007bff',
                fillOpacity: 1,
                weight: 2
              }}
            >
              <Popup>You are here</Popup>
            </CircleMarker>
          )}
        </MapContainer>
      </div>
    </div>
  );
}

export default Home;
