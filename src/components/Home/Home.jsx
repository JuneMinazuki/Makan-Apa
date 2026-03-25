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
import RandomizerSidebar from '../Sidebar/RandomizerSidebar.jsx';
import { iconInfomation } from '../Map/mapIcons.js';

function Home() {
  const position = [3.0327, 101.6188]; // Coordinates for the Puchong
  const { userLocation, error, loading } = useUserLocation();
  const [activeTypes, setActiveTypes] = useState(Object.keys(iconInfomation));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Get nearby and filter location pin
  const nearbyPins = useMemo(() => {
    if (!userLocation) return [];
    const pins = getNearbyLocations(mapLocations, userLocation, 20, 10);

    return pins.filter(pin => activeTypes.includes(String(pin.type)));
  }, [userLocation, activeTypes]);

  // Fly to selected location after searching
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleSearch = (location) => setSelectedLocation(location);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="home-container">
      <Navbar
        loading={loading}
        error={error}
        onSearch={handleSearch}
        activeTypes={activeTypes}
        setActiveTypes={setActiveTypes}
      />

      {/* Mobile Sidebar Toggle */}
      <button 
        className={`sidebar-toggle ${isSidebarOpen ? 'open' : ''}`} 
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        {isSidebarOpen ? '✕' : '☰ Filters'}
      </button>

      <div className="main-content">
        <div className="map-area">
          <LocationMap 
            userLocation={userLocation} 
            nearbyPins={nearbyPins} 
            defaultPosition={position} 
            selectedLocation={selectedLocation}
          />
        </div>

        <div className={`sidebar-wrapper ${isSidebarOpen ? 'active' : ''}`}>
          <FilterSidebar 
            activeTypes={activeTypes} 
            setActiveTypes={setActiveTypes} 
          />

          <RandomizerSidebar 
            nearbyPins={nearbyPins} 
            onSelect={(loc) => {
              setSelectedLocation(loc);
              setIsSidebarOpen(false);
            }} 
          />
        </div>
      </div>
      
      {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </div>
  );
}

export default Home;
