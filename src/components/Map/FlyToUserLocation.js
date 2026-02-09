import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const FlyToUserLocation = ({ userLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (userLocation) {
      map.flyTo([userLocation.lat, userLocation.lng], 16.5, {
        duration: 1.5,
      });
    }
  }, [userLocation, map]);

  return null;
};

export default FlyToUserLocation;
