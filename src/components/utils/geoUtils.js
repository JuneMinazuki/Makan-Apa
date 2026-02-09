/**
 * Calculates the distance between two points in Kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
};

/**
 * Returns the top N closest locations
 */
export const getNearbyLocations = (locations, userCoords, limit = 20) => {
  if (!userCoords) return locations.slice(0, limit);

  return locations
    .map(loc => ({
      ...loc,
      distance: calculateDistance(userCoords.lat, userCoords.lng, loc.lat, loc.lng)
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
};