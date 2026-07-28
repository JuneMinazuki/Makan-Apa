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
  
  // Tab state: 'pending' or 'approved'
  const [activeTab, setActiveTab] = useState('pending');

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

  const handleApprove = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/approve-location?id=${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': passwordInput
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to approve location');
      }

      setMapLocations(prev =>
        prev.map(loc => loc.id === id ? { ...loc, is_approved: true } : loc)
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete/reject location ID: ${id}?`)) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/delete-location?id=${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': passwordInput
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete location');
      }
      
      setMapLocations(prev => prev.filter(loc => loc.id !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredLocations = mapLocations.filter(loc => 
    activeTab === 'pending' ? !loc.is_approved : loc.is_approved
  );

  return (
    <div className="admin-container">
      <StatusPopup loading={loading} error={error} />
      
      <Navbar activeTypes={activeTypes} setActiveTypes={setActiveTypes} showSearch={false} />

      <div className="admin-main-content">
        {!isAuthenticated ? (
          <div className="admin-login-area">
            <form onSubmit={handleLogin} className="admin-login-card">
              <div className="login-header">
                <h2>Password Protected Page</h2>
              </div>
              
              <div className="form-group-vertical">
                <label htmlFor="admin-password">Password</label>
                <input 
                  id="admin-password"
                  type="password" 
                  placeholder="••••••••" 
                  value={passwordInput} 
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="login-input-modern"
                  autoFocus
                />
                <button type="submit" className="login-submit-btn-modern">
                  Verify Password
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="admin-table-area">
            <div className="table-header-row">
              <h2>Location Database Directory</h2>
              
              {/* Filter Tabs */}
              <div className="admin-tabs">
                <button 
                  className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
                  onClick={() => setActiveTab('pending')}
                >
                  Pending ({mapLocations.filter(l => !l.is_approved).length})
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'approved' ? 'active' : ''}`}
                  onClick={() => setActiveTab('approved')}
                >
                  Approved ({mapLocations.filter(l => l.is_approved).length})
                </button>
              </div>
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
                  {filteredLocations.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '24px' }}>
                        No {activeTab} locations found.
                      </td>
                    </tr>
                  ) : (
                    filteredLocations.map((loc) => {
                      const typeInfo = iconInfomation[loc.type];
                      return (
                        <tr key={loc.id}>
                          <td><code>{loc.id}</code></td>
                          <td className="location-name-cell">{loc.name}</td>
                          <td>
                            <span className="type-pill">
                              <i className={`fa-solid ${typeInfo?.icon || ''}`} style={{ color: typeInfo?.color || '#000' }}></i>
                              {typeInfo?.label || `Type ${loc.type}`}
                            </span>
                          </td>
                          <td><code>{loc.lat?.toFixed(4)}, {loc.lng?.toFixed(4)}</code></td>
                          <td>
                            <div className="action-button-group">
                              {!loc.is_approved && (
                                <button className="action-btn approve-btn" onClick={() => handleApprove(loc.id)}>
                                  ✓ Approve
                                </button>
                              )}
                              <Link to={`/?selectedId=${loc.id}`} className="action-btn view-btn">
                                View On Map
                              </Link>
                              <button className="action-btn delete-btn" onClick={() => handleDelete(loc.id)}>
                                ✕ {loc.is_approved ? 'Delete' : 'Reject'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
