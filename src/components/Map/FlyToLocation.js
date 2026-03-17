import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const FlyToLocation = ({ targetLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (targetLocation) {
      const coords = Array.isArray(targetLocation) 
        ? targetLocation 
        : [targetLocation.lat, targetLocation.lng];

      map.flyTo(coords, 16.5, {
        animate: true,
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
  }, [targetLocation, map]);

  return null;
};

export default FlyToLocation;
