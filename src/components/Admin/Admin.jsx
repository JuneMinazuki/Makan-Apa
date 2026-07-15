import { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import { Link } from 'react-router-dom';
import StatusPopup from '../StatusPopup/StatusPopup.jsx';
import { iconInfomation } from '../Map/mapIcons.js';
import './Admin.css';

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  
  const [mapLocations, setMapLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTypes, setActiveTypes] = useState(Object.keys(iconInfomation));

  // Fetch locations to manage
  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchLocations() {
      try {
        setLoading(true);
        const response = await fetch('/api/admin', {
          headers: {
            'Authorization': passwordInput
          }
        });
        if (!response.ok) throw new Error('Failed to load locations for administration');
        const data = await response.json();
        setMapLocations(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchLocations();
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput.trim() !== "") {
      setIsAuthenticated(true);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete location ID: ${id}?`)) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/locations/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': passwordInput
        }
      });
      if (!response.ok) throw new Error('Failed to delete the location');
      
      setMapLocations(prev => prev.filter(loc => loc.id !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc' }}>
        <form onSubmit={handleLogin} style={{ background: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '16px', fontFamily: 'sans-serif', color: '#0f172a' }}>Admin Dashboard Access</h2>
          <input 
            type="password" 
            placeholder="Enter Admin Password" 
            value={passwordInput} 
            onChange={(e) => setPasswordInput(e.target.value)}
            style={{ padding: '10px', width: '220px', marginRight: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          />
          <button type="submit" className="action-btn view-btn" style={{ padding: '10px 16px', cursor: 'pointer' }}>Enter</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <StatusPopup loading={loading} error={error} />
      
      <Navbar activeTypes={activeTypes} setActiveTypes={setActiveTypes} showSearch={false} />

      <div className="admin-main-content">
        <div className="admin-table-area">
          <div className="table-header-row">
            <h2>Location Database Directory</h2>
          </div>
          
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category Type</th>
                  <th>Coordinates</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mapLocations.map((loc) => {
                  const typeInfo = iconInfomation[loc.type];
                  return (
                    <tr key={loc.id}>
                      <td><code>{loc.id}</code></td>
                      <td className="location-name-cell">{loc.name}</td>
                      <td>
                        <span className="type-pill">
                          <i className={`fa-solid ${typeInfo.icon}`} style={{ color: typeInfo?.color || '#000' }}></i>
                          {typeInfo?.label || `Type ${loc.type}`}
                        </span>
                      </td>
                      <td><code>{loc.lat?.toFixed(4)}, {loc.lng?.toFixed(4)}</code></td>
                      <td>
                        <div className="action-button-group">
                          <Link to={`/?selectedId=${loc.id}`} className="action-btn view-btn">View On Map</Link>
                          <button className="action-btn delete-btn" onClick={() => handleDelete(loc.id)}>✕ Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
