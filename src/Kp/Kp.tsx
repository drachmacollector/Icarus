// src/GIC/GIC.tsx
import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
  Legend,
  ComposedChart,
  Line
} from "recharts";

export default function GICPage() {


  const rawData = [
    { time: "2026-04-02T00:00:00Z", kp: 2 },
    { time: "2026-04-02T01:00:00Z", kp: 3 },
    { time: "2026-04-02T03:00:00Z", kp: 4 },
    { time: "2026-04-02T06:00:00Z", kp: 6 },
    { time: "2026-04-02T09:00:00Z", kp: 7 },
    { time: "2026-04-02T12:00:00Z", kp: 5 },
    { time: "2026-04-02T15:00:00Z", kp: 4 },
    { time: "2026-04-02T18:00:00Z", kp: 2 },
    { time: "2026-04-02T21:00:00Z", kp: 3 }
  ];

  
  const formattedData = useMemo(() => {
    const grouped: Record<string, { values: number[], count: number, max: number, avg: number }> = {};

    rawData.forEach((item) => {
      const date = new Date(item.time);
      const hour = date.getUTCHours();

      const start = Math.floor(hour / 3) * 3;
      const end = start + 3;

      const key = `${String(start).padStart(2, "0")}-${String(end).padStart(2, "0")}`;

      if (!grouped[key]) grouped[key] = { values: [], count: 0, max: 0, avg: 0 };
      grouped[key].values.push(item.kp);
      grouped[key].count++;
    });

    return Object.entries(grouped).map(([timeSlot, data]) => {
      const avg = data.values.reduce((a, b) => a + b, 0) / data.count;
      return {
        timeSlot,
        kp: Math.max(...data.values),
        avg: parseFloat(avg.toFixed(2)),
        min: Math.min(...data.values),
        dataPoints: data.values.length
      };
    });
  }, [rawData]);

  const maxKp = Math.max(...formattedData.map(d => d.kp));

  // Enhanced color logic with more gradations
  const getBarColor = (kp: number) => {
    if (kp >= 8) return "#7f1d1d";     // very dark red (extreme)
    if (kp >= 7) return "#dc2626";     // dark red (severe)
    if (kp >= 6) return "#ef4444";     // red (critical)
    if (kp >= 5) return "#f97316";     // orange (high)
    if (kp >= 4) return "#eab308";     // yellow (moderate)
    if (kp >= 3) return "#84cc16";     // lime (active)
    return "#22c55e";                  // green (quiet)
  };

  const getRiskLevel = (kp: number) => {
    if (kp >= 8) return { level: "EXTREME", color: "text-red-600", bgColor: "bg-red-900/30", borderColor: "border-red-500" };
    if (kp >= 7) return { level: "SEVERE", color: "text-red-500", bgColor: "bg-red-900/30", borderColor: "border-red-500" };
    if (kp >= 6) return { level: "CRITICAL", color: "text-orange-500", bgColor: "bg-orange-900/30", borderColor: "border-orange-500" };
    if (kp >= 5) return { level: "HIGH", color: "text-amber-500", bgColor: "bg-amber-900/30", borderColor: "border-amber-500" };
    if (kp >= 4) return { level: "MODERATE", color: "text-yellow-500", bgColor: "bg-yellow-900/30", borderColor: "border-yellow-500" };
    if (kp >= 3) return { level: "ACTIVE", color: "text-green-500", bgColor: "bg-green-900/30", borderColor: "border-green-500" };
    return { level: "QUIET", color: "text-green-600", bgColor: "bg-green-900/20", borderColor: "border-green-600" };
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const risk = getRiskLevel(data.kp);
      return (
        <div className="bg-gray-950 border-2 border-blue-400 rounded-lg p-4 text-xs shadow-lg">
          <p className="text-blue-300 font-bold text-sm">{data.timeSlot} hrs</p>
          <div className="mt-2 space-y-1">
            <p className="text-cyan-300">📊 Peak Kp: <span className="font-bold text-lg">{data.kp}</span></p>
            <p className="text-amber-300">📈 Average: <span className="font-bold">{data.avg}</span></p>
            <p className="text-gray-400">🔍 Min-Max: {data.min}-{data.kp}</p>
            <p className="text-purple-300">📍 Data points: {data.dataPoints}</p>
            <p className={`font-semibold ${risk.color}`}>Risk: {risk.level}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1220] via-[#1a2a4a] to-[#0f1a2e] text-blue-100 p-8">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 tracking-wide bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
          Geomagnetic Risk Monitor (GIC)
        </h1>
        <p className="text-sm text-gray-400">Real-time Space Weather Impact Analysis • April 2, 2026</p>
      </div>

      {/* ALERT BANNER */}
      {maxKp >= 6 && (
        <div className="mb-6 rounded-lg p-5 border-2 bg-red-900/30 border-red-500 shadow-lg shadow-red-500/20 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚠️</span>
              <div>
                <h3 className="text-xl font-bold text-red-300">CRITICAL GEOMAGNETIC EVENT</h3>
                <p className="text-sm text-gray-300">Peak Kp Index reached: <span className="text-red-400 font-bold">{maxKp}</span></p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Risk Status</p>
              <p className="text-2xl font-bold text-red-400">{getRiskLevel(maxKp).level}</p>
            </div>
          </div>
        </div>
      )}

      {/* GRAPH */}
      <div className="bg-white/5 backdrop-blur-md border border-blue-400/30 rounded-2xl p-6 mb-8 shadow-2xl hover:shadow-blue-500/10 transition-all">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-blue-300 mb-1">Kp Index Timeline (3-Hour Windows)</h2>
          <p className="text-xs text-gray-400">Showing peak values with average and data point distribution across 24-hour forecast</p>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={formattedData} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" vertical={false} />
            <XAxis 
              dataKey="timeSlot" 
              stroke="#64748b" 
              label={{ value: "Time Window (UTC)", position: "insideBottomLeft", offset: -10 }}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
            />
            <YAxis 
              domain={[0, 9]}
              stroke="#64748b"
              label={{ value: "Kp Index", angle: -90, position: "insideLeft", fill: "#94a3b8" }}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
            <Bar dataKey="kp" name="Peak Kp Index" radius={[8, 8, 0, 0]} opacity={0.85}>
              {formattedData.map((entry, index) => (
                <Cell key={index} fill={getBarColor(entry.kp)} />
              ))}
            </Bar>
            <Line type="monotone" dataKey="avg" name="Average Kp" stroke="#06b6d4" strokeWidth={2} dot={{ fill: "#06b6d4", r: 4 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* METRICS GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

        {/* Peak Kp */}
        <div className={`rounded-xl p-5 border-2 ${getRiskLevel(maxKp).bgColor} ${getRiskLevel(maxKp).borderColor} shadow-lg backdrop-blur-sm hover:shadow-red-500/20 transition-all`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-blue-300">Peak Kp Index</h3>
            <span className="text-2xl">📊</span>
          </div>
          <p className={`text-4xl font-bold mb-1 ${getRiskLevel(maxKp).color}`}>{maxKp}</p>
          <p className="text-xs text-gray-400">{getRiskLevel(maxKp).level} Risk Level</p>
        </div>

        {/* Avg Kp */}
        <div className="rounded-xl p-5 border-2 bg-cyan-900/30 border-cyan-500 shadow-lg backdrop-blur-sm hover:shadow-cyan-500/20 transition-all">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-cyan-300">Average Kp</h3>
            <span className="text-2xl">📈</span>
          </div>
          <p className="text-4xl font-bold text-cyan-100 mb-1">
            {(formattedData.reduce((sum, d) => sum + d.avg, 0) / formattedData.length).toFixed(2)}
          </p>
          <p className="text-xs text-gray-400">24-hour mean</p>
        </div>

        {/* Time Windows */}
        <div className="rounded-xl p-5 border-2 bg-purple-900/30 border-purple-500 shadow-lg backdrop-blur-sm hover:shadow-purple-500/20 transition-all">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-purple-300">Intervals</h3>
            <span className="text-2xl">🕐</span>
          </div>
          <p className="text-4xl font-bold text-purple-100 mb-1">{formattedData.length}</p>
          <p className="text-xs text-gray-400">3-hour windows analyzed</p>
        </div>

        {/* Total Data Points */}
        <div className="rounded-xl p-5 border-2 bg-amber-900/30 border-amber-500 shadow-lg backdrop-blur-sm hover:shadow-amber-500/20 transition-all">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-amber-300">Data Points</h3>
            <span className="text-2xl">📍</span>
          </div>
          <p className="text-4xl font-bold text-amber-100 mb-1">{rawData.length}</p>
          <p className="text-xs text-gray-400">Total observations</p>
        </div>

      </div>

      {/* INFO PANEL */}
      <div className="grid md:grid-cols-3 gap-5">

        <div className="bg-white/5 border border-blue-400/30 rounded-xl p-5 backdrop-blur-sm hover:border-blue-400/60 transition-all">
          <h3 className="text-sm font-bold text-blue-300 mb-3 flex items-center gap-2">
            <span>ℹ️</span> What is Kp Index?
          </h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            Kp measures geomagnetic storm intensity on a 0–9 scale. Higher values indicate stronger auroral activity and greater space weather disturbances.
          </p>
        </div>

        <div className="bg-white/5 border border-green-400/30 rounded-xl p-5 backdrop-blur-sm hover:border-green-400/60 transition-all">
          <h3 className="text-sm font-bold text-green-300 mb-3 flex items-center gap-2">
            <span>⚡</span> Risk Levels
          </h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            0–3: Quiet | 4–5: Active | 6: Critical | 7–8: Severe | 9: Extreme. Monitor critical levels closely for infrastructure impacts.
          </p>
        </div>

        <div className="bg-white/5 border border-orange-400/30 rounded-xl p-5 backdrop-blur-sm hover:border-orange-400/60 transition-all">
          <h3 className="text-sm font-bold text-orange-300 mb-3 flex items-center gap-2">
            <span>🛰️</span> Grid Impact
          </h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            High Kp can induce dangerous currents (GIC) in power grids, disrupt GPS, affect satellite communications, and cause HF radio blackouts.
          </p>
        </div>

      </div>
    </div>
  );
}