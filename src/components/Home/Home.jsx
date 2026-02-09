import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, useMap } from 'react-leaflet'; 
import 'leaflet/dist/leaflet.css';

// Data and Utils
import { getNearbyLocations } from '../Utils/geoUtils.js';
import { LocationType, mapLocations } from './data.js';
import './Home.css';

// Icon style for each type
const iconStyle = Object.freeze({
  0: { color: '#238653', icon: 'fa-bowl-rice' },  // Kopitiam
  1: { color: '#2865bb', icon: 'fa-mug-hot' },    // Cafe
  2: { color: '#64380c', icon: 'fa-utensils' },   // Restaurant
  3: { color: '#bc210f', icon: 'fa-burger' },     // Fast Food
});

const getIconStyle = (typeId) => {
  return iconStyle[typeId] || { color: '#666666', icon: 'fa-house' };
};

const createPin = (typeId) => {
  const { color, icon } = getIconStyle(typeId);

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
const getTodaySchedule = (schedule) => {
  // Get current day
  const day = new Date().getDay();
  const today = schedule[day];

  if (!today || today.length === 0) return "Closed Today";

  // Turn int to time
  const formatTime = (timeInt) => {
    if (timeInt === 0 || timeInt === 2400) return "12:00 AM"; // Handle 0000 and 2400 as midnight
      
    const timeStr = timeInt.toString().padStart(4, '0');
    let hours = parseInt(timeStr.slice(0, 2));
    const mins = timeStr.slice(2);
    const ampm = hours >= 12 && hours < 24 ? 'PM' : 'AM';
      
    // Standard 12-hour conversion
    let displayHours = hours % 12;
    if (displayHours === 0) displayHours = 12; 

    return `${displayHours}:${mins} ${ampm}`;
  };

  return `${formatTime(today[0])} - ${formatTime(today[1])}`;
};

function Home() {
  // Coordinates for the Puchong
  const position = [3.0327, 101.6188];

  // Get user location
  const [userLocation, setUserLocation] = useState(null);

  // Get nearby location pin
  const nearbyPins = useMemo(() => {
    const locations = getNearbyLocations(mapLocations, userLocation, 20);

    return locations.map(loc => ({
      ...loc,
      leafletIcon: createPin(loc.type) 
    }));
  }, [userLocation]);

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
        map.flyTo([userLocation.lat, userLocation.lng], 16.5, {
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
          {nearbyPins.map((location) => {
            // Determine if currently open
            const now = new Date();
            const currentDay = now.getDay();
            const currentTime = now.getHours() * 100 + now.getMinutes();
            const todayData = location.schedule[currentDay];
            
            let isOpen = false;
            if (todayData && todayData.length === 2) {
              const [openTime, closeTime] = todayData;

              if (openTime < closeTime) { // Open and close on same day
                isOpen = currentTime >= openTime && currentTime <= closeTime;
              } 
              else { // Close on the next day overnight
                isOpen = currentTime >= openTime || currentTime <= closeTime;
              }
            }

            return (
              <Marker 
                key={location.id}
                position={[location.lat, location.lng]}
                icon={location.leafletIcon}
              >
                <Popup>
                  <div style={{ textAlign: 'center', minWidth: '160px' }}>
                    <h3 style={{ margin: '0 0 4px 0' }}>{location.name}</h3>
                    <p style={{ margin: 0, color: 'gray', fontSize: '0.9em' }}>{LocationType[location.type]?.label || "Unknown"}</p>
                    
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
                      {getTodaySchedule(location.schedule)}
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
