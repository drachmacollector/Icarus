// src/Solar Flare/components/GlobeVisualizer.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import DatePicker from 'react-datepicker';
import { computeSubsolarPoint } from '../utils/geoUtils';
import useFlareData from "../hooks/useFlareData";
import RiskDashboard from "../components/RiskDashboard";
import { format } from 'date-fns';

export default function GlobeVisualizer({
  cityData = [],
  heatmapData = []
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const globeEl = useRef();
  const [subsolar, setSubsolar] = useState({ lat: 0, lng: 0 });
  const [autoRotate, setAutoRotate] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedClass, setSelectedClass] = useState('All');
  const [showRiskPanel, setShowRiskPanel] = useState(false);

  // Fetch flares
  const { flares: fetchedFlares, loading, error } = useFlareData({
    startDate: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
    endDate: endDate ? format(endDate, "yyyy-MM-dd") : undefined
  });

  // Hemisphere mesh
  const hemiMeshRef = useRef();
  useEffect(() => {
    if (!hemiMeshRef.current) {
      const geom = new THREE.SphereGeometry(1.01, 75, 75, 0, Math.PI);
      const mat = new THREE.MeshBasicMaterial({
        color: 'rgba(0,0,128,0.75)',
        side: THREE.DoubleSide,
        transparent: true
      });
      hemiMeshRef.current = new THREE.Mesh(geom, mat);
    }
  }, []);

  // Auto-rotate
  useEffect(() => {
    if (globeEl.current) {
      const controls = globeEl.current.controls();
      controls.autoRotate = autoRotate;
      controls.autoRotateSpeed = 0.8;
    }
  }, [autoRotate]);

  // Subsolar shading
  useEffect(() => {
    const now = new Date();
    const pt = computeSubsolarPoint(now);
    setSubsolar(pt);
  }, [fetchedFlares, selectedDate]);

  const normalize = d => d && new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const isSameDay = (a, b) => a && b && a.getTime() === b.getTime();
  const inRange = date => {
    const d = normalize(new Date(date));
    if (selectedDate) return isSameDay(d, normalize(selectedDate));
    if (startDate && endDate) {
      const s = normalize(startDate), e = normalize(endDate);
      return d >= s && d <= e;
    }
    return true;
  };

  const filtered = fetchedFlares.filter(f => {
    if (!inRange(f.peakTime)) return false;
    if (selectedClass !== 'All' && !f.classType.startsWith(selectedClass)) return false;
    return f.lat != null;
  });

  const pointsData = filtered.map(f => {
    const cls = f.classType[0];
    let color = 'green', altitude = 0.05, radius = 0.2;
    if (cls === 'X') { color = 'red'; altitude = 0.3; radius = 0.5; }
    else if (cls === 'M') { color = 'yellow'; altitude = 0.2; radius = 0.4; }
    else if (cls === 'C') { color = 'green'; altitude = 0.1; radius = 0.3; }

    return {
      lat: f.lat,
      lng: f.lng,
      color,
      altitude,
      radius,
      flare: f
    };
  });

  return (
    <div className="globe-container">
      <div className="controls-container">

        <div className="control-group">
          <label>📅 Exact Date</label>
          <DatePicker
            selected={selectedDate}
            onChange={d => {
              setSelectedDate(d);
              setStartDate(null);
              setEndDate(null);
            }}
            dateFormat="yyyy-MM-dd"
            isClearable
            placeholderText="Select date"
          />
        </div>

        <div className="control-group">
          <label>⏱ Date Range</label>
          <div className="date-picker-group">
            <DatePicker
              selected={startDate}
              onChange={setStartDate}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="yyyy-MM-dd"
              placeholderText="Start"
            />
            <DatePicker
              selected={endDate}
              onChange={setEndDate}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              dateFormat="yyyy-MM-dd"
              placeholderText="End"
            />
          </div>
        </div>

        <div className="control-group">
          <label>☀️ Flare Class</label>
          <select
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
          >
            <option>All</option>
            <option>X</option>
            <option>M</option>
            <option>C</option>
          </select>
        </div>

        <div className="control-group">
          <label>⚠️ Risk Dashboard</label>
          <button
            onClick={() => setShowRiskPanel(prev => !prev)}
            className="control-button"
            style={{
              width: '100%',
              backgroundColor: '#c0392b',
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            {showRiskPanel ? 'Hide Risk Panel' : 'Show Risk Panel'}
          </button>
        </div>

        {showRiskPanel && (
          <div className="risk-dashboard-embedded">
            <RiskDashboard flares={fetchedFlares} />
          </div>
        )}
      </div>

      <div className="top-buttons">
        <button
          onClick={() => setAutoRotate(prev => !prev)}
          className="control-button"
        >
          {autoRotate ? '⏸ Pause Rotation' : '▶ Resume Rotation'}
        </button>
      </div>

      <div className="info-panel-flares">
        <div className="info-header-flares">
          <h3>Solar Flares at a Glance</h3>
        </div>

        <div className="info-section">
          <div className="info-title">What They Are</div>
          <div className="info-content">
            Intense bursts of X‑ray and extreme ultraviolet radiation from the Sun’s magnetic active regions.
          </div>
        </div>

        <div className="info-section">
          <div className="info-title">Classification</div>
          <div className="info-content">
            C‑class (minor), M‑class (medium), X‑class (major); each step is 10× more powerful.
          </div>
        </div>

        <div className="info-section">
          <div className="info-title">Frequency</div>
          <div className="info-content">
            During Solar Cycle peaks, you’ll see ~200 M‑class and ~10 X‑class flares per year.
          </div>
        </div>

        <div className="info-section">
          <div className="info-title">Communications Impact</div>
          <div className="info-content">
            M‑class flares cause brief, localized HF‑band “fades”; X‑class flares trigger widespread blackout across the entire sunlit hemisphere.
          </div>
        </div>

        <div className="info-section">
          <div className="info-title">Energy Scale</div>
          <div className="info-content">
            An X1.0 flare releases ~10²⁵ joules—equivalent to billions of Hiroshima bombs.
          </div>
        </div>
      </div>

      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        backgroundColor="#000000"
        showAtmosphere
        atmosphereColor="blue"
        atmosphereAltitude={0.25}

        pointsData={pointsData}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointAltitude="altitude"
        pointRadius="radius"
        onPointClick={p => alert(`Flare ${p.flare.classType} at ${p.flare.peakTime}`)}

        customLayerData={[subsolar]}
        customThreeObject={() => hemiMeshRef.current}
        customThreeObjectUpdate={(obj, { lat, lng }) => {
          obj.position.setFromSphericalCoords(
            1,
            (90 - lat) * (Math.PI / 180),
            (lng + 180) * (Math.PI / 180)
          );
          obj.lookAt(obj.position.clone().multiplyScalar(2));
        }}
      />

      {loading && <div className="loading-overlay">Loading solar flare data...</div>}
      {error && <div className="error-overlay">⚠️ Error loading flare data</div>}
    </div>
  );
}
