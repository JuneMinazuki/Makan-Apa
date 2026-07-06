import { useState, useMemo, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { mapLocations } from '../../data/locations.js';
import './Home.css';

// Neon Database Instance
import { neon } from '../Utils/neon.js';

// Hooks and Utils
import { useUserLocation } from '../Hooks/useUserLocation';

// Navigation Bar
import Navbar from '../Navbar/Navbar.jsx';

// Map Components
import LocationMap from '../Map/LocationMap.jsx';
import FilterSidebar from '../Sidebar/FilterSidebar.jsx';
import RandomizerSidebar from '../Sidebar/RandomizerSidebar.jsx';
import { iconInfomation } from '../Map/mapIcons.js';

function Home() {
  const position = [3.0327, 101.6188]; // Coordinates for Puchong
  const { userLocation, error, loading } = useUserLocation();
  const [activeTypes, setActiveTypes] = useState(Object.keys(iconInfomation));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Store past randomly picked location
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem('randomHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  useEffect(() => {
    localStorage.setItem('randomHistory', JSON.stringify(history));
  }, [history]);

  const addToHistory = (location) => {
    setHistory((prev) => {
      const filtered = prev.filter(item => item.id !== location.id); // Avoid duplicates
      return [location, ...filtered].slice(0, 10); // Keep last 10 entries
    });
  };

  // Get filtered location pin
  const filteredPins = useMemo(() => {
    return mapLocations.filter(pin => activeTypes.includes(String(pin.type)));
  }, [activeTypes]);

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
            filteredPins={filteredPins} 
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
            filteredPins={filteredPins} 
            userLocation={userLocation}
            loading={loading}
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
