import { useState, useEffect, useCallback } from 'react';

export const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const getPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error getting location:", err);
        setError("Unable to retrieve your location.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, []);

  useEffect(() => {
    getPosition();
  }, [getPosition]);

  return { userLocation, error, loading, refreshLocation: getPosition };
};
