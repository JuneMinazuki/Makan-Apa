/**
 * Determine if the location is open right now
 */
export const getIsLocationOpen = (schedule) => {
  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.getHours() * 100 + now.getMinutes();
  const todayData = schedule[currentDay];

  if (!todayData || todayData.length !== 2) return false;

  const [openTime, closeTime] = todayData;
  return openTime < closeTime
    ? currentTime >= openTime && currentTime <= closeTime
    : currentTime >= openTime || currentTime <= closeTime;
};

/**
 * Convert time from integer to string.
 */
export const formatIntToTime = (timeInt) => {
  if (timeInt === undefined || timeInt === null) return "";
  if (timeInt === 0 || timeInt === 2400) return "12:00 AM";

  const timeStr = timeInt.toString().padStart(4, '0');
  const hours = parseInt(timeStr.slice(0, 2));
  const mins = timeStr.slice(2);
  
  const ampm = hours >= 12 && hours < 24 ? 'PM' : 'AM';
  let displayHours = hours % 12 || 12; // Simplified 0 -> 12 logic

  return `${displayHours}:${mins} ${ampm}`;
};

/**
 * Gets the formatted operating hours for the current day.
 */
export const getTodaySchedule = (schedule) => {
  if (!schedule) return "No schedule available";
  
  const day = new Date().getDay();
  const today = schedule[day];

  if (!today || today.length === 0) return "Closed Today";

  // Reusing the format function above
  return `${formatIntToTime(today[0])} - ${formatIntToTime(today[1])}`;
};
