// src/cme/utils/cmeUtils.js

/**
 * Calculate approximate Earth arrival time based on CME speed.
 * speed in km/s from cmeAnalyses[0].speed.
 */
export function estimateArrivalTime(cme) {
  const speed = cme.cmeAnalyses?.[0]?.speed;
  if (!speed) return 'Unknown';
  const distanceKm = 149.6e6;           // 1 AU in km
  const hours = distanceKm / (speed * 1000); // speed is km/s -> m/s
  const arrivalDate = new Date(Date.now() + hours * 3600 * 1000);
  return arrivalDate.toUTCString();
}

/**
 * Pull out a convenient display speed & angle
 */
export function parseCmeAnalysis(cme) {
  const analysis = cme.cmeAnalyses?.[0] || {};
  return {
    speed: analysis.speed || 0,    // km/s
    latitude: analysis.latitude || 0,
    longitude: analysis.longitude || 0,
    arrivalTime: analysis.arrivalTime || estimateArrivalTime(cme)
  };
}
