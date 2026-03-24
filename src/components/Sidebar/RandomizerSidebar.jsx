import './Sidebar.css';

function RandomizerSidebar({ nearbyPins, onSelect }) {
  
  const handleRandomize = () => {
    if (nearbyPins && nearbyPins.length > 0) {
      const randomIndex = Math.floor(Math.random() * nearbyPins.length);
      const randomPin = nearbyPins[randomIndex];
      onSelect(randomPin);
    } else {
      alert("No locations found! Try selecting more categories first.");
    }
  };

  return (
    <div className="randomizer-container">
      <button className="random-button" onClick={handleRandomize}>
        <i className="fa-solid fa-shuffle" style={{ marginRight: '8px' }}></i>
        Surprise Me!
      </button>
      <p className="random-hint">Can't decide? Let us pick for you.</p>
    </div>
  );
}

export default RandomizerSidebar;