/**
 * Determine if the location is open right now
 */
export const getIsLocationOpen = (schedule) => {
  if (!schedule) return false;
  
  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.getHours() * 100 + now.getMinutes();
  const todayData = schedule[currentDay];

  if (!todayData || todayData.length === 0) return false;

  const [openTime, closeTime] = todayData;
  if (openTime < closeTime) {
    return currentTime >= openTime && currentTime < closeTime; // Normal hours
  } else {
    return currentTime >= openTime || currentTime < closeTime; // Overnight hours
  }
};

/**
 * Convert time from integer to string.
 */
export const formatIntToTime = (timeInt) => {
  if (timeInt === undefined || timeInt === null) return "Closed";
  
  const hours = Math.floor(timeInt / 100) % 24;
  const mins = timeInt % 100;
  
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  const displayMins = mins < 10 ? `0${mins}` : mins;

  return `${hours12}:${displayMins} ${ampm}`;
};

/**
 * Gets the formatted operating hours for the current day.
 */
export const getTodaySchedule = (schedule) => {
  const day = new Date().getDay();
  const today = schedule?.[day];

  if (!today || today.length === 0) return "Closed Today";

  return `${formatIntToTime(today[0])} - ${formatIntToTime(today[1])}`;
};