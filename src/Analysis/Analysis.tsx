import React, { useState, useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import useFlareData from "../Solar Flare/hooks/useFlareData";
import useCmeData from "../CME/hooks/useCmeData";

function toDMS(deg, isLat) {
  if (deg === null || deg === undefined) return "Unknown";
  const absolute = Math.abs(deg);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = Math.floor((minutesNotTruncated - minutes) * 60);
  let direction = isLat ? (deg >= 0 ? "N" : "S") : (deg >= 0 ? "E" : "W");
  return `${degrees}°${minutes}'${seconds}" ${direction}`;
}

export default function analysisPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showOnlyMapped, setShowOnlyMapped] = useState(true);
  const [sortOrder, setSortOrder] = useState("default");
  const [showCMEs, setShowCMEs] = useState(false);

  const { flares, loading, error } = useFlareData({
    startDate: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
    endDate: endDate ? format(endDate, "yyyy-MM-dd") : undefined
  });

  const { cmes, loading: loadingCMEs, error: errorCMEs } = useCmeData({
    startDate: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
    endDate: endDate ? format(endDate, "yyyy-MM-dd") : undefined
  });

  const filteredFlares = useMemo(() => {
    if (!selectedDate) return flares;
    return flares.filter(f => new Date(f.peakTime).toDateString() === selectedDate.toDateString());
  }, [flares, selectedDate]);

  const flaresWithCoords = filteredFlares.filter(f => f.lat !== null && f.lng !== null);
  const flaresWithoutCoords = filteredFlares.filter(f => f.lat === null || f.lng === null);

  const uniqueDates = useMemo(() => {
    const dateSet = new Set(flares.map(f => new Date(f.peakTime).toDateString()));
    return [...dateSet].sort((a, b) => new Date(b) - new Date(a));
  }, [flares]);

  const resetDateRange = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedDate(null);
  };

  const getSeverityClass = (classType) => {
    if (!classType) return "mild";
    if (classType.startsWith("X")) return "major";
    if (classType.startsWith("M")) return "moderate";
    if (classType.startsWith("C")) return "minor";
    return "mild";
  };

  const getSeverityLabel = (classType) => {
    if (!classType) return "Mild";
    if (classType.startsWith("X")) return "Major";
    if (classType.startsWith("M")) return "Moderate";
    if (classType.startsWith("C")) return "Minor";
    return "Mild";
  };

  const getSeverityOrder = (classType) => {
    if (!classType) return 0;
    if (classType.startsWith("X")) return 4;
    if (classType.startsWith("M")) return 3;
    if (classType.startsWith("C")) return 2;
    return 1;
  };

  const getCmeSeverityClass = (speed) => {
  if (speed > 1000) return "major";
  if (speed > 500) return "moderate";
  if (speed > 0) return "minor";
  return "mild";
};


  const getCmeSeverityLabel = (speed) => {
    if (speed > 1000) return "Major";
    if (speed > 500) return "Moderate";
    return "Minor";
  };

  const flaresToDisplay = useMemo(() => {
    let result = showOnlyMapped ? flaresWithCoords : filteredFlares;
    if (sortOrder === "severity-desc") {
      return [...result].sort((a, b) => getSeverityOrder(b.classType) - getSeverityOrder(a.classType));
    } else if (sortOrder === "severity-asc") {
      return [...result].sort((a, b) => getSeverityOrder(a.classType) - getSeverityOrder(b.classType));
    }
    return result;
  }, [showOnlyMapped, filteredFlares, flaresWithCoords, sortOrder]);

  const cmesToDisplay = useMemo(() => cmes || [], [cmes]);
  const mapData = showCMEs ? cmesToDisplay : flaresToDisplay;

  return (
    <div className="analysis-container">
      <div className="title-date-controls">
        <div className="header-section">
          <div className="title-container">
            <h2 className="analysis-title">Solar Activity Command Center</h2>
          </div>
        </div>
        <div className="notification-area">
          {(loading || loadingCMEs) && <div className="loading-notification">Loading data...</div>}
          {error && <div className="error-notification">{error}</div>}
          {errorCMEs && <div className="error-notification">{errorCMEs}</div>}
        </div>
        <div className="controls-right">
          <div className="date-picker-group">
            <div className="date-label">Start Date</div>
            <DatePicker
              selected={startDate}
              onChange={setStartDate}
              dateFormat="yyyy-MM-dd"
              maxDate={new Date()}
              minDate={new Date("2010-01-01")}
              placeholderText="Start Date"
              className="datepicker"
            />
          </div>
          <div className="date-picker-group">
            <label className="date-label">End Date</label>
            <DatePicker
              selected={endDate}
              onChange={setEndDate}
              dateFormat="yyyy-MM-dd"
              maxDate={new Date()}
              minDate={startDate || new Date("2010-01-01")}
              placeholderText="End Date"
              className="datepicker"
            />
          </div>
          <button className="reset-btn" onClick={resetDateRange}>
            Reset Range (Last 30 days)
          </button>
        </div>
      </div>

      <div className="map-layout">
        <div className="map-wrapper">
          <div className="map-header">
            <h3>Solar Activity Map</h3>
            <div className="map-legend">
              <div className="legend-item"><div className="legend-color major"></div><span>X-Class (Major)</span></div>
              <div className="legend-item"><div className="legend-color moderate"></div><span>M-Class (Moderate)</span></div>
              <div className="legend-item"><div className="legend-color minor"></div><span>C-Class (Minor)</span></div>
              <div className="legend-item"><div className="legend-color mild"></div><span>B-Class (Mild)</span></div>
            </div>
          </div>

          <MapContainer center={[0, 0]} zoom={2} scrollWheelZoom={false} className="flare-map">
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />
            {mapData.map((event, idx) => {
              if (event.lat !== null && event.lng !== null) {
                if (showCMEs) {
                  const severityClass = getCmeSeverityClass(event.analysis?.speed || 0);
                  const color = severityClass === "major" ? "red" : severityClass === "moderate" ? "orange" : "green";
                  return (
                    <CircleMarker
                      key={idx}
                      center={[event.lat, event.lng]}
                      radius={6}
                      color={color}
                      fillColor={color}
                      fillOpacity={0.5}
                    >
                      <Popup className="flare-popup">
                        <strong>ID:</strong> {event.activityID} <br />
                        <strong>Speed:</strong> {Math.round(event.analysis?.speed || 0)} km/s <br />
                        <strong>Start:</strong> {new Date(event.startTime).toUTCString()} <br />
                      </Popup>
                    </CircleMarker>
                  );
                } else {
                  const severityClass = getSeverityClass(event.classType);
                  const color = severityClass === "major" ? "red" : severityClass === "moderate" ? "orange" : severityClass === "minor" ? "green" : "gray";
                  return (
                    <CircleMarker
                      key={idx}
                      center={[event.lat, event.lng]}
                      radius={severityClass === "major" ? 8 : severityClass === "moderate" ? 6 : severityClass === "minor" ? 5 : 4}
                      color={color}
                      fillColor={color}
                      fillOpacity={0.5}
                    >
                      <Popup className="flare-popup">
                        <strong>Class:</strong> {event.classType || "?"} <br />
                        <strong>Peak:</strong> {new Date(event.peakTime).toUTCString()} <br />
                        <strong>Location:</strong> {toDMS(event.lat, true)}, {toDMS(event.lng, false)}
                      </Popup>
                    </CircleMarker>
                  );
                }
              }
              return null;
            })}
          </MapContainer>
        </div>

        <div className="info-panel-analysis">
          <div className="panel-header">
            <h3>Data Analysis</h3>
            <div className="panel-controls-right">
              <div className="sort-control">
                <label className="control-label">Sort by:</label>
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="sort-select">
                  <option value="default">Default</option>
                  <option value="severity-desc">Severity (High to Low)</option>
                  <option value="severity-asc">Severity (Low to High)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="panel-controls">
            <div className="date-selector">
              <label className="control-label">Select Observation Date</label>
              <DatePicker
                selected={selectedDate}
                onChange={date => setSelectedDate(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="Choose a date"
                className="datepicker"
              />
            </div>
            <div className="location-toggle">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={showOnlyMapped}
                  onChange={() => setShowOnlyMapped(!showOnlyMapped)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-text">
                Show only flares with location data ({flaresWithCoords.length})
              </span>
            </div>
            <div className="location-toggle">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={showCMEs}
                  onChange={() => setShowCMEs(!showCMEs)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-text">Show CME activity</span>
            </div>
          </div>

          <div className="panel-stats">
  <div className="stats-header">{showCMEs ? "CME Events" : "Solar Flares"}</div>

  <div className="stats-card">
    <span className="stats-value">
      {showCMEs ? cmesToDisplay.length : flaresToDisplay.length}
    </span>
    <span className="stats-label">Total</span>
  </div>

  {["major", "moderate", "minor", "mild"].map(severity => {
    const count = showCMEs
      ? cmesToDisplay.filter(cme => getCmeSeverityClass(cme.analysis?.speed || 0) === severity).length
      : flaresToDisplay.filter(flare => getSeverityClass(flare.classType) === severity).length;

    return (
      <div key={severity} className={`stats-card ${severity}`}>
        <span className="stats-value">{count}</span>
        <span className="stats-label">{severity.charAt(0).toUpperCase() + severity.slice(1)}</span>
      </div>
    );
  })}
</div>


          <div className="flare-grid">
            {showCMEs ? (
              cmesToDisplay.map((cme, idx) => {
                const speed = cme.analysis?.speed || 0;
                const severityClass = getCmeSeverityClass(speed);
                const severityLabel = getCmeSeverityLabel(speed);
                return (
                  <div key={idx} className={`flare-card ${severityClass}`}>
                    <div className="flare-card-header">
                      <h4 className="flare-class">CME Event</h4>
                      <span className={`severity ${severityClass}`}>{severityLabel}</span>
                    </div>
                    <div className="flare-details">
                      <div className="detail-group"><span className="detail-label">Start:</span><span className="detail-value">{new Date(cme.startTime).toUTCString()}</span></div>
                      <div className="detail-group"><span className="detail-label">Speed:</span><span className="detail-value">{Math.round(speed)} km/s</span></div>
                      <div className="detail-group"><span className="detail-label">Arrival:</span><span className="detail-value">{cme.analysis?.arrivalTime || "Unknown"}</span></div>
                    </div>
                    <div className="flare-instruments">
                      <a href={cme.link} target="_blank" rel="noreferrer">🔗 CME Details</a>
                    </div>
                  </div>
                );
              })
            ) : (
              flaresToDisplay.map((flare, idx) => {
                const severityClass = getSeverityClass(flare.classType);
                const severityLabel = getSeverityLabel(flare.classType);
                return (
                  <div key={idx} className={`flare-card ${severityClass}`}>
                    <div className="flare-card-header">
                      <h4 className="flare-class">Class {flare.classType || "?"}</h4>
                      <span className={`severity ${severityClass}`}>{severityLabel}</span>
                    </div>
                    <div className="flare-details">
                      <div className="detail-group"><span className="detail-label">Peak:</span><span className="detail-value">{flare.peakTime ? new Date(flare.peakTime).toUTCString() : "Unknown"}</span></div>
                      <div className="detail-group"><span className="detail-label">Location:</span><span className="detail-value">{flare.sourceLocation || "NA"}</span></div>
                      <div className="detail-group"><span className="detail-label">Coordinates:</span><span className="detail-value">{flare.lat !== null ? toDMS(flare.lat, true) : "Unknown"}, {flare.lng !== null ? toDMS(flare.lng, false) : "Unknown"}</span></div>
                    </div>
                    <div className="flare-instruments">
                      <span className="instruments-label">Detected by:</span> {flare.instruments?.map(i => i.displayName).join(", ") || "Unknown"}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
