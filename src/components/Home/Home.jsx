import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, useMap } from 'react-leaflet'; 
import 'leaflet/dist/leaflet.css';
import './Home.css';

// Location data
import { LocationType, mapLocations } from './data.js';

// Icon style for each type
const iconStyle = {
  [LocationType.Kopitiam]: { color: '#238653', icon: 'fa-bowl-rice' },
  [LocationType.Cafe]: { color: '#2865bb', icon: 'fa-mug-hot' },
  [LocationType.Restaurant]: { color: '#64380c', icon: 'fa-utensils' },
  [LocationType.FastFood]: { color: '#bc210f', icon: 'fa-burger' },
  default: { color: '#666666', icon: 'fa-house' }
};

const getIconStyle = (type) => {
  return iconStyle[type] || iconStyle.default;
};

const createPin = (type) => {
  const { color, icon } = getIconStyle(type);

  return L.divIcon({
    className: 'custom-fa-icon',
    html: `<div style="background-color: ${color};" class="marker-circle">
             <i class="fa-solid ${icon}"></i>
           </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

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

// Format time
const getTodayScheduleString = (schedule) => {
  // Get current day
  const day = new Date().getDay();
  const today = schedule[day];

  if (!today) return "Closed Today";

  // Turn int to time
  const formatTime = (timeInt) => {
    const timeStr = timeInt.toString().padStart(4, '0');
    let hours = parseInt(timeStr.slice(0, 2));
    const mins = timeStr.slice(2);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12 || 12; // Converts 0 to 12 and 13-23 to 1-11
    return `${hours}:${mins} ${ampm}`;
  };

  return `${formatTime(today.open)} - ${formatTime(today.close)}`;
};

function Home() {
  // Coordinates for the Puchong
  const position = [3.0327, 101.6188];

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
            attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
            url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
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

          {/* Loop through all pin */}
          {mapLocations.map((location) => {
            // Logic to determine if currently open
            const now = new Date();
            const currentTime = now.getHours() * 100 + now.getMinutes();
            const todayData = location.schedule[now.getDay()];
            const isOpen = todayData && currentTime >= todayData.open && currentTime <= todayData.close;

            return (
              <Marker 
                key={location.id}
                position={[location.lat, location.lng]}
                icon={createPin(location.type)} 
              >
                <Popup>
                  <div style={{ textAlign: 'center', minWidth: '160px' }}>
                    <h3 style={{ margin: '0 0 4px 0' }}>{location.name}</h3>
                    <p style={{ margin: 0, color: 'gray', fontSize: '0.9em' }}>{location.type}</p>
                    
                    <hr style={{ margin: '8px 0', border: '0', borderTop: '1px solid #eee' }}/>
                    
                    <div style={{ marginBottom: '4px' }}>
                      <span style={{ 
                        color: isOpen ? '#28a745' : '#dc3545', 
                        fontWeight: 'bold',
                        fontSize: '0.85em'
                      }}>
                        {isOpen ? '● Open Now' : '○ Closed'}
                      </span>
                    </div>

                    <small style={{ display: 'block', color: '#555' }}>
                      {getTodayScheduleString(location.schedule)}
                    </small>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}

export default Home;
