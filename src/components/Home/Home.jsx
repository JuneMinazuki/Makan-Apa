import { useState, useMemo } from 'react';
import 'leaflet/dist/leaflet.css';
import { mapLocations, LocationType } from '../../data/locations.js';
import './Home.css';

// Hooks and Utils
import { useUserLocation } from '../Hooks/useUserLocation';
import { getNearbyLocations } from '../Utils/geoUtils.js';

// Map Components
import LocationMap from '../Map/LocationMap.jsx';
import { iconStyle } from '../Map/mapIcons.js';

function Home() {
  const position = [3.0327, 101.6188]; // Coordinates for the Puchong
  const { userLocation, error, loading } = useUserLocation();
  const [activeTypes, setActiveTypes] = useState(Object.keys(iconStyle));

  // Get nearby and filter location pin
  const nearbyPins = useMemo(() => {
    if (!userLocation) return [];
    const pins = getNearbyLocations(mapLocations, userLocation, 20);

    return pins.filter(pin => activeTypes.includes(String(pin.type)));
  }, [userLocation, activeTypes]);

  // Filter pin types
  const toggleAll = () => {
    if (activeTypes.length === Object.keys(iconStyle).length) {
      setActiveTypes([]); // Clear all if everything is currently selected
    } else {
      setActiveTypes(Object.keys(iconStyle))
    }
  };

  const toggleType = (key) => {
    setActiveTypes(prev => 
      prev.includes(key) ? prev.filter(t => t !== key) : [...prev, key]
    );
  };

  return (
    <div className="home-container">
      {/* Top Menu Bar */}
      <nav className="navbar">
        <div className="nav-logo">Makan Apa?</div>
        {loading && <div className="loading-tag">Locating your position...</div>}
        {error && <div className="error-tag" title={error}>Couldn't retrieve your position</div>}
      </nav>

      {/* Main Content Area */}
      <div className="main-content">
        <div className="map-area">
          <LocationMap 
            userLocation={userLocation} 
            nearbyPins={nearbyPins} 
            defaultPosition={position} 
          />
        </div>

        <div className="filter-sidebar">
          <h3>Category</h3>
          <div className="filter-group">
            <button 
              className={activeTypes.length === Object.keys(iconStyle).length ? 'active' : ''} 
              onClick={toggleAll}
            >
              {activeTypes.length === Object.keys(iconStyle).length ? 'Unselect All' : 'Select All'}
            </button>

            {Object.keys(iconStyle).map((key) => (
              <button 
                key={key}
                className={activeTypes.includes(key) ? 'active' : ''}
                onClick={() => toggleType(key)}
                style={{ 
                  borderLeft: `5px solid ${iconStyle[key].color}`,
                  opacity: activeTypes.includes(key) ? 1 : 0.6 
                }}
              >
                <i className={`fa-solid ${iconStyle[key].icon}`} style={{ marginRight: '8px' }}></i>
                {LocationType[key]} 
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
