// src/aurora/api/auroraApi.js
import axios from 'axios';

const NOAA_KP_URL =
  'https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json';

/**
 * Fetch the next-24h Kp-index forecast from NOAA SWPC.
 * Returns an array of objects: [{ timeTag: string, kp: number }, …].
 */
export async function fetchKpForecast() {
  const { data } = await axios.get(NOAA_KP_URL, { timeout: 20000 });
  // The first row is header, so slice from index 1
  return data.slice(1).map(([timeTag, kp]) => ({
    timeTag,
    kp: Number(kp)
  }));
}
