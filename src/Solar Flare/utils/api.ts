// src/utils/api.js
import axios from 'axios';
import { defaultStartDateUTC, defaultEndDateUTC } from './timeUtils';

const BASE_URL = 'https://kauai.ccmc.gsfc.nasa.gov/DONKI/WS/get/FLR';

/**
 * Build a DONKI FLR URL with defaults.
 * @param {Object} opts
 * @param {string} opts.apiKey       Your NASA API key
 * @param {string} [opts.startDate]  YYYY-MM-DD (defaults to 30 days ago UTC)
 * @param {string} [opts.endDate]    YYYY-MM-DD (defaults to today UTC)
 * @param {string} [opts.catalog]    M2M_CATALOG | MAVEN_EUVM_FLARE_CATALOG | ALL
 * @param {string} [opts.classType]  A,B,C,M,X or comma‑separated e.g. "M,X"
 */
function buildUrl({
  apiKey,
  startDate = defaultStartDateUTC(),
  endDate   = defaultEndDateUTC(),
  catalog   = 'M2M_CATALOG',
  classType = 'ALL'
}) {
  const params = new URLSearchParams({
    startDate,
    endDate,
    catalog,
    class: classType,
    api_key: apiKey
  });
  return `${BASE_URL}?${params.toString()}`;
}

// Create an axios instance for DONKI calls
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000
});

/**
 * Fetch solar flare data from DONKI FLR endpoint.
 * @param {Object} opts    see buildUrl()
 * @returns {Promise<Array>} array of flare objects
 */
export function fetchFlareData(opts) {
  const url = buildUrl(opts);
  return api.get(url).then(res => res.data);
}
