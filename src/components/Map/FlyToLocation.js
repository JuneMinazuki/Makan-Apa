import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { calculateDistance } from '../Utils/geoUtils';

const FlyToLocation = ({ targetLocation, onComplete, isUserLocation = false, hasSelection = false }) => {
  const map = useMap();

  useEffect(() => {
    if (isUserLocation && hasSelection) return;

    if (targetLocation) {
      const coords = Array.isArray(targetLocation) 
        ? targetLocation 
        : [targetLocation.lat, targetLocation.lng];

      const currentCenter = map.getCenter();
      const distance = calculateDistance(currentCenter.lat, currentCenter.lng, coords[0], coords[1]);

      const minDuration = 1;
      const maxDuration = 1.5;
      const minDistance = 1;  // km
      const maxDistance = 10; // km

      let dynamicDuration = minDuration + (distance - minDistance) * (maxDuration - minDuration) / (maxDistance - minDistance);
      dynamicDuration = Math.min(Math.max(dynamicDuration, minDuration), maxDuration);

      const isAlreadyThere = Math.abs(currentCenter.lat - coords[0]) < 0.0001 && Math.abs(currentCenter.lng - coords[1]) < 0.0001;

      if (isAlreadyThere) {
        if (onComplete) onComplete();
        return;
      }

      const handleMoveEnd = () => {
        if (onComplete) onComplete();
        map.off('moveend', handleMoveEnd);
      };

      map.on('moveend', handleMoveEnd);

      map.flyTo(coords, 16.5, {
        animate: true,
        duration: dynamicDuration,
        easeLinearity: 0.25
      });

      return () => map.off('moveend', handleMoveEnd);
    }
  }, [targetLocation, map, onComplete, isUserLocation, hasSelection]);

  return null;
};

export default FlyToLocation;
