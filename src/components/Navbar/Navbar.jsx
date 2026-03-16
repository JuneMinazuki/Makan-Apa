import { useState } from 'react';
import './Navbar.css';

function Navbar({ loading, error, onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">Makan Apa?</div>

      {/* Search Form */}
      <form className="search-container" onSubmit={handleSearchSubmit}>
        <input 
          type="text" 
          placeholder="Search for places..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="search-icon"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </form>

      <div className="status-tags">
        {loading && <div className="loading-tag">Locating...</div>}
        {error && <div className="error-tag" title={error}>Error</div>}
      </div>
    </nav>
  );
}

export default Navbar;