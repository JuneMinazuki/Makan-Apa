import { MapContainer, TileLayer, CircleMarker, Marker, Popup } from 'react-leaflet';
import { LocationType } from '../../data/locations.js';
import './LocationMap.css';

// Hooks and Utils
import { getIsLocationOpen, getTodaySchedule } from '../Utils/dateUtils.js';
import FlyToUserLocation from './FlyToUserLocation.js';
import { memoizedIcons } from '../Map/mapIcons.js';

function LocationMap({ userLocation, nearbyPins, defaultPosition }) {
  return (
    <MapContainer 
      center={defaultPosition} 
      zoom={16.5} 
      scrollWheelZoom={true} 
      className="leaflet-container"
    >
      <TileLayer
        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
        url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
      />

      <FlyToUserLocation userLocation={userLocation} />

      {/* User Current Location Marker */}
      {userLocation && (
        <CircleMarker 
          center={[userLocation.lat, userLocation.lng]}
          radius={9} 
          pathOptions={{ color: 'white', fillColor: '#007bff', fillOpacity: 1, weight: 2 }}
        >
          <Popup>You are here</Popup>
        </CircleMarker>
      )}

      {/* Nearby Location Markers */}
      {nearbyPins.map((location) => {
        const icon = memoizedIcons[location.type] || memoizedIcons[0];
        const isOpen = getIsLocationOpen(location.schedule);

        return (
          <Marker key={location.id} position={[location.lat, location.lng]} icon={icon}>
            <Popup>
              <div style={{ textAlign: 'center', minWidth: '160px' }}>
                <h3 style={{ margin: '0 0 4px 0' }}>{location.name}</h3>
                <p style={{ margin: 0, color: 'gray', fontSize: '0.9em' }}>
                  {LocationType[location.type] || "Unknown"}
                </p>
                <hr style={{ margin: '8px 0', border: '0', borderTop: '1px solid #eee' }}/>
                <div style={{ marginBottom: '4px' }}>
                  <span style={{ 
                    color: isOpen ? '#28a745' : '#dc3545', 
                    fontWeight: 'bold', fontSize: '0.85em' 
                  }}>
                    {isOpen ? '● Open Now' : '○ Closed'}
                  </span>
                </div>
                <small style={{ display: 'block', color: '#555' }}>
                  {getTodaySchedule(location.schedule)}
                </small>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default LocationMap;
