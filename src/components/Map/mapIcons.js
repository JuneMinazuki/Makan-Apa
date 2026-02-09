import L from 'leaflet';

// Icon style for each type
export const iconStyle = Object.freeze({
  0: { color: '#238653', icon: 'fa-bowl-rice' },  // Kopitiam
  1: { color: '#2865bb', icon: 'fa-mug-hot' },    // Cafe
  2: { color: '#64380c', icon: 'fa-utensils' },   // Restaurant
  3: { color: '#bc210f', icon: 'fa-burger' },     // Fast Food
});

const createPin = (typeId) => {
  const style = iconStyle[typeId] || { color: '#666666', icon: 'fa-house' };
  return L.divIcon({
    className: 'custom-fa-icon',
    html: `<div style="background-color: ${style.color};" class="marker-circle">
             <i class="fa-solid ${style.icon}"></i>
           </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

// Generate the icons once
export const memoizedIcons = Object.keys(iconStyle).reduce((acc, key) => {
  acc[key] = createPin(key);
  return acc;
}, {});