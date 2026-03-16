import './Navbar.css';

function Navbar({ loading, error }) {
  return (
    <nav className="navbar">
      <div className="nav-logo">Makan Apa?</div>
      {loading && <div className="loading-tag">Locating your position...</div>}
      {error && <div className="error-tag" title={error}>Couldn't retrieve your position</div>}
    </nav>
  );
}

export default Navbar;