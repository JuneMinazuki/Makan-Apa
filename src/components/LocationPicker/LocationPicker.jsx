import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editId = searchParams.get('editId');

  // Existing States
  const [position, setPosition] = useState(null);
  const [activeTypes, setActiveTypes] = useState(Object.keys(iconInfomation));

  // Form States
  const [id, setId] = useState(Math.floor(1000 + Math.random() * 9000));
  const [name, setName] = useState('');
  const [type, setType] = useState(Object.keys(iconInfomation)[0]);
  const [schedule, setSchedule] = useState([["1100", "2230"], ["1100", "2230"], ["1100", "2230"], ["1100", "2230"], ["1100", "2230"], ["1100", "2230"], ["1100", "2230"]]);

  // Status state
  const [status, setStatus] = useState({ loading: false, error: null, success: null });

  const triggerStatus = (typeStr, message) => {
    setStatus({ loading: false, error: null, success: null, [typeStr]: message });
    setTimeout(() => {
      setStatus(prev => ({ ...prev, [typeStr]: null }));
    }, 3000);
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  // Fetch location details if editing
  useEffect(() => {
    if (!editId) return;

    const adminPassword = sessionStorage.getItem('admin_password');
    if (!adminPassword) {
      alert('Unauthorized: You must be logged in as an admin to edit pins.');
      navigate('/add', { replace: true });
      return;
    }

    async function fetchPinData() {
      try {
        setStatus(prev => ({ ...prev, loading: true }));
        
        const response = await fetch(`/api/admin`, {
          headers: { 'Authorization': adminPassword }
        });

        // Handle invalid credentials or session expiration
        if (response.status === 401) {
          sessionStorage.removeItem('admin_password');
          alert('Admin session expired. Please log in again.');
          navigate('/admin');
          return;
        }

        if (!response.ok) throw new Error('Failed to fetch pin details');
        const data = await response.json();
        
        const target = data.find(item => item.id === Number(editId));
        if (!target) throw new Error('Pin location not found');

        setId(target.id);
        setName(target.name);
        setType(target.type.toString());
        setPosition({ lat: target.lat, lng: target.lng });

        // Convert schedule numbers back to time string array
        if (target.schedule) {
          const parsedSchedule = target.schedule.map(day => {
            if (day[0] === -1) return [];
            return [
              day[0].toString().padStart(4, '0'),
              day[1].toString().padStart(4, '0')
            ];
          });
          setSchedule(parsedSchedule);
        }
      } catch (err) {
        triggerStatus('error', err.message);
        navigate('/add', { replace: true });
      } finally {
        setStatus(prev => ({ ...prev, loading: false }));
      }
    }

    fetchPinData();
  }, [editId, navigate]);

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

    const adminPassword = sessionStorage.getItem('admin_password');
    const isEdit = Boolean(editId);

    if (isEdit && !adminPassword) {
      triggerStatus('error', 'Unauthorized. Only admins can edit pins.');
      return;
    }

    setStatus(prev => ({ ...prev, loading: true }));

    // Convert UI schedule state to numbers format required by backend
    const scheduleFormatted = schedule.map(day => {
      if (day.length === 0) return [-1, -1];
      return [Number(day[0]), Number(day[1])];
    });

    const payload = {
      id: Number(id),
      name: name || "Location",
      type: Number(type),
      lat: Number(position.lat.toFixed(4)),
      lng: Number(position.lng.toFixed(4)),
      schedule: scheduleFormatted
    };

    const endpoint = isEdit ? '/api/edit-location' : '/api/add-location';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          ...(isEdit && adminPassword ? { 'Authorization': adminPassword } : {})
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Operation failed');

      if (isEdit) {
        alert('Pin updated successfully!');
        navigate('/admin');
      } else {
        triggerStatus('success', 'Submitted successfully! Pending admin approval.');

        // Reset form identifier for next entry
        setId(Math.floor(1000 + Math.random() * 9000));
        setName('');
      }
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
            <h3>{editId ? `Edit Pin (ID: ${editId})` : 'Add New Location'}</h3>
            
            <div className="scrollable-form">
              <div className="input-group">
                <label>ID</label>
                <input 
                  type="number" 
                  placeholder="e.g. 1001" 
                  value={id} 
                  disabled={Boolean(editId)} 
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
                  {Object.entries(iconInfomation).map(([typeId, info]) => (
                    <option key={typeId} value={typeId}>
                      {typeId} - {info.label}
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

            <div className="edit-actions-group">
              <button className="confirm-btn no-margin" onClick={handleSubmit} disabled={status.loading}>
                {status.loading ? 'Saving...' : editId ? 'Save Changes' : 'Submit Location'}
              </button>
              {editId && (
                <button 
                  className="cancel-btn" 
                  onClick={() => navigate('/admin')}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        <MapContainer center={position ? [position.lat, position.lng] : defaultPos} zoom={14} className="full-map">
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
