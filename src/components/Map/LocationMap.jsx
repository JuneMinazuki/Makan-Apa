import { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import './LocationMap.css';

// Hooks and Utils
import { getIsLocationOpen, getTodaySchedule } from '../Utils/dateUtils.js';
import FlyToLocation from './FlyToLocation.js';
import { memoizedIcons, iconInfomation } from '../Map/mapIcons.js';

function LocationMap({ userLocation, filteredPins, defaultPosition, selectedLocation }) {
  const markerRefs = useRef({});

  const createCustomClusterIcon = (cluster) => {
    const markers = cluster.getAllChildMarkers();
    const typeCounts = {};

    // Find type with most count
    markers.forEach((m) => {
      const type = m.options.type;
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    const dominantType = Object.keys(typeCounts).reduce((a, b) =>
      typeCounts[a] > typeCounts[b] ? a : b
    );

    const config = iconInfomation[dominantType] || iconInfomation[2];

    return L.divIcon({
      html: `
        <div class="custom-cluster-node" style="background-color: ${config.color};">
          <span class="cluster-count">${cluster.getChildCount()}</span>
          <i class="fa-solid ${config.icon} cluster-mini-icon"></i>
        </div>
      `,
      className: 'custom-cluster-container',
      iconSize: L.point(40, 40),
      iconAnchor: [20, 20],
    });
  };

  const openSelectedPopup = () => {
    if (selectedLocation && markerRefs.current[selectedLocation.id]) {
      setTimeout(() => {
        const marker = markerRefs.current[selectedLocation.id];
        if (marker) {
          marker.openPopup();
        }
      }, 100);
    }
  };

  return (
    <MapContainer 
      center={defaultPosition} 
      zoom={16.5} 
      scrollWheelZoom={true} 
      className="leaflet-container"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      <FlyToLocation targetLocation={userLocation} /> {/* Fly to user location */}
      <FlyToLocation
        targetLocation={selectedLocation} 
        onComplete={openSelectedPopup} 
      /> {/* Fly to selected store */}

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
      <MarkerClusterGroup 
        chunkedLoading 
        iconCreateFunction={createCustomClusterIcon}
        maxClusterRadius={50}
        disableClusteringAtZoom={16} 
        spiderfyOnMaxZoom={true}
        removeOutsideVisibleBounds={true}
      >
        {filteredPins.map((location) => {
          const iconData = memoizedIcons[location.type] || memoizedIcons[2];
          const isOpen = getIsLocationOpen(location.schedule);

          return (
            <Marker
              key={location.id}
              position={[location.lat, location.lng]}
              icon={iconData.icon}
              type={location.type}
              ref={(ref) => {
                if (ref) markerRefs.current[location.id] = ref;
                else delete markerRefs.current[location.id];
              }}
            >
              <Popup>
                <div style={{ textAlign: 'center', minWidth: '160px' }}>
                  <h3 style={{ margin: '0 0 4px 0' }}>{location.name}</h3>
                  <p style={{ margin: 0, color: 'gray', fontSize: '0.9em' }}>
                    {iconData.label}
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
      </MarkerClusterGroup>
    </MapContainer>
  );
}

export default LocationMap;
