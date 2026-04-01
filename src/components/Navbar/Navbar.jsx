import SearchBar from './Searchbar.jsx';
import './Navbar.css';

function Navbar({ loading, error, onSearch, activeTypes, setActiveTypes }) {
  return (
    <>
      <nav className="navbar">
        <div className="nav-logo">
          <i className="fas fa-utensils"></i> Makan Apa?
        </div>

        <SearchBar 
          onSearch={onSearch} 
          activeTypes={activeTypes} 
          setActiveTypes={setActiveTypes} 
        />
      </nav>

      <div className="status-popup-container">
        {loading && (
          <div className="status-popup loading">
            <i className="fas fa-spinner fa-spin"></i> Locating...
          </div>
        )}
        {error && (
          <div className="status-popup error" title={error}>
            <i className="fas fa-exclamation-circle"></i> Error: {error}
          </div>
        )}
      </div>
    </>
  );
}

export default Navbar;