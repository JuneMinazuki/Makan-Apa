import { useMemo } from 'react';
import 'leaflet/dist/leaflet.css';
import { mapLocations } from '../../data/locations.js';
import './Home.css';

// Hooks and Utils
import { useUserLocation } from '../Hooks/useUserLocation';
import { getNearbyLocations } from '../Utils/geoUtils.js';

// Map Components
import LocationMap from '../Map/LocationMap.jsx';

function Home() {
  // Coordinates for the Puchong
  const position = [3.0327, 101.6188]; // Coordinates for the Puchong
  const { userLocation, error, loading } = useUserLocation();

  // Get nearby location pin
  const nearbyPins = useMemo(() => {
    if (!userLocation) return [];
    return getNearbyLocations(mapLocations, userLocation, 20);
  }, [userLocation]);

  return (
    <div className="home-container">
      {/* Top Menu Bar */}
      <nav className="navbar">
        <div className="nav-logo">Makan Apa?</div>
        {loading && <div className="loading-tag">Locating your position...</div>}
        {error && <div className="error-tag" title={error}>Couldn't retrieve your posiiton</div>}
      </nav>

      {/* Main Content Area */}
      <div className="main-content">
        <LocationMap 
          userLocation={userLocation} 
          nearbyPins={nearbyPins} 
          defaultPosition={position} 
        />
      </div>
    </div>
  );
}

export default Home;
