import React, { useState, useRef } from 'react';
import Globe from 'react-globe.gl';
import DatePicker from 'react-datepicker';
import useCmeData from '../hooks/useCmeData';
import CmeTooltip from './cmeTooltip';

export default function CmeTracker() {
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [selected, setSelected] = useState(null);
  const globeRef = useRef();

  const { cmes, loading, error } = useCmeData({
    startDate: rangeStart ? rangeStart.toISOString().slice(0,10) : undefined,
    endDate: rangeEnd ? rangeEnd.toISOString().slice(0,10) : undefined
  });

  const handlePointClick = (cme) => {
    setSelected(cme);
  };

  const handleListItemClick = (cme) => {
    setSelected(cme);
  };

  const resetDates = () => {
    setRangeStart(null);
    setRangeEnd(null);
  };

  return (
    <div className="cme-container">
      <Globe
        ref={globeRef}
        globeImageUrl="https://unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="https://unpkg.com/three-globe/example/img/night-sky.png"
        pointsData={cmes}
        pointLat={d => d.lat}
        pointLng={d => d.lng}
        pointColor={d => {
          const speed = d.analysis.speed;
          if (speed > 1000) return '#ff0000';
          if (speed > 500) return '#ffff00';
          return '#45ff3b';
        }}
        pointAltitude={d => {
          const speed = d.analysis.speed;
          if (speed > 1000) return 0.3;
          if (speed > 500) return 0.2;
          return 0.1;
        }}
        pointRadius={d => {
          const speed = d.analysis.speed;
          if (speed > 1000) return 0.5;
          if (speed > 500) return 0.4;
          return 0.3;
        }}
        onPointClick={handlePointClick}
      />

      <CmeTooltip
        cme={selected}
        onClose={() => setSelected(null)}
      />

      <div className="cme-control-panel">
        <div className="cme-control-section">
          <label>📅 Start Date:</label>
          <DatePicker
            selected={rangeStart}
            onChange={setRangeStart}
            dateFormat="yyyy-MM-dd"
            maxDate={new Date()}
            placeholderText="Select start date"
          />
        </div>
        
        <div className="cme-control-section">
          <label>📅 End Date:</label>
          <DatePicker
            selected={rangeEnd}
            onChange={setRangeEnd}
            dateFormat="yyyy-MM-dd"
            maxDate={new Date()}
            placeholderText="Select end date"
          />
        </div>

        <button
          onClick={resetDates}
          className="cme-btn"
        >
          Reset to 30 Days
        </button>

        {loading && <div className="loading-indicator">Loading CMEs...</div>}
        {error && <div className="error-indicator">{error}</div>}

        <h3>☄️ Recent CMEs ({cmes.length})</h3>
        {cmes.map((cme, i) => (
          <div
            key={i}
            onClick={() => handleListItemClick(cme)}
            className={`cme-list-item ${selected === cme ? 'selected' : ''}`}
          >
            <p><strong>ID:</strong> {cme.activityID}</p>
            <p><strong>Time:</strong> {new Date(cme.startTime).toUTCString()}</p>
            <p><strong>Speed:</strong> {Math.round(cme.analysis.speed)} km/s</p>
            <p>
              <strong>Impact:</strong>{' '}
              {cme.analysis.speed > 1000 ? (
                <span className="impact-major">Major</span>
              ) : cme.analysis.speed > 500 ? (
                <span className="impact-moderate">Moderate</span>
              ) : (
                <span className="impact-minor">Minor</span>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}