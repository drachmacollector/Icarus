import React, { useState } from 'react';
import useAuroraData from '../hooks/useAuroraData';
import AuroraGlobe from './AuroraGlobe';
import AuroraTimeline from './AuroraTimeline';

export default function AuroraForecast() {
  const { kpForecast, loading, error } = useAuroraData();
  const [selected, setSelected] = useState(null);
  const [showInfo, setShowInfo] = useState(true);

  // Default to first hour if none selected
  const active = selected || kpForecast[0];

  return (
    <div className="aurora-container">
      
      <div className="aurora-content">
        <div className="aurora-globe-section">
          {loading && <div className="aurora-status">Loading…</div>}
          {error && <div className="aurora-status error">{error}</div>}
          <AuroraGlobe kpEntry={active} />
        </div>

        {showInfo && (
          <div className="aurora-info-panel">
            <div className="info-header-aurora">
              <h3>Aurora Forecast at a Glance</h3>
              <button 
                className="close-info"
                onClick={() => setShowInfo(false)}
              >
                ×
              </button>
            </div>
            
            <div className="info-section">
              <h4>Kp Index 0–9</h4>
              <p>Global measure of geomagnetic disturbance. ≥5 = visible auroras.</p>
            </div>
            
            <div className="info-section">
              <h4>Oval Migration</h4>
              <p>Higher Kp pushes aurora equatorward (Kp 2 → ~75° lat; Kp 7 → ~55° lat).</p>
            </div>
            
            <div className="info-section">
              <h4>24‑Hour Timeline</h4>
              <p>Click any hour to see aurora position at that UTC time.</p>
            </div>
            
            <div className="info-section">
              <h4>Color & Height</h4>
              <p>Aqua rings mark forecast oval; denser clumps = stronger displays.</p>
            </div>
          </div>
        )}
      </div>

      <div className="aurora-timeline-section">
        <div className="aurora-timeline-header">
          <h3>Kp Index Forecast Timeline</h3>
          <p>Click a bar to see aurora strength for that hour</p>
        </div>
        <AuroraTimeline kpForecast={kpForecast} onSelectHour={setSelected} />
        <div className="aurora-footer">
          <a 
            href="https://www.swpc.noaa.gov/products/planetary-k-index" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Learn more about Aurora Forecasts →
          </a>
        </div>
      </div>
    </div>
  );
}