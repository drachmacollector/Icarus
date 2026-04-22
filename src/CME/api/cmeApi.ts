// src/cme/api/cmeApi.js
import axios from 'axios';
import { defaultStartDateUTC, defaultEndDateUTC } from '../../Solar Flare/utils/timeUtils';

const BASE = 'https://api.nasa.gov/DONKI/CME';
const API_KEY = 'fM6bs5qLVnqzn6z2GUIDXpdps8ZE3AhMAkC43EVa'; // or move to env

export async function fetchCmeEvents({
  startDate = defaultStartDateUTC(),
  endDate   = defaultEndDateUTC()
} = {}) {
  const params = new URLSearchParams({
    startDate,
    endDate,
    api_key: 'fM6bs5qLVnqzn6z2GUIDXpdps8ZE3AhMAkC43EVa'
  });
  const url = `${BASE}?${params.toString()}`;
  const { data } = await axios.get(url, { timeout: 100000 });
  return data;  // array of raw CME objects
}
