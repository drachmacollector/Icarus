// src/aurora/hooks/useAuroraData.js
import { useState, useEffect } from 'react';
import { fetchKpForecast } from '../api/auroraApi';

export default function useAuroraData() {
  const [kpForecast, setKpForecast] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchKpForecast();
        if (mounted) setKpForecast(data.slice(0, 24)); // next 24 h
      } catch (e) {
        console.error('Aurora fetch error', e);
        if (mounted) setError('Failed to load aurora data');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return { kpForecast, loading, error };
}
