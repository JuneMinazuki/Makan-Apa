import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './LocationPicker.css';

import Navbar from '../Navbar/Navbar.jsx';
import FlyToLocation from '../Map/FlyToLocation';
import { iconInfomation, memoizedIcons } from '../Map/mapIcons.js';
import StatusPopup from '../StatusPopup/StatusPopup.jsx';
import { intToTimeString, timeStringToInt } from '../Utils/dateUtils.js';

function ClickHandler({ setPosition }) {
  useMapEvents({
    click(e) {
      if (e.originalEvent.target.classList.contains('leaflet-container')) {
        setPosition(e.latlng);
      }
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

  // Status state
  const [status, setStatus] = useState({ loading: false, error: null, success: null });

  const triggerStatus = (type, message) => {
    setStatus({ loading: false, error: null, success: null, [type]: message });
    setTimeout(() => {
      setStatus(prev => ({ ...prev, [type]: null }));
    }, 3000);
  };

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

  const handleSubmit = async () => {
    if (!position) return;

    setStatus(prev => ({ ...prev, loading: true }));

    // Convert UI schedule state to numbers format required by backend
    const scheduleFormatted = schedule.map(day => {
      if (day.length === 0) return [-1, -1];
      return [Number(day[0]), Number(day[1])];
    });

    const payload = {
      id: Number(id),
      name: name || "New Location",
      type: Number(type),
      lat: Number(position.lat.toFixed(4)),
      lng: Number(position.lng.toFixed(4)),
      schedule: scheduleFormatted
    };

    try {
      const response = await fetch('/api/add-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Failed to submit location');

      triggerStatus('success', 'Submitted successfully! Pending admin approval.');
      
      // Reset form identifier for next entry
      setId(Math.floor(1000 + Math.random() * 9000));
      setName('');
    } catch (err) {
      triggerStatus('error', err.message);
    }
  };

  const applyToAllDays = () => {
    const sundaySchedule = schedule[0];
    setSchedule(schedule.map(() => [...sundaySchedule]));
  };

  const set24Hours = (dayIndex) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex] = ["0000", "2400"];
    setSchedule(newSchedule);
  };

  function LocateButton({ setPosition }) {
    const map = useMapEvents({
      locationfound(e) {
        setStatus(prev => ({ ...prev, loading: false }));
        setPosition(e.latlng);
        map.flyTo(e.latlng, 16);
      },
      locationerror() {
        triggerStatus('error', 'Location access denied or unavailable.');
      }
    });

    return (
      <button 
        className="locate-me-fab" 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setStatus(prev => ({ ...prev, loading: true }));
          map.locate();
        }}
        title="Get Current Location"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
          <line x1="12" y1="1" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="23"/>
          <line x1="1" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="23" y2="12"/>
        </svg>
      </button>
    );
  }

  return (
    <div className="location-picker-page">
      <StatusPopup {...status} />
      
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
                <div className="schedule-header">
                  <label>Schedule</label>
                  <button 
                    type="button" 
                    className="apply-all-btn" 
                    onClick={applyToAllDays}
                    title="Copy Sun schedule to all days"
                  >
                    Copy Sun to All
                  </button>
                </div>

                {days.map((day, index) => (
                  <div key={day} className="day-row">
                    <span className="day-label">{day}</span>
                    {schedule[index].length > 0 ? (
                      <>
                        <input 
                          type="time" 
                          value={intToTimeString(schedule[index][0])} 
                          onChange={(e) => handleScheduleChange(index, 0, timeStringToInt(e.target.value))} 
                        />
                        <span>-</span>
                        <input 
                          type="time"
                          value={intToTimeString(schedule[index][1])}
                          onChange={(e) => handleScheduleChange(index, 1, timeStringToInt(e.target.value))}
                        />
                        <button type="button" className="quick-24h-btn" onClick={() => set24Hours(index)} title="Set to 24 hours">
                          24h
                        </button>
                      </>
                    ) : (
                      <span className="closed-text">Closed</span>
                    )}
                    <button type="button" className="toggle-day" onClick={() => toggleDayClosed(index)}>
                      {schedule[index].length > 0 ? "×" : "+"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {position && (
              <button className="confirm-btn" onClick={handleSubmit} disabled={status.loading}>
                {status.loading ? 'Submitting...' : 'Submit Location'}
              </button>
            )}
          </div>
        </div>

        <MapContainer center={defaultPos} zoom={13} className="full-map">
          <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
          <ClickHandler setPosition={setPosition} />
          <FlyToLocation targetLocation={position} />
          {position && (
            <Marker 
              position={position} 
              icon={memoizedIcons[type]?.icon} 
            />
          )}
          <LocateButton setPosition={setPosition} />
        </MapContainer>
      </div>
    </div>
  );
}

export default LocationPicker;
