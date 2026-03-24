import { getIsLocationOpen } from '../Utils/dateUtils.js';
import './Sidebar.css';

function RandomizerSidebar({ nearbyPins, onSelect }) {
  
  const handleRandomize = () => {
    const openPins = nearbyPins?.filter(pin => getIsLocationOpen(pin.schedule)) || [];

    if (openPins.length > 0) {
      const randomIndex = Math.floor(Math.random() * openPins.length);
      const randomPin = openPins[randomIndex];
      onSelect(randomPin);
    } else {
      alert("No locations are currently open! Try again later or check your filters.");
    }
  };

  return (
    <div className="randomizer-container">
      <button className="random-button" onClick={handleRandomize}>
        <i className="fa-solid fa-shuffle" style={{ marginRight: '8px' }}></i>
        Surprise Me!
      </button>
      <p className="random-hint">Can't decide? Let us pick an open spot for you.</p>
    </div>
  );
}

export default RandomizerSidebar;