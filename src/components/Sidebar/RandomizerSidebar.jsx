import { useState, useEffect } from 'react';
import { getIsLocationOpen } from '../Utils/dateUtils.js';
import StatusPopup from '../StatusPopup/StatusPopup.jsx';
import './Sidebar.css';

function RandomizerSidebar({ nearbyPins, onSelect }) {
  const [error, setError] = useState(null);

  // Automatically close popup after a few seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleRandomize = () => {
    const openPins = nearbyPins?.filter(pin => getIsLocationOpen(pin.schedule)) || [];

    if (openPins.length > 0) {
      setError(null);
      const randomIndex = Math.floor(Math.random() * openPins.length);
      const randomPin = openPins[randomIndex];
      onSelect(randomPin);
    } else {
      setError("No locations are currently open! Try again later.");
    }
  };

  return (
    <div className="randomizer-container">
      <StatusPopup error={error} loading={false} />

      <button className="random-button" onClick={handleRandomize}>
        <i className="fa-solid fa-shuffle" style={{ marginRight: '8px' }}></i>
        Surprise Me!
      </button>
      <p className="random-hint">Can't decide? Let us pick an open spot for you.</p>
    </div>
  );
}

export default RandomizerSidebar;