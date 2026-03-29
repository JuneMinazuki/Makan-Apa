import SearchBar from './Searchbar.jsx';
import './Navbar.css';

function Navbar({ loading, error, onSearch, activeTypes, setActiveTypes }) {
  return (
    <nav className="navbar">
      <div className="nav-logo">
        <i className="fas fa-utensils"></i> Makan Apa?
      </div>

      <SearchBar 
        onSearch={onSearch} 
        activeTypes={activeTypes} 
        setActiveTypes={setActiveTypes} 
      />

      <div className="status-tags">
        {loading && <div className="loading-tag">Locating...</div>}
        {error && <div className="error-tag" title={error}>Error</div>}
      </div>
    </nav>
  );
}

export default Navbar;