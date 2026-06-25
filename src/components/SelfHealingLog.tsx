import React, { useState, useMemo } from "react";
import { 
  ShieldAlert, 
  Activity, 
  Waves, 
  ZapOff, 
  Terminal, 
  Trash2, 
  Search,
  Filter,
  CheckCircle,
  TrendingDown,
  Power
} from "lucide-react";
import { LogEntry, EmergencyTrigger } from "../types";
import { EMERGENCY_TRIGGERS } from "../data/cityData";

interface SelfHealingLogProps {
  logs: LogEntry[];
  onTriggerEmergency: (hazardType: "EARTHQUAKE" | "FLOOD" | "GRID_FAILURE") => void;
  onClearLogs: () => void;
  activeEarthquake: boolean;
  activeFlood: boolean;
  activeGridFailure: boolean;
}

export default function SelfHealingLog({
  logs,
  onTriggerEmergency,
  onClearLogs,
  activeEarthquake,
  activeFlood,
  activeGridFailure
}: SelfHealingLogProps) {
  const [filterText, setFilterText] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");

  // Filter logs by search input or level type selector
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesText = 
        log.message.toLowerCase().includes(filterText.toLowerCase()) ||
        log.systemName.toLowerCase().includes(filterText.toLowerCase()) ||
        log.zoneName.toLowerCase().includes(filterText.toLowerCase());
      
      const matchesType = selectedType === "ALL" || log.type === selectedType;
      
      return matchesText && matchesType;
    });
  }, [logs, filterText, selectedType]);

  // Map icon strings to Lucide components for triggers
  const getTriggerIcon = (iconName: string) => {
    switch (iconName) {
      case "Activity": return <Activity className="h-5 w-5" />;
      case "Waves": return <Waves className="h-5 w-5" />;
      case "ZapOff": return <ZapOff className="h-5 w-5" />;
      default: return <ShieldAlert className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans p-2">
      
      {/* Title & Introduction block */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-100">
          Autonomous Self-Healing Simulator
        </h2>
        <p className="text-slate-400 text-sm">
          Simulate critical municipal hazards to evaluate automated edge microcontroller healing and bypass logic
        </p>
      </div>

      {/* Simulator Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {EMERGENCY_TRIGGERS.map((trigger) => {
          const isActive = 
            (trigger.hazardType === "EARTHQUAKE" && activeEarthquake) ||
            (trigger.hazardType === "FLOOD" && activeFlood) ||
            (trigger.hazardType === "GRID_FAILURE" && activeGridFailure);

          return (
            <div 
              key={trigger.id} 
              id={`simulator-card-${trigger.id}`}
              className={`p-5 rounded-2xl bg-slate-900/60 border transition-all duration-500 flex flex-col justify-between ${
                isActive 
                  ? "border-red-500 bg-red-950/10 shadow-[0_0_25px_rgba(239,68,68,0.25)] animate-pulse" 
                  : "border-slate-800/85 hover:border-slate-700 hover:bg-slate-900"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl ${
                    isActive ? "bg-red-500/20 text-red-400" : "bg-slate-950 text-slate-400"
                  }`}>
                    {getTriggerIcon(trigger.icon)}
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    isActive 
                      ? "bg-red-500/20 text-red-400 border border-red-500/30" 
                      : "bg-slate-950 text-slate-500 border border-slate-800"
                  }`}>
                    {isActive ? "SIM ACTIVE" : "STANDBY"}
                  </span>
                </div>
                
                <div>
                  <h4 className="text-sm font-bold text-slate-100">{trigger.name}</h4>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {trigger.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/60">
                <button
                  onClick={() => onTriggerEmergency(trigger.hazardType)}
                  className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold font-sans transition-all active:scale-95 cursor-pointer ${
                    isActive
                      ? "bg-red-500 text-slate-950 border-red-400 hover:bg-red-400 font-extrabold shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                      : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900 hover:text-slate-100"
                  }`}
                >
                  {isActive ? "Clear Hazard Incident" : "Inject Hazard State"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Real-time Hardware Healing Status Block (0.5s automated bypass showcase) */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80">
        <h3 className="text-sm font-bold text-slate-100 mb-4 flex items-center gap-2">
          <Terminal className="h-4 w-4 text-cyan-400" />
          Active Microcontroller Closed-Loop Feedback Registers
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          
          {/* Register 1: Earthquake */}
          <div className={`p-4 rounded-xl border transition-all duration-300 ${
            activeEarthquake 
              ? "bg-red-950/20 border-red-500/40 text-red-400" 
              : "bg-slate-950 border-slate-850 text-slate-400"
          }`}>
            <span className="text-[10px] text-slate-500 block uppercase">Register 0x4F: Seismic_Monitor</span>
            <div className="flex items-center justify-between mt-2">
              <span>ACCEL LOG:</span>
              <span className="font-bold">{activeEarthquake ? "2.68g (HAZARD)" : "0.01g (STABLE)"}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span>METRO SHUTOFF:</span>
              <span className={`font-bold ${activeEarthquake ? "text-red-400" : "text-green-500"}`}>
                {activeEarthquake ? "TRIPPED (0.12s)" : "ARMED"}
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span>GAS SOLENOID:</span>
              <span className={`font-bold ${activeEarthquake ? "text-red-400" : "text-green-500"}`}>
                {activeEarthquake ? "SHUTOFF (0.08s)" : "OPEN"}
              </span>
            </div>
          </div>

          {/* Register 2: Flood */}
          <div className={`p-4 rounded-xl border transition-all duration-300 ${
            activeFlood 
              ? "bg-blue-950/20 border-blue-500/40 text-blue-400" 
              : "bg-slate-950 border-slate-850 text-slate-400"
          }`}>
            <span className="text-[10px] text-slate-500 block uppercase">Register 0x62: Flood_Level</span>
            <div className="flex items-center justify-between mt-2">
              <span>WATER HEIGHT:</span>
              <span className="font-bold">{activeFlood ? "14.2cm (SPIKE)" : "72.4cm (SAFE)"}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span>BARRIER GATE:</span>
              <span className={`font-bold ${activeFlood ? "text-blue-400 animate-pulse" : "text-green-500"}`}>
                {activeFlood ? "RAISED (0.42s)" : "COLLAPSED"}
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span>DRAIN PUMPS:</span>
              <span className={`font-bold ${activeFlood ? "text-blue-400" : "text-green-500"}`}>
                {activeFlood ? "ACTIVE (MAX)" : "STANDBY"}
              </span>
            </div>
          </div>

          {/* Register 3: Power Bypass */}
          <div className={`p-4 rounded-xl border transition-all duration-300 ${
            activeGridFailure 
              ? "bg-amber-950/20 border-amber-500/40 text-amber-400" 
              : "bg-slate-950 border-slate-850 text-slate-400"
          }`}>
            <span className="text-[10px] text-slate-500 block uppercase">Register 0x8A: Grid_Manager</span>
            <div className="flex items-center justify-between mt-2">
              <span>MAIN AC GRID:</span>
              <span className="font-bold">{activeGridFailure ? "0.0V (BLACKOUT)" : "220V (STABLE)"}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span>BATTERY RELAY:</span>
              <span className={`font-bold ${activeGridFailure ? "text-amber-400 animate-pulse" : "text-green-500"}`}>
                {activeGridFailure ? "DISCHARGING" : "CHARGED"}
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span>BYPASS SWITCH:</span>
              <span className={`font-bold ${activeGridFailure ? "text-amber-400" : "text-green-500"}`}>
                {activeGridFailure ? "ACTIVE (0.34s)" : "CLOSED"}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Real-time Smart City Healing Log console */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
        
        {/* Log Panel Header with controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
          <div>
            <h4 className="text-md font-bold text-slate-100">
              Emergency & Self-Healing Event Log
            </h4>
            <p className="text-xs text-slate-400">
              Filterable ledger tracking automated city healing operations and trigger sequences
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Search events..."
                className="pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono w-44"
              />
            </div>

            {/* Type selector */}
            <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
              <Filter className="h-3.5 w-3.5 text-slate-500" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-transparent border-none text-xs text-slate-400 font-mono focus:outline-none"
              >
                <option value="ALL">ALL LEVELS</option>
                <option value="INFO">INFO</option>
                <option value="SUCCESS">SUCCESS</option>
                <option value="HEALING">HEALING</option>
                <option value="WARNING">WARNING</option>
                <option value="DANGER">DANGER</option>
              </select>
            </div>

            {/* Clear log button */}
            <button
              onClick={onClearLogs}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-red-400 hover:bg-slate-900 hover:border-red-500/20 transition-all cursor-pointer"
              title="Clear Console Log"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Real-time event log viewport */}
        <div className="bg-slate-950 rounded-xl border border-slate-900 overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-12 gap-2 bg-slate-900/50 p-2 text-[10px] font-mono font-bold text-slate-500 border-b border-slate-900 uppercase tracking-wider">
            <div className="col-span-2">Timestamp</div>
            <div className="col-span-2">Sector</div>
            <div className="col-span-3">Core system</div>
            <div className="col-span-1 text-center">Level</div>
            <div className="col-span-4">Operation Telemetry Message</div>
          </div>

          {/* Log Lines Viewport */}
          <div className="divide-y divide-slate-900 max-h-[360px] overflow-y-auto font-mono text-xs">
            {filteredLogs.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-mono text-xs">
                -- TELEMETRY BUFFER EMPTY / NO MATCHING LOGS --
              </div>
            ) : (
              filteredLogs.map((log) => {
                // Color codes for different event levels
                const logStyles = {
                  INFO: "text-slate-400 bg-slate-950",
                  SUCCESS: "text-green-400 bg-green-950/5",
                  WARNING: "text-amber-400 bg-amber-950/5",
                  HEALING: "text-cyan-400 bg-cyan-950/5 font-semibold",
                  DANGER: "text-red-400 bg-red-950/5 font-bold animate-pulse"
                };

                const currentStyle = logStyles[log.type];

                return (
                  <div 
                    key={log.id} 
                    className={`grid grid-cols-12 gap-2 p-2.5 items-center hover:bg-slate-900/30 transition-colors ${currentStyle}`}
                  >
                    <div className="col-span-2 text-slate-500 text-[11px] truncate">
                      {log.timestamp}
                    </div>
                    <div className="col-span-2 text-slate-400 font-sans truncate">
                      {log.zoneName}
                    </div>
                    <div className="col-span-3 text-slate-300 font-sans truncate font-medium">
                      {log.systemName}
                    </div>
                    <div className="col-span-1 text-center">
                      <span className={`inline-block px-1.5 py-0.5 text-[9px] font-bold rounded border ${
                        log.type === "DANGER" 
                          ? "bg-red-500/10 border-red-500/20" 
                          : log.type === "HEALING" 
                            ? "bg-cyan-500/10 border-cyan-500/20" 
                            : log.type === "WARNING" 
                              ? "bg-amber-500/10 border-amber-500/20" 
                              : log.type === "SUCCESS" 
                                ? "bg-green-500/10 border-green-500/20" 
                                : "bg-slate-800/50 border-slate-800"
                      }`}>
                        {log.type}
                      </span>
                    </div>
                    <div className="col-span-4 text-[11px] font-mono leading-tight whitespace-pre-wrap select-all">
                      {log.message}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* MQTT WebSocket placeholder code comment block */}
        <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-900/80">
          <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block mb-1">
            WebSocket / MQTT Hardware integration code hooks
          </span>
          <pre className="text-[10px] font-mono text-slate-500 leading-relaxed overflow-x-auto">
{`/* 
 * Hardware Integration Hooks:
 * 
 * 1. MQTT Publisher (C++ ESP32):
 *    client.publish("aetheris/city/sensors/flood_barrier", "{\\"distance\\": 12.4, \\"status\\": \\"HEALING\\"}");
 * 
 * 2. React WebSocket Listener:
 *    useEffect(() => {
 *      const socket = new WebSocket("wss://api.aetheristwin.local/city-stream");
 *      socket.onmessage = (event) => {
 *        const hardwareLog = JSON.parse(event.data);
 *        setLogs((prev) => [hardwareLog, ...prev]);
 *      };
 *      return () => socket.close();
 *    }, []);
 */`}
          </pre>
        </div>

      </div>

    </div>
  );
}
