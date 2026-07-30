/**
 * Determine if the location is open right now
 */
export const getIsLocationOpen = (schedule) => {
  if (!schedule) return false;
  
  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.getHours() * 100 + now.getMinutes();
  const todayData = schedule[currentDay];

  if (!todayData || todayData.length === 0 || todayData[0] === -1) return false;

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
  if (timeInt === undefined || timeInt === null || timeInt === -1) return "Closed";
  
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

  if (!today || today.length === 0 || today[0] === -1) return "Closed Today";

  return `${formatIntToTime(today[0])} - ${formatIntToTime(today[1])}`;
};

/**
 * Convert integer time format ("1100" or 1100) to standard string "11:00" for HTML time inputs.
 */
export const intToTimeString = (val) => {
  if (val === undefined || val === null || val === -1) return "00:00";
  const str = String(val).padStart(4, "0");
  return `${str.slice(0, 2)}:${str.slice(2, 4)}`;
};

/**
 * Convert HTML standard time string "11:00" to format "1100" for backend compatibility.
 */
export const timeStringToInt = (val) => {
  if (!val) return "0000";
  return val.replace(":", "");
};