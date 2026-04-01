import SearchBar from './Searchbar.jsx';
import StatusPopup from '../StatusPopup/StatusPopup.jsx';
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

      <StatusPopup loading={loading} error={error} />
    </>
  );
}

export default Navbar;