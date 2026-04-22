import React from "react";
import {
  AlertTriangle,
  Globe,
  Clock,
  Activity,
  CloudLightning,
  AirVent
} from "lucide-react";

export default function RiskDashboard({ flares, forecast }) {
  const getRiskLevel = () => {
    const hasX = flares.some(f => f.class === "X");
    const hasM = flares.some(f => f.class === "M");
    if (hasX) return { level: "HIGH", className: "risk-badge high", label: "Severe HF disruptions" };
    if (hasM) return { level: "MODERATE", className: "risk-badge moderate", label: "Possible HF radio issues" };
    return { level: "LOW", className: "risk-badge low", label: "Normal HF radio conditions" };
  };

  const { level, className, label } = getRiskLevel();
  const activeCount = flares.length;
  const updatedAt = new Date().toISOString().split("T")[1].split(".")[0]; // HH:MM:SS

  return (
    <div className="risk-container">
      <div className="risk-card">

        {/* Header */}
        <div className="risk-header">

        </div>

        {/* Risk Level */}
        <div className="section">
          <p className="subheading">Current Risk Level</p>
          <div className={className}>
            <AlertTriangle className="icon-sm" />
            <span>{level}</span>
          </div>
          <p className="risk-label">{label}</p>
        </div>

        {/* Blackouts */}
        <div className="section">
          <div className="blackout-title">
            <Globe className="icon-sm" />
            <span>Active Blackouts ({activeCount})</span>
          </div>
          <p className="blackout-info">
            {activeCount === 0 ? "No active blackouts" : `${activeCount} flare events detected`}
          </p>
        </div>

        {/* Impact Summary */}
        <div className="section">
          <div className="impact-title">
            <Activity className="icon-sm" />
            <span>Impact Summary</span>
          </div>
          <ul className="impact-list">
            <li>HF Communications: {level === "LOW" ? "Nominal" : "Degraded"}</li>
            <li>Navigation (GPS): {level === "HIGH" ? "Possible signal loss" : "Stable"}</li>
            <li>Polar Routes: {level !== "LOW" ? "Risk of signal fade" : "No disruption"}</li>
          </ul>
        </div>


        {/* Last Updated */}
        <div className="section last-updated">
          <Clock className="icon-sm" />
          <span>Last updated: {updatedAt} UTC</span>
        </div>

      </div>
    </div>
  );
}
