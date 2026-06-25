import React, { useMemo, useEffect, useState } from "react";
import { 
  Zap, 
  Car, 
  Wind, 
  Droplets, 
  AlertTriangle, 
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  Info
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import { CityMetrics, AdvisorResponse } from "../types";

interface CommandCenterProps {
  metrics: CityMetrics;
  cityStatus: "OPTIMAL" | "WARNING" | "HAZARD";
  alerts: string[];
  activeNighttime: boolean;
  activeGridFailure: boolean;
  aiAdvisor: AdvisorResponse | null;
  loadingAi: boolean;
  onRefreshAi: () => void;
}

export default function CommandCenter({
  metrics,
  cityStatus,
  alerts,
  activeNighttime,
  activeGridFailure,
  aiAdvisor,
  loadingAi,
  onRefreshAi
}: CommandCenterProps) {
  // Live dynamic clock for the control center
  const [localTime, setLocalTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLocalTime(now.toLocaleTimeString("en-US", { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute energy grid values dynamic over 24-hour line chart
  const chartData = useMemo(() => {
    const data = [];
    for (let hour = 0; hour < 24; hour++) {
      // Standard solar curve peaking around 13:00 (1PM)
      let solar = 0;
      if (!activeNighttime) {
        solar = Math.max(0, Math.sin(((hour - 6) * Math.PI) / 12) * 75);
      }
      
      let wind = 22 + Math.sin((hour * Math.PI) / 6) * 6;
      let production = solar + wind;
      
      if (activeGridFailure) {
        production = Math.max(8, production * 0.12); // Grid failure drops active energy production
      }

      // Base consumption peaks around 8 AM (morning spike) and 6 PM (evening spike)
      const morningPeak = Math.exp(-Math.pow(hour - 8, 2) / 3) * 32;
      const eveningPeak = Math.exp(-Math.pow(hour - 18, 2) / 5) * 44;
      const baseConsumption = 22 + Math.sin((hour * Math.PI) / 12) * 4;
      const consumption = baseConsumption + morningPeak + eveningPeak;

      data.push({
        time: `${hour.toString().padStart(2, "0")}:00`,
        Production: parseFloat(production.toFixed(1)),
        Consumption: parseFloat(consumption.toFixed(1)),
      });
    }
    return data;
  }, [activeNighttime, activeGridFailure]);

  // Color mapping based on operational hazard level
  const statusColors = {
    OPTIMAL: {
      bg: "bg-green-500/10 border-green-500/30",
      text: "text-green-400",
      glow: "shadow-[0_0_20px_rgba(34,197,94,0.15)] animate-pulse",
      label: "SYSTEM OPTIMAL"
    },
    WARNING: {
      bg: "bg-amber-500/10 border-amber-500/30",
      text: "text-amber-400",
      glow: "shadow-[0_0_20px_rgba(245,158,11,0.2)] animate-pulse",
      label: "SYSTEM ALERT - STABLE BYPASS ACTIVE"
    },
    HAZARD: {
      bg: "bg-red-500/10 border-red-500/30",
      text: "text-red-400",
      glow: "shadow-[0_0_20px_rgba(239,68,68,0.25)] animate-pulse",
      label: "SYSTEM HAZARD - RUNNING RESTORATIVE SEQUENCE"
    }
  };

  const currentStatusConfig = statusColors[cityStatus];

  return (
    <div className="space-y-6 animate-fade-in font-sans p-2">
      {/* Top Welcome Title & Status bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">
            Aetheris Central Intelligence
          </h2>
          <p className="text-slate-400 text-sm">
            Digital twin telemetry and autonomous routing controls
          </p>
        </div>
        
        {/* Dynamic Sync Indicators */}
        <div className="flex items-center gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 font-mono text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Clock className="h-4 w-4 text-cyan-400" />
            <span>MUNICIPAL SYNC:</span>
            <span className="text-slate-200">{localTime || "10:26:19"}</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-green-400 animate-pulse tracking-wide uppercase">● LIVE FEED</span>
        </div>
      </div>

      {/* Hero Status & AI Diagnostic report Card */}
      <div className={`p-6 rounded-2xl border ${currentStatusConfig.bg} ${currentStatusConfig.glow} transition-all duration-500`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              {cityStatus === "OPTIMAL" ? (
                <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 animate-bounce" />
              )}
              <span className={`text-[11px] font-bold font-mono tracking-widest uppercase ${currentStatusConfig.text}`}>
                {currentStatusConfig.label}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-slate-100 font-sans tracking-tight">
              AI Command Diagnostics
            </h3>
            
            {/* Displaying Current AI Diagnosis */}
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              {aiAdvisor ? aiAdvisor.diagnosis : "Neural supervisor initializing. Fetching structural and telemetry diagnosis..."}
            </p>

            {/* Recommendations List */}
            {aiAdvisor && aiAdvisor.recommendations && aiAdvisor.recommendations.length > 0 && (
              <div className="pt-3 space-y-1.5 border-t border-slate-800/50 mt-4">
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest block">AI Priority Adjustments:</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                  {aiAdvisor.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-cyan-400/90 font-sans bg-cyan-950/20 px-3 py-2 rounded-lg border border-cyan-500/10">
                      <Sparkles className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI Trigger Manual Diagnostic Request */}
          <div className="flex flex-col justify-center items-center lg:items-end shrink-0 min-w-[200px]">
            <button
              onClick={onRefreshAi}
              disabled={loadingAi}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border border-cyan-500/30 text-cyan-400 bg-cyan-950/20 hover:bg-cyan-500/10 hover:text-cyan-300 transition-all font-medium text-xs shadow-[0_0_15px_rgba(6,182,212,0.1)] active:scale-95 disabled:opacity-50 disabled:pointer-events-none`}
            >
              <RefreshCw className={`h-4 w-4 ${loadingAi ? "animate-spin" : ""}`} />
              <span>{loadingAi ? "Diagnosing Core..." : "Run AI Diagnostics"}</span>
            </button>
            <span className="text-[10px] text-slate-500 font-mono mt-2 text-center lg:text-right">
              Powered by Gemini 3.5 Flash
            </span>
          </div>
        </div>

        {/* Dynamic active alerts banner */}
        {alerts.length > 0 && (
          <div className="mt-4 bg-red-950/20 border border-red-500/20 rounded-xl p-3 flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <p className="text-xs font-bold text-red-300 font-mono uppercase tracking-wider">
                Unresolved Emergency Incidents ({alerts.length})
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {alerts.join(" | ")} — System automated healing logic holds direct backup override.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Grid Matrix of 4 Simulated Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Energy Grid */}
        <div id="stat-energy" className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/20 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Energy Grid</span>
            <div className="p-2 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors">
              <Zap className={`h-4 w-4 ${activeGridFailure ? "text-red-400 animate-ping" : "text-amber-400"}`} />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-100 tracking-tight font-mono">
              {metrics.energy}%
            </span>
            <span className="text-xs font-medium text-slate-400 ml-1.5 font-sans">
              Green Source
            </span>
          </div>
          <div className="mt-2.5 text-[11px] font-mono text-slate-500 flex justify-between">
            <span>
              {activeGridFailure ? "BACKUP BATTERIES" : activeNighttime ? "BATTERY + WIND" : "SOLAR + WIND TRACK"}
            </span>
            <span className={metrics.energy < 30 ? "text-red-400" : "text-green-400"}>
              {metrics.energy > 80 ? "EXCELLENT" : "CRITICAL"}
            </span>
          </div>
        </div>

        {/* Card 2: Traffic Flow */}
        <div id="stat-traffic" className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/20 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Traffic flow</span>
            <div className="p-2 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
              <Car className="h-4 w-4 text-cyan-400" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-100 tracking-tight font-mono">
              {metrics.traffic}%
            </span>
            <span className="text-xs font-medium text-slate-400 ml-1.5 font-sans">
              Congestion
            </span>
          </div>
          <div className="mt-2.5 text-[11px] font-mono text-slate-500 flex justify-between">
            <span>Adaptive Signals</span>
            <span className={metrics.traffic > 30 ? "text-red-400 animate-pulse" : "text-green-400"}>
              {metrics.traffic > 30 ? "HEAVY FLOW" : "OPTIMAL"}
            </span>
          </div>
        </div>

        {/* Card 3: AQI */}
        <div id="stat-aqi" className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/20 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Atmosphere (AQI)</span>
            <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
              <Wind className="h-4 w-4 text-emerald-400" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-100 tracking-tight font-mono">
              {metrics.aqi}
            </span>
            <span className="text-xs font-medium text-slate-400 ml-1.5 font-sans">
              PPM Index
            </span>
          </div>
          <div className="mt-2.5 text-[11px] font-mono text-slate-500 flex justify-between">
            <span>Active Scrubbers</span>
            <span className={metrics.aqi > 100 ? "text-amber-400" : "text-green-400"}>
              {metrics.aqi <= 50 ? "EXCELLENT" : metrics.aqi <= 100 ? "MODERATE" : "WARNING"}
            </span>
          </div>
        </div>

        {/* Card 4: Water Reserves */}
        <div id="stat-water" className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/20 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Water Capacity</span>
            <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
              <Droplets className="h-4 w-4 text-blue-400" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-100 tracking-tight font-mono">
              {metrics.water}%
            </span>
            <span className="text-xs font-medium text-slate-400 ml-1.5 font-sans">
              Aquifer Levels
            </span>
          </div>
          <div className="mt-2.5 text-[11px] font-mono text-slate-500 flex justify-between">
            <span>Hydro-Sensing Active</span>
            <span className="text-green-400">STABLE</span>
          </div>
        </div>
      </div>

      {/* Line Chart Section */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h4 className="text-md font-bold text-slate-100 tracking-tight">
              Micro-Grid Balanced Power Cycle
            </h4>
            <p className="text-xs text-slate-400">
              Live simulation of green energy harvesting against dynamic city demand (24h period)
            </p>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-wider bg-slate-950 p-2 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-cyan-400">
              <span className="inline-block w-2 h-2 rounded bg-cyan-400"></span>
              <span>Production (kW)</span>
            </div>
            <div className="flex items-center gap-1.5 text-orange-400">
              <span className="inline-block w-2 h-2 rounded bg-orange-400"></span>
              <span>Consumption (kW)</span>
            </div>
          </div>
        </div>

        {/* Responsive Recharts container */}
        <div className="h-80 w-full bg-slate-950/40 rounded-xl p-2 border border-slate-900">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 15, right: 10, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis 
                dataKey="time" 
                stroke="#64748b" 
                fontSize={10} 
                tickLine={false} 
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={10} 
                tickLine={false} 
                domain={[0, 120]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#020617", 
                  borderColor: "#1e293b",
                  borderRadius: "12px",
                  fontSize: "11px",
                  color: "#e2e8f0"
                }}
              />
              <Line 
                type="monotone" 
                dataKey="Production" 
                stroke="#06b6d4" 
                strokeWidth={2.5} 
                dot={false}
                activeDot={{ r: 6 }}
                name="Green Generation"
              />
              <Line 
                type="monotone" 
                dataKey="Consumption" 
                stroke="#ea580c" 
                strokeWidth={2} 
                dot={false}
                name="City Demand"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Informative footer for hardware correlation */}
        <div className="flex items-start gap-2.5 mt-3.5 bg-slate-950/40 px-3.5 py-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed font-sans">
          <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-slate-300">Digital Twin Telemetry Core:</strong> These feeds can connect to physical microcontrollers via JSON over MQTT or WebSockets. High-speed INA219 sensor logs feed the green power output, while LDR state and PIR motion events dictate the simulated base power loads in real-time.
          </p>
        </div>
      </div>
    </div>
  );
}
