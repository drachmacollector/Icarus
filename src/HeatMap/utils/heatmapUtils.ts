// src/HeatMap/utils/heatmapUtils.js

/**
 * Merge flare & CME arrays into heatmap points of equal weight.
 * @param {Array} flares each with {lat, lng}
 * @param {Array} cmes   each with {lat, lng}
 * @returns {Array<{lat:number,lng:number,weight:number}>}
 */
export function buildHeatmapPoints(flares = [], cmes = []) {
  const pts = [];

  flares.forEach(f => {
    if (f.lat != null && f.lng != null) {
      pts.push({ lat: f.lat, lng: f.lng, weight: 1 });
    }
  });

  cmes.forEach(c => {
    if (c.lat != null && c.lng != null) {
      pts.push({ lat: c.lat, lng: c.lng, weight: 1 });
    }
  });

  return pts;
}
