import React from 'react';

export default function AuroraTimeline({ kpForecast, onSelectHour }) {
  return (
    <div className="aurora-timeline">
      {kpForecast.map((entry, i) => {
        const height = (entry.kp / 9) * 100;
        const alert = entry.kp >= 5;
        const hour = new Date(entry.timeTag).getUTCHours();
        
        return (
          <div
            key={i}
            className={`timeline-bar ${alert ? 'alert' : ''}`}
            onClick={() => onSelectHour(entry)}
          >
            <div 
              className="bar-fill"
              style={{ height: `${height}%` }}
            />
            <div className="bar-label">{hour}h</div>
          </div>
        );
      })}
    </div>
  );
}