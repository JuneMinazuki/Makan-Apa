import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './LocationPicker.css';

import Navbar from '../Navbar/Navbar.jsx';
import FlyToLocation from '../Map/FlyToLocation';
import { iconInfomation } from '../Map/mapIcons.js';

function ClickHandler({ setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return null;
}

function LocationPicker() {
  const defaultPos = [3.0327, 101.6188];
  
  // Existing States
  const [position, setPosition] = useState(null);
  const [activeTypes, setActiveTypes] = useState(Object.keys(iconInfomation));

  // New Form States
  const [id, setId] = useState(Math.floor(1000 + Math.random() * 9000));
  const [name, setName] = useState('');
  const [type, setType] = useState(Object.keys(iconInfomation)[0]);
  const [schedule, setSchedule] = useState([["1100", "2230"], ["1100", "2230"], ["1100", "2230"], ["1100", "2230"], ["1100", "2230"], ["1100", "2230"], ["1100", "2230"]]);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleScheduleChange = (dayIndex, timeIndex, value) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex][timeIndex] = value;
    setSchedule(newSchedule);
  };

  const toggleDayClosed = (dayIndex) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex] = newSchedule[dayIndex].length === 0 ? ["1100", "2230"] : [];
    setSchedule(newSchedule);
  };

  const generateOutput = () => {
    if (!position) return '';

    const lat = position.lat.toFixed(4);
    const lng = position.lng.toFixed(4);
    
    const scheduleFormatted = schedule
      .map(day => (day.length === 0 ? '[]' : `[${day[0]}, ${day[1]}]`))
      .join(', ');

    return `  {
    id: ${id},
    name: "${name || "New Location"}",
    type: ${Number(type)},
    lat: ${lat},
    lng: ${lng},
    schedule: [${scheduleFormatted}]
  },`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateOutput());
    alert("Copied to clipboard!");
  };

  return (
    <div className="location-picker-page">
      <Navbar 
        activeTypes={activeTypes} 
        setActiveTypes={setActiveTypes}
        onSearch={(loc) => setPosition(loc)} 
        showSearch={false}
      />

      <div className="picker-container">
        <div className="picker-ui">        
          <div className="coords-card">
            <h3>Add New Location</h3>
            
            <div className="scrollable-form">
              <div className="input-group">
                <label>ID</label>
                <input 
                  type="number" 
                  placeholder="e.g. 1001" 
                  value={id} 
                  onChange={(e) => setId(e.target.value)} 
                />
              </div>

              <div className="input-group">
                <label>Location Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Family Mart" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>

              <div className="input-group">
                <label>Type ID</label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  {Object.entries(iconInfomation).map(([id, info]) => (
                    <option key={id} value={id}>
                      {id} - {info.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="coords-display">
                 <span className="label">Coordinates</span>
                {position ? (
                  <code>{position.lat.toFixed(4)}, {position.lng.toFixed(4)}</code>
                ) : (
                  <p className="hint">Click map to set location</p>
                )}
              </div>

              <div className="schedule-section">
                <label>Schedule (HHMM)</label>
                {days.map((day, index) => (
                  <div key={day} className="day-row">
                    <span className="day-label">{day}</span>
                    {schedule[index].length > 0 ? (
                      <>
                        <input 
                          type="text" 
                          maxLength="4"
                          value={schedule[index][0]} 
                          onChange={(e) => handleScheduleChange(index, 0, e.target.value)} 
                        />
                        <span>-</span>
                        <input 
                          type="text" 
                          maxLength="4"
                          value={schedule[index][1]} 
                          onChange={(e) => handleScheduleChange(index, 1, e.target.value)} 
                        />
                      </>
                    ) : (
                      <span className="closed-text">Closed</span>
                    )}
                    <button className="toggle-day" onClick={() => toggleDayClosed(index)}>
                      {schedule[index].length > 0 ? "×" : "+"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {position && (
              <button className="confirm-btn" onClick={copyToClipboard}>
                Copy Object to Clipboard
              </button>
            )}
          </div>
        </div>

        <MapContainer center={defaultPos} zoom={13} className="full-map">
          <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
          <ClickHandler setPosition={setPosition} />
          <FlyToLocation targetLocation={position} />
          {position && <Marker position={position} />}
        </MapContainer>
      </div>
    </div>
  );
}

export default LocationPicker;
