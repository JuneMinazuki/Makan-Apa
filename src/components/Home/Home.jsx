import { useState, useMemo, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import './Home.css';

// Neon Database Instance
import { neon } from '@neondatabase/serverless';

// Hooks and Utils
import { useUserLocation } from '../Hooks/useUserLocation';

// Components
import Navbar from '../Navbar/Navbar.jsx';
import LocationMap from '../Map/LocationMap.jsx';
import FilterSidebar from '../Sidebar/FilterSidebar.jsx';
import RandomizerSidebar from '../Sidebar/RandomizerSidebar.jsx';
import StatusPopup from '../StatusPopup/StatusPopup.jsx';
import { iconInfomation } from '../Map/mapIcons.js';

function Home() {
  const position = [3.0327, 101.6188]; // Coordinates for Puchong
  const { userLocation, error: locationError, loading: locationLoading } = useUserLocation();
  const [activeTypes, setActiveTypes] = useState(Object.keys(iconInfomation));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mapLocations, setMapLocations] = useState([]);
  const [dbLoading, setDbLoading] = useState(true);
  const [dbError, setDbError] = useState(null);

  // Fetch data from Neon Database
  useEffect(() => {
    async function fetchLocations() {
      try {
        setDbLoading(true);
        
        const response = await fetch('/api/locations');
        if (!response.ok) throw new Error('Failed to fetch map locations');
        
        const data = await response.json();
        setMapLocations(data || []);
      } catch (err) {
        console.error("Failed to fetch locations:", err);
        setDbError(err.message);
      } finally {
        setDbLoading(false);
      }
    }

    fetchLocations();
  }, []);

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
  }, [activeTypes, mapLocations]);

  // Fly to selected location after searching
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    if (mapLocations.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const selectedId = params.get('selectedId');

      if (selectedId) {
        const matchedLocation = mapLocations.find(loc => String(loc.id) === String(selectedId));
        
        if (matchedLocation) {
          setSelectedLocation(matchedLocation);
          
          const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
          window.history.replaceState({ path: newUrl }, '', newUrl);
        }
      }
    }
  }, [mapLocations]);

  const handleSearch = (location) => setSelectedLocation(location);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const anyLoading = locationLoading || dbLoading;
  const anyError = locationError || dbError;

  return (
    <div className="home-container">
      <StatusPopup 
        loading={anyLoading} 
        error={anyError} 
      />

      <Navbar
        onSearch={handleSearch}
        activeTypes={activeTypes}
        setActiveTypes={setActiveTypes}
        mapLocations={mapLocations}
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
            loading={locationLoading}
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
