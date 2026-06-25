import React, { useMemo } from "react";
import { 
  Home, 
  Building2, 
  Factory, 
  Sun, 
  HeartPulse, 
  Sprout, 
  Cpu, 
  Terminal, 
  Play, 
  Layers, 
  Activity,
  CircuitBoard,
  Sparkles
} from "lucide-react";
import { CityZone, SmartSystem } from "../types";

// Icon lookup helper for city zones
const ZoneIcon = ({ name, className }: { name: string; className?: string }) => {
  switch (name) {
    case "Home": return <Home className={className} />;
    case "Building2": return <Building2 className={className} />;
    case "Factory": return <Factory className={className} />;
    case "Sun": return <Sun className={className} />;
    case "HeartPulse": return <HeartPulse className={className} />;
    case "Sprout": return <Sprout className={className} />;
    default: return <Cpu className={className} />;
  }
};

interface CityMapProps {
  zones: CityZone[];
  systems: SmartSystem[];
  selectedZoneId: string;
  setSelectedZoneId: (id: string) => void;
  selectedSystemId: string;
  setSelectedSystemId: (id: string) => void;
  onTriggerAction: (triggerType: string) => void;
  activeNighttime: boolean;
}

export default function CityMap({
  zones,
  systems,
  selectedZoneId,
  setSelectedZoneId,
  selectedSystemId,
  setSelectedSystemId,
  onTriggerAction,
  activeNighttime
}: CityMapProps) {

  // Retrieve current active zone
  const currentZone = useMemo(() => {
    return zones.find(z => z.id === selectedZoneId) || zones[0];
  }, [zones, selectedZoneId]);

  // Retrieve systems belonging to the active zone
  const zoneSystems = useMemo(() => {
    return systems.filter(sys => sys.zoneId === selectedZoneId);
  }, [systems, selectedZoneId]);

  // Retrieve currently highlighted smart system
  const currentSystem = useMemo(() => {
    return systems.find(sys => sys.id === selectedSystemId) || systems[0];
  }, [systems, selectedSystemId]);

  // Handle selecting a zone on the 2D SVG layout
  const handleZoneClick = (zoneId: string) => {
    setSelectedZoneId(zoneId);
    // Auto-select the first system of that zone
    const firstSys = systems.find(s => s.zoneId === zoneId);
    if (firstSys) {
      setSelectedSystemId(firstSys.id);
    }
  };

  // Handle selecting a component from the dropdown selector
  const handleSystemDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sysId = e.target.value;
    setSelectedSystemId(sysId);
    const targetSys = systems.find(s => s.id === sysId);
    if (targetSys) {
      setSelectedZoneId(targetSys.zoneId);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-fade-in font-sans p-2">
      
      {/* LEFT COLUMN: Interactive City Map & Selection Panel (8 cols) */}
      <div className="xl:col-span-7 flex flex-col gap-5">
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-md font-bold text-slate-100 tracking-tight">
                Aetheris Smart Grid Matrix
              </h3>
              <p className="text-xs text-slate-400">
                Click any sector to query localized telemetry and control microchips
              </p>
            </div>
            <div className="px-2.5 py-1 text-[10px] font-mono rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              HUD VERSION 4.1
            </div>
          </div>

          {/* Interactive 2D Digital Twin Layout Container */}
          <div className="relative w-full aspect-[4/3] bg-slate-950/80 rounded-xl overflow-hidden border border-slate-900 flex items-center justify-center p-4">
            
            {/* Tech design overlay blueprint grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-35"></div>
            
            {/* Animated background concentric sci-fi sonar rings */}
            <div className="absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-500/5 animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-500/10"></div>
            
            {/* SVG Network Line Connectors */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="glow-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.1" />
                  <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.1" />
                </linearGradient>
              </defs>

              {/* Connected lines from central control (x:50, y:50) to all other sectors */}
              {zones.map((zone) => {
                if (zone.id === "control") return null;
                return (
                  <g key={`line-${zone.id}`}>
                    <line 
                      x1="50%" 
                      y1="50%" 
                      x2={`${zone.coordinates.x}%`} 
                      y2={`${zone.coordinates.y}%`} 
                      stroke="url(#glow-cyan)" 
                      strokeWidth="1.5"
                      strokeDasharray="6, 6"
                      className="animate-[dash_10s_linear_infinite]"
                    />
                    <circle 
                      cx={`${zone.coordinates.x}%`} 
                      cy={`${zone.coordinates.y}%`} 
                      r="3" 
                      fill="#22d3ee" 
                      className="animate-ping"
                      style={{ animationDuration: "3s" }}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Interactive Glowing Zone Nodes */}
            {zones.map((zone) => {
              const isSelected = selectedZoneId === zone.id;
              const hasAlert = zone.status !== "OPTIMAL";
              const isControl = zone.id === "control";

              // Style node depending on status
              const ringColor = hasAlert 
                ? "border-red-500/40 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)] bg-red-950/20" 
                : isSelected
                  ? "border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] bg-slate-900"
                  : "border-slate-700/80 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 bg-slate-900/60";

              return (
                <button
                  key={zone.id}
                  id={`zone-node-${zone.id}`}
                  onClick={() => handleZoneClick(zone.id)}
                  style={{ left: `${zone.coordinates.x}%`, top: `${zone.coordinates.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-3 rounded-full border-2 transition-all duration-300 group ${ringColor} z-10 cursor-pointer`}
                >
                  <ZoneIcon name={zone.icon} className="h-5 w-5" />

                  {/* Pulsing indicator ring for active alert status */}
                  {hasAlert && (
                    <span className="absolute -inset-1 rounded-full border border-red-500 animate-ping"></span>
                  )}
                  {isSelected && (
                    <span className="absolute -inset-1.5 rounded-full border border-cyan-400/45 animate-pulse"></span>
                  )}

                  {/* Zone text tooltips */}
                  <div className="absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-950/90 text-[10px] font-bold font-mono tracking-wider px-2 py-1 rounded border border-slate-800 pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 shadow-lg">
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${hasAlert ? "bg-red-500 animate-ping" : "bg-green-500"}`}></span>
                    <span>{zone.name.toUpperCase()}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Global Component Selection Dropdown */}
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 flex flex-col sm:flex-row items-center gap-4">
          <label className="text-xs font-semibold text-slate-400 font-mono uppercase whitespace-nowrap">
            Jump to smart unit:
          </label>
          <select
            id="system-selector-dropdown"
            value={selectedSystemId}
            onChange={handleSystemDropdownChange}
            className="w-full bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-slate-200 text-xs px-3 py-2 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            {systems.map((sys) => (
              <option key={sys.id} value={sys.id}>
                {sys.name} ({zones.find(z => z.id === sys.zoneId)?.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* RIGHT COLUMN: Selected Component Detail Panel (5 cols) */}
      <div className="xl:col-span-5 flex flex-col gap-4">
        
        {/* Selected Zone Overview */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-[10px] font-bold font-mono tracking-widest text-cyan-400 uppercase">
            Sector Information
          </span>
          <h4 className="text-lg font-extrabold text-slate-100 mt-1 flex items-center gap-2">
            <ZoneIcon name={currentZone.icon} className="h-5 w-5 text-cyan-400" />
            {currentZone.name}
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed mt-2">
            {currentZone.description}
          </p>

          {/* Sub-components list indicator */}
          <div className="mt-4 pt-3 border-t border-slate-800/50">
            <span className="text-[10px] font-bold font-mono tracking-wider text-slate-500 uppercase block mb-2">
              Hosted Core Systems:
            </span>
            <div className="space-y-1.5">
              {zoneSystems.map((sys) => (
                <button
                  key={sys.id}
                  onClick={() => setSelectedSystemId(sys.id)}
                  className={`w-full text-left p-2 rounded-lg text-xs font-mono flex items-center justify-between border transition-all ${
                    sys.id === selectedSystemId
                      ? "bg-cyan-950/20 border-cyan-500/30 text-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.1)]"
                      : "bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span className="truncate">{sys.name}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    sys.status === "ALERT" 
                      ? "bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse" 
                      : "bg-green-500/10 text-green-400 border border-green-500/20"
                  }`}>
                    {sys.status}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Component Microcontroller Specs & Logic */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between grow">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold font-mono tracking-widest text-cyan-400 uppercase">
                IoT Core Board & Sensors
              </span>
              <h4 className="text-md font-bold text-slate-100 mt-1">
                {currentSystem.name}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mt-2.5">
                {currentSystem.howItWorks}
              </p>
            </div>

            {/* Hardware Used Tags */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold font-mono tracking-wider text-slate-500 uppercase block">
                Hardware BOM (Bill of Materials)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentSystem.hardware.map((hw, i) => (
                  <span 
                    key={i} 
                    className="text-[10px] font-mono px-2.5 py-1 bg-slate-950 text-slate-300 rounded-lg border border-slate-800 flex items-center gap-1 hover:border-cyan-500/20 hover:text-cyan-300 transition-all"
                  >
                    <CircuitBoard className="h-3 w-3 text-cyan-500 shrink-0" />
                    {hw}
                  </span>
                ))}
              </div>
            </div>

            {/* Embedded Active Code / Logic */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold font-mono tracking-wider text-slate-500 uppercase">
                  Active Microcontroller Logic (C/C++)
                </span>
                <span className="text-[9px] font-mono text-slate-600 uppercase">Arduino IDE compatible</span>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 font-mono text-[11px] text-cyan-400/90 leading-relaxed overflow-x-auto max-h-36 shadow-inner select-all">
                <div className="text-slate-500 text-[10px] mb-1.5 select-none">// Active micro-loop sequence</div>
                {currentSystem.activeLogic}
              </div>
            </div>

            {/* Sensor Feedback */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-900 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-slate-500" />
                <span className="text-slate-400">Live Hardware Feed:</span>
              </div>
              <span className="text-cyan-400 font-bold bg-cyan-950/20 px-2 py-0.5 rounded border border-cyan-500/10">
                {currentSystem.sensorReading}
              </span>
            </div>
          </div>

          {/* Interactive Simulation Button */}
          <div className="pt-4 border-t border-slate-800/60 mt-5">
            <button
              onClick={() => onTriggerAction(currentSystem.simActionTrigger)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-sm hover:bg-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all active:scale-95 cursor-pointer"
            >
              <Play className="h-4 w-4 fill-current text-slate-950" />
              <span>{currentSystem.simActionLabel}</span>
            </button>
            <p className="text-[10px] text-slate-500 text-center font-sans mt-2">
              Note: This triggers high-speed state change on the UI twin, mimicking hardware registers.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
