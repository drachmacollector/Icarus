import React from 'react';

export default function CmeTooltip({ cme, onClose }) {
  if (!cme) return null;

  return (
    <div className="cme-tooltip-fixed">
      <button
        onClick={onClose}
        className="cme-tooltip-btn-close"
      >×</button>

      <h4>{cme.activityID}</h4>

      <p><strong>Catalog:</strong> {cme.catalog}</p>
      <p><strong>Start:</strong> {new Date(cme.startTime).toUTCString()}</p>
      <p><strong>Submitted:</strong> {new Date(cme.submissionTime).toUTCString()}</p>

      <p>
        <strong>Location:</strong> {cme.sourceLocation || 'N/A'}<br/>
        <strong>Region #:</strong> {cme.activeRegionNum || 'N/A'}
      </p>

      <p>
        <strong>Instruments:</strong><br/>
        {(cme.instruments || []).map(i => i.displayName).join(', ') || 'N/A'}
      </p>

      <hr/>

      <p><strong>Analysis:</strong></p>
      {cme.analysis ? (
        <>
          <p>• Speed: {Math.round(cme.analysis.speed)} km/s</p>
          <p>• Lat/Lon: {cme.analysis.latitude.toFixed(1)}, {cme.analysis.longitude.toFixed(1)}</p>
          <p>• Arrival: {cme.analysis.arrivalTime}</p>
        </>
      ) : (
        <p>N/A</p>
      )}

      <p>
        <strong>Linked Events:</strong><br/>
        {(cme.linkedEvents || []).map(e => e.activityID).join(', ') || 'None'}
      </p>

      {cme.note && (
        <p><strong>Note:</strong><br/>{cme.note}</p>
      )}

      <a
        href={cme.link}
        target="_blank"
        rel="noopener noreferrer"
      >
        🔗 Full NASA Details
      </a>
    </div>
  );
}