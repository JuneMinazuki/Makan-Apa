import { useState, useEffect, useRef } from 'react';
import { mapLocations } from '../../data/locations.js';
import { iconInfomation } from '../Map/mapIcons.js';
import './Navbar.css';

function Navbar({ loading, error, onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update dropdown whenever search term changes
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const results = mapLocations.filter(loc =>
        loc.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setFilteredResults(results.slice(0, 5));
      
      const isExactMatch = results.some(loc => loc.name === searchTerm);
      if (!isExactMatch) {
        setShowDropdown(true);
      } else {
        setShowDropdown(false);
      }
    } else {
      setFilteredResults([]);
      setShowDropdown(false);
    }
  }, [searchTerm]);

  const handleSelect = (location) => {
    setSearchTerm(location.name);
    setShowDropdown(false);
    setFilteredResults([]);
    if (onSearch) {
      onSearch(location);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">Makan Apa?</div>

      <div className="search-wrapper" ref={dropdownRef}>
        {/* Search Form */}
        <form className="search-container" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="text" 
            placeholder="Search for places..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm && setShowDropdown(true)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="search-icon">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </form>

        {showDropdown && filteredResults.length > 0 && (
          <ul className="search-dropdown">
            {filteredResults.map((loc) => {
              const typeInfo = iconInfomation[loc.type] || { label: 'Unknown', color: '#666', icon: 'fa-location-dot' };
              
              return (
                <li key={loc.id} onClick={() => handleSelect(loc)}>
                  <div className="type-icon-wrapper">
                    <i 
                      className={`fa-solid ${typeInfo.icon}`} 
                      style={{ color: typeInfo.color }}
                    ></i>
                  </div>

                  <div className="location-content">
                    <span className="location-name">{loc.name}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="status-tags">
        {loading && <div className="loading-tag">Locating...</div>}
        {error && <div className="error-tag" title={error}>Error</div>}
      </div>
    </nav>
  );
}

export default Navbar;