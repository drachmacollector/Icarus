// src/hooks/useFlareData.js
import { useState, useEffect, useCallback } from 'react';
import { fetchFlareData } from '../utils/api';
import { defaultStartDateUTC, defaultEndDateUTC } from '../utils/timeUtils';
import { mapHelioToEarth } from '../utils/geoUtils';

/**
 * Custom hook to fetch, cache, and refresh DONKI Solar Flare data.
 */
export default function useFlareData({ startDate, endDate } = {}) {
  const [flares, setFlares] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchFlareData({
        startDate: startDate || defaultStartDateUTC(),
        endDate: endDate || defaultEndDateUTC(),
        catalog: 'ALL',
        classType: 'ALL',
        apiKey: 'fM6bs5qLVnqzn6z2GUIDXpdps8ZE3AhMAkC43EVa'
      });

      const processed = data.map(event => {
        const loc = event.sourceLocation;
        let lat = null;
        let lng = null;

        if (loc && /^[NS]\d+(\.\d+)?[EW]\d+(\.\d+)?$/.test(loc)) {
          const [, ns, latStr, ew, lonStr] = loc.match(/^([NS])(\d+(?:\.\d+)?)([EW])(\d+(?:\.\d+)?)$/);
          const helioLat = (ns === 'N' ? 1 : -1) * parseFloat(latStr);
          const helioLon = (ew === 'E' ? 1 : -1) * parseFloat(lonStr);
          const coords = mapHelioToEarth(helioLat, helioLon);
          lat = coords.lat;
          lng = coords.lng;
        }

        return {
          ...event,
          lat,
          lng,
          color: 'orange',
          size: 0.4
        };
      });

      setFlares(processed);
    } catch (err) {
      console.error('Error fetching flare data:', err);
      setError('Failed to load solar flare data.');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { flares, loading, error, refresh: loadData };
}
