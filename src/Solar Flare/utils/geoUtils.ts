// src/utils/geoUtils.js

/**
 * Simple mapping of heliographic (solar‑surface) coordinates
 * to Earth‐surface lat/lng for marker placement.
 * Here we just drop the heliographic latitude onto Earth's latitude,
 * and normalize longitude into [-180,180].
 */
// src/utils/geoUtils.js
export function mapHelioToEarth(helioLat, helioLon) {
  const lat = helioLat;
  let lng = helioLon;

  // Heliographic longitude can be negative or >180; wrap to -180 to 180
  if (lng > 180) lng -= 360;
  if (lng < -180) lng += 360;

  return { lat, lng };
}


/**
 * Compute the subsolar point (lat, lng) for a given UTC date.
 * This is an approximate algorithm using the solar declination and
 * the Equation of Time.
 */
export function computeSubsolarPoint(date) {
  // Convert to Julian Day
  const toJulian = d =>
    d / 86400000 + 2440587.5;
  const jd = toJulian(date.getTime());
  const n = jd - 2451545.0;

  // Mean longitude of the Sun (deg)
  const L = (280.460 + 0.9856474 * n) % 360;
  // Mean anomaly (deg)
  const g = (357.528 + 0.9856003 * n) % 360;
  // Ecliptic longitude (deg)
  const lambda =
    L +
    1.915 * Math.sin((g * Math.PI) / 180) +
    0.020 * Math.sin((2 * g * Math.PI) / 180);

  // Obliquity of the ecliptic (deg)
  const eps = 23.439 - 0.0000004 * n;

  // Declination (deg)
  const delta =
    Math.asin(
      Math.sin((eps * Math.PI) / 180) *
        Math.sin((lambda * Math.PI) / 180)
    ) *
    (180 / Math.PI);

  // Equation of Time (in minutes)
  const E =
    L / 15 -
    (lambda / 15) +
    (-0.0057183 +
      0.0419026 * Math.sin((g * Math.PI) / 180) -
      0.0003818 * Math.sin((2 * g * Math.PI) / 180));

  // Subsolar longitude = 180° − (UTC_in_hours + E) * 15°
  const utcHours =
    date.getUTCHours() +
    date.getUTCMinutes() / 60 +
    date.getUTCSeconds() / 3600;
  const subLon = ((180 - (utcHours + E) * 15) + 540) % 360 - 180;

  // Subsolar latitude is declination
  const subLat = delta;

  return { lat: subLat, lng: subLon };
}

/**
 * Determine if a given Earth lat/lng is on the sunlit hemisphere
 * relative to a subsolar point.
 */
export function isSunlit(lat, lng, subsolarPoint) {
  const toRad = deg => (deg * Math.PI) / 180;
  const φ1 = toRad(lat);
  const λ1 = toRad(lng);
  const φ2 = toRad(subsolarPoint.lat);
  const λ2 = toRad(subsolarPoint.lng);

  // Great‐circle distance via haversine
  const Δφ = φ2 - φ1;
  const Δλ = λ2 - λ1;
  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distDeg = (c * 180) / Math.PI;

  return distDeg <= 90;
}
