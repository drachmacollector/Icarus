import React, { useState, useMemo, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import useFlareData from '../../Solar Flare/hooks/useFlareData';
import useCmeData from '../../CME/hooks/useCmeData';
import { buildHeatmapPoints } from '../utils/heatmapUtils';
import HeatMapGlobe from './HeatMapGlobe';

export default function HeatMapDashboard() {
  // Date range state
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  
  // Toggles
  const [showFlares, setShowFlares] = useState(true);
  const [showCmes, setShowCmes] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const infoPanelRef = useRef(null);

  // Load raw data
  const { flares } = useFlareData({
    startDate: startDate?.toISOString().slice(0, 10),
    endDate: endDate?.toISOString().slice(0, 10)
  });
  const { cmes } = useCmeData({
    startDate: startDate?.toISOString().slice(0, 10),
    endDate: endDate?.toISOString().slice(0, 10)
  });

  // Combine data based on toggles
  const points = useMemo(() => {
    const f = showFlares ? flares : [];
    const c = showCmes ? cmes : [];
    return buildHeatmapPoints(f, c);
  }, [flares, cmes, showFlares, showCmes]);

  // Handle info panel animation
  useEffect(() => {
    if (showInfo) {
      infoPanelRef.current.style.transform = 'translateX(0)';
      infoPanelRef.current.style.opacity = '1';
    } else {
      infoPanelRef.current.style.transform = 'translateX(100%)';
      infoPanelRef.current.style.opacity = '0';
    }
  }, [showInfo]);

  return (
    <div className="heatmap-dashboard">
      {/* === Heatmap Controls Overlay === */}
      <div className="heatmap-controls">
        <div className="controls-header">
          <h3>Heatmap Controls</h3>

        </div>

        <div className="control-group">
          <label>Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={setStartDate}
            dateFormat="yyyy-MM-dd"
            placeholderText="Last 30 days"
            maxDate={new Date()}
            minDate={new Date("2010-01-01")}
            className="datepicker-input"
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={15}
          />
        </div>

        <div className="control-group">
          <label>End Date</label>
          <DatePicker
            selected={endDate}
            onChange={setEndDate}
            dateFormat="yyyy-MM-dd"
            placeholderText="Today"
            maxDate={new Date()}
            minDate={new Date("2010-01-01")}
            className="datepicker-input"
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={15}
          />
        </div>

        <div className="control-group">
          <div className="checkbox-group">
            <input
              type="checkbox"
              checked={showFlares}
              onChange={() => setShowFlares(v => !v)}
              id="flr"
            />
            <label htmlFor="flr">Show Solar Flares ({flares.length})</label>
          </div>
        </div>

        <div className="control-group">
          <div className="checkbox-group">
            <input
              type="checkbox"
              checked={showCmes}
              onChange={() => setShowCmes(v => !v)}
              id="cme"
            />
            <label htmlFor="cme">Show CMEs ({cmes.length})</label>
          </div>
        </div>

        <div className="stats">
          <strong>Total points:</strong> {points.length}
        </div>
      </div>

      {/* === Information Panel - Made smaller and more subtle === */}
      <div className="heatmap-info-panel" ref={infoPanelRef}>
        <div className="info-header-heatmap">
          <h3>Understanding the Heatmap</h3>
          <button 
            className="close-info"
            onClick={() => setShowInfo(false)}
          >
            ×
          </button>
        </div>
        
        <div className="info-section-heatmap">
          <div className="info-title">
            <div className="color-indicator red"></div>
            <h4>Clusters of Activity</h4>
          </div>
          <p>Red peaks show solar flares + CMEs originating within a few degrees.</p>
        </div>
        
        <div className="info-section-heatmap">
          <div className="info-title">
            <div className="color-indicator blue"></div>
            <h4>Bandwidth</h4>
          </div>
          <p>~2.5° kernel reveals hotspots without washing out detail.</p>
        </div>
        
        <div className="info-section-heatmap">
          <div className="info-title">
            <div className="color-indicator green"></div>
            <h4>3D Hills</h4>
          </div>
          <p>Altitudes show where solar activity concentrates for quick spotting of trouble zones.</p>
        </div>
      </div>

      {/* === HeatMap Globe === */}
      <HeatMapGlobe points={points} />
    </div>
  );
}