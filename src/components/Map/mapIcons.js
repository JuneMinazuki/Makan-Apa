import L from 'leaflet';

// Icon style for each type
export const iconInfomation = Object.freeze({
  0: { color: '#238653', icon: 'fa-bowl-rice',      label: 'Kopitiam' },
  1: { color: '#e67e22', icon: 'fa-stroopwafel',    label: 'Mamak' },
  2: { color: '#64380c', icon: 'fa-utensils',       label: 'Restaurant' },
  3: { color: '#e84393', icon: 'fa-fish',           label: 'Japanese / Korean' },
  4: { color: '#43a486', icon: 'fa-pizza-slice',    label: 'Western' },
  5: { color: '#2865bb', icon: 'fa-mug-hot',        label: 'Cafe' },
  6: { color: '#bc210f', icon: 'fa-burger',         label: 'Fast Food' },
  7: { color: '#3b1c79', icon: 'fa-store',          label: 'Convenience Store' },
});

const createPin = (style) => {
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
export const memoizedIcons = Object.keys(iconInfomation).reduce((acc, key) => {
  const info = iconInfomation[key];
  acc[key] = {
    icon: createPin(info), 
    label: info.label,
  };
  return acc;
}, {});