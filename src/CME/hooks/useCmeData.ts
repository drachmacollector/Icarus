// src/cme/hooks/useCmeData.js
import { useState, useEffect } from 'react';
import { fetchCmeEvents } from '../api/cmeApi';
import { parseCmeAnalysis } from '../utils/cmeUtils';

export default function useCmeData({ startDate, endDate } = {}) {
  const [cmes, setCmes]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const raw = await fetchCmeEvents({ startDate, endDate });
        const enriched = raw.map(evt => {
          const analysis = parseCmeAnalysis(evt);
          return {
            ...evt,
            analysis,
            // fallback lat/long from analysis if you want markers
            lat: analysis.latitude,
            lng: analysis.longitude,
          };
        });
        if (mounted) setCmes(enriched);
      } catch (e) {
        console.error('CME fetch error', e);
        if (mounted) setError('Failed to load CME data');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [startDate, endDate]);

  return { cmes, loading, error };
}
