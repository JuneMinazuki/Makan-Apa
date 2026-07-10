import { Link } from 'react-router-dom';
import SearchBar from './Searchbar.jsx';
import StatusPopup from '../StatusPopup/StatusPopup.jsx';
import './Navbar.css';

function Navbar({ onSearch, activeTypes, setActiveTypes, mapLocations, showSearch = true }) {
  return (
    <>
      <nav className="navbar">
        <div className="nav-logo">
          <i className="fas fa-utensils"></i> Makan Apa?
        </div>

        {showSearch ? (
          <SearchBar 
            onSearch={onSearch} 
            activeTypes={activeTypes} 
            setActiveTypes={setActiveTypes} 
            mapLocations={mapLocations}
          />
        ) : (
          <Link to="/" className="back-btn">← Back Home</Link>
        )}
      </nav>
    </>
  );
}

export default Navbar;