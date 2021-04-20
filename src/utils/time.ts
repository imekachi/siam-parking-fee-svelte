/**
 * Get duration between two date objects
 * NOTE: the duration will always be positive, which mean the arguments order won't affect the result
 */
 export function getDurationHrs(dateStart: Date, dateEnd: Date = new Date()): number {
  const durationMillisec = Math.abs(dateEnd.getTime() - dateStart.getTime())
  // convert milliseconds to hours
  return durationMillisec / 1000 / 60 / 60
}
