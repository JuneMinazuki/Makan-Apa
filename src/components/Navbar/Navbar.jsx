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
          placeholder="Search for food or places..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">
          🔍
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