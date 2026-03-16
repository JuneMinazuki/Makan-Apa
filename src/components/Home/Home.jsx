import { useState, useMemo } from 'react';
import 'leaflet/dist/leaflet.css';
import { mapLocations } from '../../data/locations.js';
import './Home.css';

// Hooks and Utils
import { useUserLocation } from '../Hooks/useUserLocation';
import { getNearbyLocations } from '../Utils/geoUtils.js';

// Navigation Bar
import Navbar from '../Navbar/Navbar.jsx';

// Map Components
import LocationMap from '../Map/LocationMap.jsx';
import FilterSidebar from '../Sidebar/FilterSidebar.jsx';
import { iconInfomation } from '../Map/mapIcons.js';

function Home() {
  const position = [3.0327, 101.6188]; // Coordinates for the Puchong
  const { userLocation, error, loading } = useUserLocation();
  const [activeTypes, setActiveTypes] = useState(Object.keys(iconInfomation));

  // Get nearby and filter location pin
  const nearbyPins = useMemo(() => {
    if (!userLocation) return [];
    const pins = getNearbyLocations(mapLocations, userLocation, 20);

    return pins.filter(pin => activeTypes.includes(String(pin.type)));
  }, [userLocation, activeTypes]);

  return (
    <div className="home-container">
      <Navbar
        loading={loading}
        error={error}
        onSearch={(term) => console.log("Searching for:", term)}
      />

      <div className="main-content">
        <div className="map-area">
          <LocationMap 
            userLocation={userLocation} 
            nearbyPins={nearbyPins} 
            defaultPosition={position} 
          />
        </div>

        <FilterSidebar 
          activeTypes={activeTypes} 
          setActiveTypes={setActiveTypes} 
        />
      </div>
    </div>
  );
}

export default Home;
