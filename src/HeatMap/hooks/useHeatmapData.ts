// src/HeatMap/hooks/useHeatmapData.js
import { useMemo } from 'react';
import useFlareData from '../../Solar Flare/hooks/useFlareData';
import useCmeData from '../../CME/hooks/useCmeData';
import { buildHeatmapPoints } from '../utils/heatmapUtils';

/**
 * Hook that fetches flare & CME data and builds a unified heatmap point array.
 */
export default function useHeatmapData({ startDate, endDate } = {}) {
  const { flares } = useFlareData({ startDate, endDate });
  const { cmes }   = useCmeData({ startDate, endDate });

  const heatmapPoints = useMemo(
    () => buildHeatmapPoints(flares, cmes),
    [flares, cmes]
  );

  return { points: heatmapPoints };
}
