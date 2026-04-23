import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
} from "recharts";
import { 
  Activity, 
  Zap, 
  Satellite, 
  Radio, 
  Compass, 
  RefreshCw,
  Clock,
  ChevronRight
} from "lucide-react";

// --- Types ---
interface KpDataPoint {
  time_tag: string;
  kp: number;
  observed: "observed" | "estimated" | "predicted";
  noaa_scale: string | null;
}

const NOAA_URL = "https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json";

// --- Styling Helpers ---
const getKpColor = (kp: number) => {
  if (kp >= 7) return "#fb7185"; // rose-400
  if (kp >= 5) return "#fb923c"; // orange-400
  if (kp >= 4) return "#facc15"; // yellow-400
  return "#34d399";            // emerald-400
};

const getRiskLevel = (kp: number) => {
  if (kp >= 7) return { label: "SEVERE", color: "text-rose-400", glow: "from-rose-500/10" };
  if (kp >= 5) return { label: "MODERATE", color: "text-orange-400", glow: "from-orange-400/10" };
  if (kp >= 4) return { label: "ACTIVE", color: "text-yellow-400", glow: "from-yellow-400/5" };
  return { label: "QUIET", color: "text-emerald-400", glow: "from-emerald-400/5" };
};

// --- Components ---

const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative overflow-hidden rounded-[2.5rem] bg-white/[0.02] backdrop-blur-[40px] shadow-2xl shadow-black/50 ${className}`}>
    <div className="relative z-10">{children}</div>
  </div>
);

const KpGauge = ({ value }: { value: number }) => {
  const color = getKpColor(value);
  const strokeWidth = 3;
  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 9) * circumference;

  return (
    <div className="relative flex items-center justify-center w-full max-w-[320px] aspect-square mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
        <circle
          cx="100"
          cy="100"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-white/[0.01]"
        />
        <circle
          cx="100"
          cy="100"
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{ filter: `drop-shadow(0 0 15px ${color}40)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-8xl font-thin tracking-tighter text-white/95 leading-none">{value.toFixed(1)}</span>
        <span className="text-[11px] font-medium tracking-[0.5em] text-white/10 uppercase mt-4">Planetary Index</span>
      </div>
    </div>
  );
};

