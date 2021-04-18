/**
 * Get duration between two date objects
 * NOTE: the duration will always be positive, which mean the arguments order won't affect the result
 * @param {Date} dateStart
 * @param {Date} [dateEnd]
 */
 export function getDurationHrs(dateStart, dateEnd = new Date()) {
  const durationMillisec = Math.abs(dateEnd.getTime() - dateStart.getTime())
  // convert milliseconds to hours
  return durationMillisec / 1000 / 60 / 60
}
