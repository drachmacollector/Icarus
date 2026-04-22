// src/aurora/utils/auroraUtils.js

/**
 * Given a Kp value [0–9], return a latitude boundary for the auroral oval:
 * higher Kp → aurora extends toward lower latitudes.
 */
export function kpToLatitudeBoundary(kp) {
  // approximate: Kp 0 → 75°; Kp9 → 45°
  return 75 - (kp / 9) * 30;
}

/**
 * Generate polygon coordinates for a circle of given latitude.
 * @param {number} lat circle latitude (deg)
 * @param {number} segments number of points around the circle
 * @returns {Array<[lng, lat]>}
 */
export function circleCoordinates(lat, segments = 60) {
  const coords = [];
  for (let i = 0; i < segments; i++) {
    const theta = (i / segments) * 2 * Math.PI;
    const lng = (theta * 180) / Math.PI - 180;
    coords.push([lng, lat]);
  }
  return coords;
}

/**
 * Build polygonData array for react‑globe.gl from a single Kp forecast entry.
 * Returns two objects: northern and southern ovals.
 */
export function buildAuroraPolygons(kpEntry) {
  const boundary = kpToLatitudeBoundary(kpEntry.kp);
  const northCoords = circleCoordinates(boundary);
  const southCoords = circleCoordinates(-boundary);

  return [
    {
      polygon: northCoords,
      color: `rgba(0, 255, 150, 0.4)`,
      altitude: 0.01
    },
    {
      polygon: southCoords,
      color: `rgba(0, 255, 150, 0.4)`,
      altitude: 0.01
    }
  ];
}
