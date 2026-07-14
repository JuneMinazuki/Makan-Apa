import { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import StatusPopup from '../StatusPopup/StatusPopup.jsx';
import { iconInfomation } from '../Map/mapIcons.js';
import './Admin.css';

function Admin() {
  const [mapLocations, setMapLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [activeTypes, setActiveTypes] = useState(Object.keys(iconInfomation));

  return (
    <div className="admin-container">
      <StatusPopup loading={loading} error={error} />
      
      <Navbar 
        activeTypes={activeTypes} 
        setActiveTypes={setActiveTypes} 
        showSearch={false} 
      />
    </div>
  )
}

export default Admin;
