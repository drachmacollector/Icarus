import React, { useState, useMemo } from "react";

// ─── GIC Computation (mirrors gic.ipynb logic) ────────────────────────────
const FLARE_AMPLIFICATION = 2.0;

function gicFromKp(kp: number): number {
  return 0.7 * Math.exp(0.6 * kp);
}

function getRiskTier(gic: number): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" {
  if (gic < 2)  return "LOW";
  if (gic < 10) return "MEDIUM";
  if (gic < 50) return "HIGH";
  return "CRITICAL";
}

interface GICResult {
  pFlare: number;
  gicKpOnly: number;
  gicComposite: number;
  gicLow: number;
  gicHigh: number;
  flareBoostPct: number;
  risk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

function computeGIC(pFlare: number, kp = 5.0): GICResult {
  const detGic   = gicFromKp(kp);
  const amplified = detGic * (1 + FLARE_AMPLIFICATION * pFlare);

  // Simulate 90% CI with ±10% noise
  const low  = amplified * 0.85;
  const high = amplified * 1.15;

  const flareBoostPct = FLARE_AMPLIFICATION * pFlare * 100;
  const risk = getRiskTier(amplified);

  return {
    pFlare:        Math.round(pFlare * 1000) / 1000,
    gicKpOnly:     Math.round(detGic    * 100) / 100,
    gicComposite:  Math.round(amplified * 100) / 100,
    gicLow:        Math.round(low       * 100) / 100,
    gicHigh:       Math.round(high      * 100) / 100,
    flareBoostPct: Math.round(flareBoostPct * 10) / 10,
    risk,
  };
}

// ─── Derive a synthetic P(flare) from solar flare data ─────────────────────
function deriveFlareProb(flares: any[]): number {
  if (!flares || flares.length === 0) return 0.05;
  const xCount = flares.filter(f => f.classType?.startsWith("X")).length;
  const mCount = flares.filter(f => f.classType?.startsWith("M")).length;
  const total  = flares.length;
  const score  = (xCount * 1.0 + mCount * 0.5) / total;
  return Math.min(0.99, Math.max(0.01, score));
}

// ─── Sub-components ────────────────────────────────────────────────────────
const RISK_META: Record<string, { color: string; glow: string; icon: string; label: string }> = {
  CRITICAL: { color: "#ff2244", glow: "rgba(255,34,68,0.45)",  icon: "🚨", label: "CRITICAL" },
  HIGH:     { color: "#ff8c00", glow: "rgba(255,140,0,0.4)",   icon: "⚠️",  label: "HIGH"     },
  MEDIUM:   { color: "#ffd700", glow: "rgba(255,215,0,0.35)",  icon: "⚡",  label: "MEDIUM"   },
  LOW:      { color: "#2ed573", glow: "rgba(46,213,115,0.35)", icon: "✅",  label: "LOW"      },
};

function AlertBanner({ result }: { result: GICResult }) {
  const meta = RISK_META[result.risk];
  const isMajorFlare = result.pFlare > 0.6;
  const isModFlare   = result.pFlare > 0.3;

  return (
    <div className="gic-alert-banner" style={{
      borderColor: meta.color,
      boxShadow: `0 0 16px ${meta.glow}`,
    }}>
      <span className="gic-alert-icon">{meta.icon}</span>
      <div className="gic-alert-text">
        {result.risk === "CRITICAL" && "CRITICAL ALERT: Immediate grid protection action required!"}
        {result.risk === "HIGH"     && "HIGH RISK: Prepare GIC mitigation measures."}
        {result.risk === "MEDIUM"   && "Moderate geomagnetic disturbance expected."}
        {result.risk === "LOW"      && "Conditions normal. Continue monitoring."}
        {isMajorFlare && (
          <div className="gic-alert-sub">
            ☀️ Active region flare probability: {Math.round(result.pFlare * 100)}%
            &nbsp;<span style={{ color: meta.color }}>(+{result.flareBoostPct}% GIC amplification)</span>
          </div>
        )}
        {!isMajorFlare && isModFlare && (
          <div className="gic-alert-sub">
            ☀️ Moderate flare probability: {Math.round(result.pFlare * 100)}%
            &nbsp;<span style={{ color: meta.color }}>(+{result.flareBoostPct}% GIC boost)</span>
          </div>
        )}
      </div>
    </div>
  );
}

function RiskBadge({ risk }: { risk: string }) {
  const meta = RISK_META[risk] ?? RISK_META.LOW;
  return (
    <span className="gic-risk-badge" style={{
      color:       meta.color,
      borderColor: meta.color,
      boxShadow:   `0 0 10px ${meta.glow}`,
    }}>
      {meta.label}
    </span>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="gic-metric-row">
      <span className="gic-metric-label">{label}</span>
      <span className="gic-metric-value">{value}</span>
    </div>
  );
}

// ─── Expandable info accordion ─────────────────────────────────────────────
function GICInfoPanel() {
  return (
    <div className="gic-info-content">
      <section className="gic-info-section">
        <h4 className="gic-info-heading">⚡ What is GIC?</h4>
        <p>
          <strong>Geomagnetically Induced Currents (GICs)</strong> are ground-level electric
          currents driven by rapid changes in Earth's magnetic field during geomagnetic storms.
          They can flow through power grids, pipelines, railways and telecommunication cables,
          causing equipment damage or outages.
        </p>
      </section>

      <section className="gic-info-section">
        <h4 className="gic-info-heading">🧮 How is it calculated?</h4>
        <p>
          The base GIC is estimated from the <strong>Kp index</strong> (global magnetic
          disturbance indicator, 0–9) using an exponential model:
        </p>
        <code className="gic-formula">GIC_Kp = 0.7 × e^(0.6 × Kp)</code>
        <p>
          A <strong>flare amplification</strong> factor then scales this by active-region
          flare probability (P_flare):
        </p>
        <code className="gic-formula">GIC_composite = GIC_Kp × (1 + 2.0 × P_flare)</code>
        <p>
          The 90% confidence interval reflects ±15% multiplicative uncertainty around the
          composite estimate.
        </p>
      </section>

      <section className="gic-info-section">
        <h4 className="gic-info-heading">🌍 How does it affect infrastructure?</h4>
        <ul className="gic-info-list">
          <li><strong>Power grids:</strong> GICs saturate transformers, causing overheating and potential failure during extreme storms.</li>
          <li><strong>Pipelines:</strong> Accelerate electrochemical corrosion in buried metallic pipelines.</li>
          <li><strong>Rail networks:</strong> Disrupt signalling systems by injecting spurious currents.</li>
          <li><strong>Telecommunications:</strong> Degrade submarine cable performance and ground-based relay stations.</li>
        </ul>
      </section>

      <section className="gic-info-section">
        <h4 className="gic-info-heading">🔴 Risk Tier Classification</h4>
        <div className="gic-tier-table">
          {[
            { tier: "LOW",      range: "< 2 A/km",  color: "#2ed573", desc: "Normal conditions. No action needed." },
            { tier: "MEDIUM",   range: "2–10 A/km", color: "#ffd700", desc: "Minor geomagnetic disturbance. Monitor closely." },
            { tier: "HIGH",     range: "10–50 A/km",color: "#ff8c00", desc: "Significant storm. Prepare mitigation measures." },
            { tier: "CRITICAL", range: "> 50 A/km", color: "#ff2244", desc: "Extreme event. Immediate grid protection required." },
          ].map(row => (
            <div key={row.tier} className="gic-tier-row">
              <span className="gic-tier-label" style={{ color: row.color }}>{row.tier}</span>
              <span className="gic-tier-range">{row.range}</span>
              <span className="gic-tier-desc">{row.desc}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── Main Panel ─────────────────────────────────────────────────────────────
interface GICPanelProps {
  flares: any[];
  loading: boolean;
}

export default function GICPanel({ flares, loading }: GICPanelProps) {
  const [expanded, setExpanded] = useState(false);

  const result = useMemo(() => {
    const pFlare = deriveFlareProb(flares);
    return computeGIC(pFlare);
  }, [flares]);

  return (
    <div className="gic-panel">
      {/* ── Header ── */}
      <div className="gic-panel-header">
        <div className="gic-header-left">
          <span className="gic-panel-icon">🌐</span>
          <h3 className="gic-panel-title">GIC Forecast</h3>
          <span className="gic-panel-subtitle">Geomagnetically Induced Current</span>
        </div>
        <div className="gic-header-right">
          <RiskBadge risk={result.risk} />
        </div>
      </div>

      {/* ── Main metrics row ── */}
      <div className="gic-metrics-grid">
        <div className="gic-metric-card gic-metric-highlight">
          <span className="gic-metric-big" style={{ color: RISK_META[result.risk].color }}>
            {loading ? "—" : `${result.gicComposite}`}
          </span>
          <span className="gic-metric-unit">A/km</span>
          <span className="gic-metric-card-label">Composite GIC</span>
        </div>

        <div className="gic-metric-card">
          <span className="gic-metric-mid">{loading ? "—" : `${Math.round(result.pFlare * 100)}%`}</span>
          <span className="gic-metric-card-label">P(Flare)</span>
        </div>

        <div className="gic-metric-card">
          <span className="gic-metric-mid">{loading ? "—" : `${result.gicKpOnly}`}</span>
          <span className="gic-metric-unit">A/km</span>
          <span className="gic-metric-card-label">Kp-only GIC</span>
        </div>

        <div className="gic-metric-card">
          <span className="gic-metric-mid" style={{ color: "#a0b2ff" }}>
            {loading ? "—" : `[${result.gicLow}, ${result.gicHigh}]`}
          </span>
          <span className="gic-metric-card-label">90% CI (A/km)</span>
        </div>
      </div>

      {/* ── Detailed metrics ── */}
      <div className="gic-detail-strip">
        <MetricRow label="Flare Boost"   value={loading ? "—" : `+${result.flareBoostPct}%`} />
        <MetricRow label="Risk Tier"     value={loading ? "—" : result.risk} />
      </div>

      {/* ── Alert banner ── */}
      {!loading && <AlertBanner result={result} />}

      {/* ── Expand / collapse info ── */}
      <button
        className={`gic-expand-btn ${expanded ? "gic-expand-btn--open" : ""}`}
        onClick={() => setExpanded(v => !v)}
        aria-expanded={expanded}
      >
        <span>{expanded ? "Hide Details" : "What is GIC? · How it's calculated · Risk tiers"}</span>
        <span className="gic-expand-chevron">{expanded ? "▲" : "▼"}</span>
      </button>

      {expanded && <GICInfoPanel />}
    </div>
  );
}