export default function KpPage() {
  const [data, setData] = useState<KpDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(NOAA_URL);
      setData(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000 * 15);
    return () => clearInterval(interval);
  }, []);

  const latestPoint = useMemo(() => {
    if (data.length === 0) return null;
    const realPoints = data.filter(p => p.observed !== "predicted");
    return realPoints[realPoints.length - 1] || data[0];
  }, [data]);

  const risk = useMemo(() => (latestPoint ? getRiskLevel(latestPoint.kp) : null), [latestPoint]);

  if (loading && data.length === 0) {
    return (
      <div className="min-h-screen bg-[#030508] flex items-center justify-center">
        <div className="w-16 h-[1px] bg-white/10 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030508] text-white/70 font-sans selection:bg-white/5 pb-32">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b ${risk?.glow} to-transparent opacity-30 transition-all duration-1000 blur-[100px]`} />
      </div>

      <div className="relative z-10 max-w-screen-xl mx-auto px-10 pt-24 space-y-32">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-16">
          <div className="space-y-8">
            <div className="flex items-center gap-6 text-[11px] font-bold tracking-[0.6em] text-white/20 uppercase">
              <span>Space Systems Monitor</span>
              <div className="w-1 h-1 rounded-full bg-white/10" />
              <span>Kp Dynamics</span>
            </div>
            <h1 className="text-7xl md:text-[9rem] font-thin tracking-tighter text-white leading-none -ml-2">
              Kp Index
            </h1>
            <div className="flex items-center gap-6 text-[10px] font-medium text-white/30 tracking-widest uppercase">
              <Clock className="w-3 h-3 opacity-30" /> LAST SYNC: {new Date().toLocaleTimeString()} UTC
            </div>
          </div>
          <button 
            onClick={fetchData}
            className="group p-5 rounded-full bg-white/[0.01] hover:bg-white/[0.04] transition-all duration-500"
          >
            <RefreshCw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-700 opacity-20" />
          </button>
        </div>

        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-16">
            <KpGauge value={latestPoint?.kp || 0} />
            <div className="text-center space-y-4">
              <p className={`text-5xl font-extralight tracking-tight ${risk?.color}`}>{risk?.label}</p>
              <p className="text-[11px] font-bold text-white/10 uppercase tracking-[0.4em]">Current Status</p>
            </div>
          </div>

          <div className="space-y-16">
            <div className="space-y-6">
              <h3 className="text-3xl font-light text-white tracking-tight leading-snug">Global geomagnetic activity is currently <span className={risk?.color}>{risk?.label.toLowerCase()}</span>.</h3>
              <p className="text-base text-white/30 leading-relaxed font-light">
                The Kp-index measures global geomagnetic activity levels from 0 to 9. We monitor these fluctuations to assess risk to satellite infrastructure and power transmission.
              </p>
            </div>
            
            <div className="flex gap-16 pt-12">
              <div className="space-y-2">
                <p className="text-4xl font-extralight text-white">{Math.max(...data.map(d => d.kp)).toFixed(1)}</p>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">72H PEAK</p>
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-extralight text-white">{data.filter(p => p.kp >= 5).length}</p>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">STORM EVENTS</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 px-4">
            <div className="space-y-3">
              <h3 className="text-2xl font-light text-white tracking-tight">Timeline Trend</h3>
              <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Active Forecast Distribution</p>
            </div>
            <div className="flex gap-12">
              <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/20">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" /> Observed
              </div>
              <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/20">
                <div className="w-1.5 h-1.5 rounded-full border border-white/20" /> Predicted
              </div>
            </div>
          </div>

          <GlassCard className="p-16">
            <div className="h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <Tooltip 
                    cursor={{ stroke: 'rgba(255,255,255,0.02)', strokeWidth: 1 }}
                    contentStyle={{ 
                      backgroundColor: 'rgba(3, 5, 8, 0.98)', 
                      border: 'none', 
                      borderRadius: '32px',
                      backdropFilter: 'blur(30px)',
                      boxShadow: '0 32px 64px rgba(0,0,0,0.9)',
                      padding: '24px'
                    }}
                    itemStyle={{ fontSize: '13px', fontWeight: '300', color: 'rgba(255,255,255,0.8)' }}
                    labelStyle={{ display: 'none' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="kp" 
                    stroke="none" 
                    fill="white" 
                    fillOpacity={0.01} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="kp" 
                    stroke="rgba(255,255,255,0.1)" 
                    strokeWidth={1} 
                    dot={(props: any) => {
                      const isPredicted = props.payload.observed === "predicted";
                      const kpColor = getKpColor(props.payload.kp);
                      if (props.index % 4 !== 0) return null;
                      return (
                        <circle 
                          cx={props.cx} 
                          cy={props.cy} 
                          r={2} 
                          fill={isPredicted ? "transparent" : kpColor} 
                          stroke={kpColor} 
                          strokeWidth={1}
                          style={{ filter: `drop-shadow(0 0 10px ${kpColor}80)` }}
                        />
                      );
                    }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Impacts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 px-4 pt-10">
          {[
            { icon: Zap, label: "Power Grids", desc: "Transformer saturation risks." },
            { icon: Satellite, label: "Satellites", desc: "Surface charging disturbances." },
            { icon: Radio, label: "HF Radio", desc: "Ionospheric signal absorption." },
            { icon: Compass, label: "Navigation", desc: "L-Band signal fluctuations." },
          ].map((item, i) => (
            <div key={i} className="space-y-8 group">
              <div className="w-16 h-16 rounded-[2rem] bg-white/[0.01] flex items-center justify-center text-white/10 group-hover:text-white/40 transition-all duration-700">
                <item.icon className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div className="space-y-3">
                <h5 className="text-base font-light text-white tracking-tight">{item.label}</h5>
                <p className="text-[11px] text-white/20 leading-relaxed font-light">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Final Info */}
        <div className="pt-32 text-center space-y-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/10 max-w-lg mx-auto leading-relaxed">
            Geomagnetic storms are calculated using the planetary K-index, representing the mean of K-indices at various observatories.
          </p>
          <button className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/30 hover:text-white transition-all duration-700 flex items-center gap-3 mx-auto group">
            NOAA Technical Scales <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
}