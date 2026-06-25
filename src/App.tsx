import React, { useState, useEffect, useCallback, useMemo } from "react";
import Sidebar from "./components/Sidebar";
import CommandCenter from "./components/CommandCenter";
import CityMap from "./components/CityMap";
import SelfHealingLog from "./components/SelfHealingLog";
import ComponentBreakdown from "./components/ComponentBreakdown";
import { INITIAL_SYSTEMS, INITIAL_ZONES } from "./data/cityData";
import { CityMetrics, SmartSystem, CityZone, LogEntry, AdvisorResponse } from "./types";

export default function App() {
  // Navigation screen selector state
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Selection states for map and component breakdown views
  const [selectedZoneId, setSelectedZoneId] = useState<string>("control");
  const [selectedSystemId, setSelectedSystemId] = useState<string>("seismic");

  // Simulation hazard flags
  const [activeEarthquake, setActiveEarthquake] = useState(false);
  const [activeFlood, setActiveFlood] = useState(false);
  const [activeGridFailure, setActiveGridFailure] = useState(false);

  // Individual component simulation override flags
  const [activeNighttime, setActiveNighttime] = useState(false);
  const [activeSmokeSpike, setActiveSmokeSpike] = useState(false);
  const [activeDrySoil, setActiveDrySoil] = useState(false);
  const [activeTrafficPeak, setActiveTrafficPeak] = useState(false);

  // Smart systems list state (for dynamic sensor readings/status changes)
  const [systems, setSystems] = useState<SmartSystem[]>(INITIAL_SYSTEMS);

  // Core metrics state
  const [metrics, setMetrics] = useState<CityMetrics>({
    energy: 94,
    traffic: 12,
    aqi: 42,
    water: 88,
  });

  // Event telemetry logging database
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "log-init",
      timestamp: new Date(Date.now() - 30000).toLocaleTimeString("en-US", { hour12: false }),
      systemId: "core",
      systemName: "Central Control Core",
      zoneName: "Central Control Center",
      type: "INFO",
      message: "Aetheris Digital Twin synchronized with real-time municipal telemetry arrays. 10/10 nodes responding."
    },
    {
      id: "log-energy",
      timestamp: new Date(Date.now() - 25000).toLocaleTimeString("en-US", { hour12: false }),
      systemId: "green_grid",
      systemName: "Dynamic Micro-Grid",
      zoneName: "Renewable Energy Park",
      type: "SUCCESS",
      message: "INA219 Current sensor reporting direct solar/wind track generation of 14.2V 3.4A. Average power levels optimal."
    },
    {
      id: "log-traffic",
      timestamp: new Date(Date.now() - 15000).toLocaleTimeString("en-US", { hour12: false }),
      systemId: "traffic_opt",
      systemName: "Congestion Optimizer",
      zoneName: "Residential Smart Homes",
      type: "INFO",
      message: "Adaptive signal calibration engaged. Vehicular queue counts minimized."
    },
    {
      id: "log-aqi",
      timestamp: new Date(Date.now() - 5000).toLocaleTimeString("en-US", { hour12: false }),
      systemId: "scrubber",
      systemName: "Air Scrubber",
      zoneName: "Industrial Green Zone",
      type: "SUCCESS",
      message: "MQ-135 sensor registering 42 PPM atmospheric particulates. Carbon scrubber exhaust fan running at low-power idle."
    }
  ]);

  // AI Advisor Diagnostic response
  const [aiAdvisor, setAiAdvisor] = useState<AdvisorResponse | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Helper function to dynamically add telemetry log lines
  const addLog = useCallback((type: LogEntry["type"], systemId: string, systemName: string, zoneName: string, message: string) => {
    const newLog: LogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
      systemId,
      systemName,
      zoneName,
      type,
      message,
    };
    setLogs((prev) => [newLog, ...prev]);
  }, []);

  // Compute Overall City Status based on active hazard states
  const cityStatus = useMemo((): "OPTIMAL" | "WARNING" | "HAZARD" => {
    if (activeEarthquake || activeFlood) return "HAZARD";
    if (activeGridFailure || activeSmokeSpike || activeDrySoil || activeTrafficPeak) return "WARNING";
    return "OPTIMAL";
  }, [activeEarthquake, activeFlood, activeGridFailure, activeSmokeSpike, activeDrySoil, activeTrafficPeak]);

  // Active alerts list for display and AI prompt
  const activeAlerts = useMemo((): string[] => {
    const alerts: string[] = [];
    if (activeEarthquake) alerts.push("SEISMIC FAULT SHOCK DETECTED");
    if (activeFlood) alerts.push("CANAL WATER RUNOFF EXCEEDED THRESHOLD");
    if (activeGridFailure) alerts.push("HV CENTRAL GRID VOLTAGE Blackout");
    if (activeSmokeSpike) alerts.push("ATMOSPHERIC NOX EMISSIONS SPIKE");
    if (activeDrySoil) alerts.push("CRITICAL SOIL MOISTURE LOSS IN GREENHOUSE");
    if (activeTrafficPeak) alerts.push("INTERSECTION TRAFFIC CONGESTION DETECTED");
    return alerts;
  }, [activeEarthquake, activeFlood, activeGridFailure, activeSmokeSpike, activeDrySoil, activeTrafficPeak]);

  // Dynamically update zones list with alerts status
  const zones: CityZone[] = useMemo(() => {
    return INITIAL_ZONES.map((zone) => {
      let status: CityZone["status"] = "OPTIMAL";
      if (zone.id === "control" && activeEarthquake) {
        status = "HAZARD";
      } else if (zone.id === "hospital" && activeFlood) {
        status = "HAZARD";
      } else if (zone.id === "renewable" && activeGridFailure) {
        status = "WARNING";
      } else if (zone.id === "industrial" && activeSmokeSpike) {
        status = "WARNING";
      } else if (zone.id === "farming" && activeDrySoil) {
        status = "WARNING";
      } else if (zone.id === "residential" && activeTrafficPeak) {
        status = "WARNING";
      }
      return { ...zone, status };
    });
  }, [activeEarthquake, activeFlood, activeGridFailure, activeSmokeSpike, activeDrySoil, activeTrafficPeak]);

  // Live trigger callback to request Gemini Advisor Diagnostics
  const handleRunAiDiagnostics = useCallback(async () => {
    setLoadingAi(true);
    const activeZoneName = zones.find(z => z.id === selectedZoneId)?.name || "Central Control Center";
    try {
      const res = await fetch("/api/gemini/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metrics,
          alerts: activeAlerts,
          activeZone: activeZoneName,
          activeNighttime
        })
      });
      if (!res.ok) {
        throw new Error("HTTP error " + res.status);
      }
      const data = await res.json();
      setAiAdvisor(data);
    } catch (error: any) {
      console.error("AI Diagnostic Error:", error);
      // Clean robust fallback to maintain functional visual states
      setAiAdvisor({
        status: cityStatus,
        diagnosis: "Neural link offline. Safe closed-loop hardware overrides holding municipality stable.",
        recommendations: [
          "Perform mechanical telemetry audit across localized microcontrollers.",
          "Check API gateway connection parameters."
        ]
      });
    } finally {
      setLoadingAi(false);
    }
  }, [metrics, activeAlerts, selectedZoneId, activeNighttime, cityStatus, zones]);

  // Request AI Diagnostics on initial load
  useEffect(() => {
    handleRunAiDiagnostics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update dynamic telemetry metrics ticking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => {
        // Dynamic power grid calculations
        let targetEnergy = 94;
        if (activeGridFailure) targetEnergy = 8;
        else if (activeNighttime) targetEnergy = 14;

        // Dynamic traffic congestion calculations
        let targetTraffic = 12;
        if (activeFlood) targetTraffic = 74;
        else if (activeTrafficPeak) targetTraffic = 58;

        // Atmospheric AQI index calculations
        let targetAqi = 42;
        if (activeSmokeSpike) targetAqi = 184;

        // Aquifer water capacity calculations
        let targetWater = 88;
        if (activeFlood) targetWater = 98;
        else if (activeDrySoil) targetWater = 32;

        return {
          energy: parseFloat((targetEnergy + (Math.random() - 0.5) * 1.5).toFixed(1)),
          traffic: Math.max(1, Math.min(100, Math.round(targetTraffic + (Math.random() - 0.5) * 4))),
          aqi: Math.max(0, Math.min(500, Math.round(targetAqi + (Math.random() - 0.5) * 3))),
          water: Math.max(0, Math.min(100, Math.round(targetWater + (Math.random() - 0.5) * 2))),
        };
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [activeGridFailure, activeNighttime, activeFlood, activeTrafficPeak, activeSmokeSpike, activeDrySoil]);

  // Dynamic system state modifier (synchronizes component hardware reading details)
  useEffect(() => {
    setSystems((prevSystems) => {
      return prevSystems.map((sys) => {
        let status = sys.status;
        let sensorReading = sys.sensorReading;

        if (sys.id === "seismic") {
          status = activeEarthquake ? "ALERT" : "ACTIVE";
          sensorReading = activeEarthquake 
            ? "X: 0.88g | Y: 1.12g | Z: 1.45g (VIBRATING!)" 
            : "X: 0.02g | Y: -0.01g | Z: 0.99g (STABLE)";
        }
        else if (sys.id === "flood_barrier") {
          status = activeFlood ? "HEALING" : "ACTIVE";
          sensorReading = activeFlood 
            ? "Ultrasonic: 12.4 cm (SURGE DETECTED)" 
            : "Ultrasonic: 72.4 cm (Safe)";
        }
        else if (sys.id === "green_grid") {
          status = activeGridFailure ? "HEALING" : "ACTIVE";
          sensorReading = activeGridFailure 
            ? "Direct: 0.0V 0.0A | Battery: DISCHARGING" 
            : activeNighttime
              ? "Direct: 0.0V 0.0A | Battery: 94%"
              : "Direct: 14.2V 3.4A | Battery: 94%";
        }
        else if (sys.id === "streetlights") {
          status = activeNighttime ? "ACTIVE" : "ACTIVE";
          sensorReading = activeNighttime 
            ? "LDR: 120 lx (Nighttime) | PIR: IDLE" 
            : "LDR: 820 lx (Daytime) | PIR: IDLE";
        }
        else if (sys.id === "scrubber") {
          status = activeSmokeSpike ? "HEALING" : "ACTIVE";
          sensorReading = activeSmokeSpike 
            ? "Emission Level: 280 PPM (SPIKE!)" 
            : "Emission Level: 42 PPM (Clean)";
        }
        else if (sys.id === "greenhouse") {
          status = activeDrySoil ? "HEALING" : "ACTIVE";
          sensorReading = activeDrySoil 
            ? "Soil Moisture: 32% (CRITICAL DRY)" 
            : "Soil Moisture: 58% (Healthy)";
        }
        else if (sys.id === "traffic_opt") {
          status = activeTrafficPeak ? "HEALING" : "ACTIVE";
          sensorReading = activeTrafficPeak 
            ? "Queue A: 12 cars | Queue B: 8 cars" 
            : "Queue A: 2 cars | Queue B: 1 car";
        }

        return { ...sys, status, sensorReading };
      });
    });
  }, [activeEarthquake, activeFlood, activeGridFailure, activeNighttime, activeSmokeSpike, activeDrySoil, activeTrafficPeak]);


  // THE CENTRAL INJECT SIMULATOR BLOCK: Sequentially logs automated closed-loop healing logic
  const handleTriggerEmergency = useCallback((hazardType: "EARTHQUAKE" | "FLOOD" | "GRID_FAILURE") => {
    if (hazardType === "EARTHQUAKE") {
      const targetState = !activeEarthquake;
      setActiveEarthquake(targetState);
      
      if (targetState) {
        addLog("DANGER", "seismic", "Seismic Monitor", "Central Control Center", "[HAZARD INJECTED] Richter 7.2 seismic vibration simulation broadcasted to structural sensors.");
        
        // Staggered microcontroller automated healing sequence (closed-loop simulation)
        setTimeout(() => {
          addLog("HEALING", "seismic", "Seismic Monitor", "Central Control Center", "[AUTOMATED HEALING] Vibration exceeded 0.5g. Triggered automatic cutoff of structural natural gas solenoid valve (Pin D5).");
        }, 600);

        setTimeout(() => {
          addLog("HEALING", "traffic_opt", "Congestion Optimizer", "Residential Smart Homes", "[AUTOMATED HEALING] Transit coordinator broadcasted immediate halt signal to simulated Metro Line 3. Brakes active.");
        }, 1200);

        setTimeout(() => {
          addLog("SUCCESS", "seismic", "Seismic Monitor", "Central Control Center", "[SYSTEM SECURED] Core structural shutdown protocols successfully complete. All structural loops isolated.");
          // Trigger AI diagnostics run to reflect hazard
          handleRunAiDiagnostics();
        }, 1800);

      } else {
        addLog("INFO", "seismic", "Seismic Monitor", "Central Control Center", "[HAZARD RESOLVED] Seismic tremor simulation cleared. Structural sensor registers normalized.");
        setTimeout(() => {
          handleRunAiDiagnostics();
        }, 500);
      }
    }
    
    else if (hazardType === "FLOOD") {
      const targetState = !activeFlood;
      setActiveFlood(targetState);

      if (targetState) {
        addLog("DANGER", "flood_barrier", "Flood Barriers", "Hospital & Emergency Center", "[HAZARD INJECTED] Rapid Storm surge flash flood simulation active. Water level sensor triggering alarms.");
        
        // Staggered microcontroller automated healing sequence
        setTimeout(() => {
          addLog("HEALING", "flood_barrier", "Flood Barriers", "Hospital & Emergency Center", "[AUTOMATED HEALING] Ultrasonic distance registered < 15cm. ESP32 triggered MG996R servo motors to raise mechanical barrier gates (Pin GPIO 25).");
        }, 500);

        setTimeout(() => {
          addLog("HEALING", "priority_routing", "Priority Corridor", "Hospital & Emergency Center", "[AUTOMATED HEALING] Emergency ER Ambulance corridor routes designated with priority RFID green corridors.");
        }, 1100);

        setTimeout(() => {
          addLog("SUCCESS", "flood_barrier", "Flood Barriers", "Hospital & Emergency Center", "[SYSTEM SECURED] Subterranean runoff bypass drainage gates opened. Water levels stabilized. Sector safeguarded.");
          handleRunAiDiagnostics();
        }, 1700);

      } else {
        addLog("INFO", "flood_barrier", "Flood Barriers", "Hospital & Emergency Center", "[HAZARD RESOLVED] Torrential stormwater warning cleared. Relowes structural mechanical barriers.");
        setTimeout(() => {
          handleRunAiDiagnostics();
        }, 500);
      }
    }
    
    else if (hazardType === "GRID_FAILURE") {
      const targetState = !activeGridFailure;
      setActiveGridFailure(targetState);

      if (targetState) {
        addLog("DANGER", "green_grid", "Dynamic Micro-Grid", "Renewable Energy Park", "[HAZARD INJECTED] Sudden central high-voltage grid failure. Power distribution lines registered 0.0V.");
        
        // Rapid automated backup microsecond transfer simulation
        setTimeout(() => {
          addLog("HEALING", "green_grid", "Dynamic Micro-Grid", "Renewable Energy Park", "[AUTOMATED BYPASS] INA219 current sensor registered threshold breach. Activating electromagnetic relay isolator (Pin D22).");
        }, 200);

        setTimeout(() => {
          addLog("SUCCESS", "green_grid", "Dynamic Micro-Grid", "Renewable Energy Park", "[SYSTEM SECURED] Seamless backup battery backup array takeover complete in 0.48 seconds. Crucial municipality grids safe.");
          handleRunAiDiagnostics();
        }, 600);

      } else {
        addLog("INFO", "green_grid", "Dynamic Micro-Grid", "Renewable Energy Park", "[HAZARD RESOLVED] Main grid high-voltage restored. Re-synchronizing solar arrays and initiating smart battery charging.");
        setTimeout(() => {
          handleRunAiDiagnostics();
        }, 500);
      }
    }
  }, [activeEarthquake, activeFlood, activeGridFailure, addLog, handleRunAiDiagnostics]);

  // Handle individual hardware trigger actions from Map and Breakdown views
  const handleTriggerComponentAction = useCallback((triggerType: string) => {
    if (triggerType === "toggle_night") {
      const nextNight = !activeNighttime;
      setActiveNighttime(nextNight);
      addLog(
        "INFO", 
        "green_grid", 
        "Dynamic Micro-Grid", 
        "Renewable Energy Park", 
        nextNight 
          ? "[SIMULATION ACTIVE] Nighttime mode initiated. Solar tracking parked. Streetlight photo-sensors triggered."
          : "[SIMULATION ACTIVE] Daylight mode restored. Solar trackers operational."
      );
    }
    
    else if (triggerType === "trigger_motion") {
      addLog("INFO", "streetlights", "Smart Streetlights", "Residential Smart Homes", "[TELEMETRY EVENT] PIR Sensor Pin D2 triggered: Pedestrian approached. Illuminating led cluster immediately to 100%.");
      
      // Temporary motion trigger simulation
      setSystems((prev) => 
        prev.map((sys) => 
          sys.id === "streetlights" 
            ? { ...sys, sensorReading: "LDR: 120 lx (Nighttime) | PIR: MOTION DETECTED (100% LED)" }
            : sys
        )
      );

      setTimeout(() => {
        setSystems((prev) => 
          prev.map((sys) => 
            sys.id === "streetlights" 
              ? { ...sys, sensorReading: activeNighttime ? "LDR: 120 lx (Nighttime) | PIR: IDLE (20% LED)" : "LDR: 820 lx (Daytime) | PIR: IDLE" }
              : sys
          )
        );
      }, 4000);
    }

    else if (triggerType === "trigger_flood_water") {
      handleTriggerEmergency("FLOOD");
    }

    else if (triggerType === "trigger_shake") {
      handleTriggerEmergency("EARTHQUAKE");
    }

    else if (triggerType === "trigger_waste") {
      addLog("WARNING", "waste_mgmt", "IoT Smart Waste", "Commercial & Business Hub", "[TELEMETRY EVENT] Trash bin #45 fill level reached 94%. Locking lid (Pin GPIO 14) and broadcasting truck pickup coordinates.");
      
      setSystems((prev) => 
        prev.map((sys) => 
          sys.id === "waste_mgmt" 
            ? { ...sys, sensorReading: "Fill Level: 94% (LID LOCKED - DISPATCHED)", status: "ALERT" }
            : sys
        )
      );

      setTimeout(() => {
        addLog("SUCCESS", "waste_mgmt", "IoT Smart Waste", "Commercial & Business Hub", "[TELEMETRY SUCCESS] Dispatch pickup completed. Re-opening bin lid servo.");
        setSystems((prev) => 
          prev.map((sys) => 
            sys.id === "waste_mgmt" 
              ? { ...sys, sensorReading: "Fill Level: 8% (EMPTY)", status: "ACTIVE" }
              : sys
          )
        );
      }, 5000);
    }

    else if (triggerType === "trigger_dry_soil") {
      const dryState = !activeDrySoil;
      setActiveDrySoil(dryState);
      addLog(
        "INFO", 
        "greenhouse", 
        "Smart Farming Automation", 
        "Smart Farming Area", 
        dryState
          ? "[SIMULATION ACTIVE] High soil drying coefficient injected. moisture dropped to 32%."
          : "[SIMULATION ACTIVE] Soil moisture reset to baseline."
      );

      if (dryState) {
        setTimeout(() => {
          addLog("HEALING", "greenhouse", "Smart Farming Automation", "Smart Farming Area", "[AUTOMATED HEALING] Moisture registered < 40%. Activating DC vertical farm micro-pump relay (Pin GPIO 23).");
        }, 800);
        setTimeout(() => {
          addLog("SUCCESS", "greenhouse", "Smart Farming Automation", "Smart Farming Area", "[SYSTEM HEALED] Water hydration cycles complete. Soil moistures returned to healthy 58% range.");
          setActiveDrySoil(false);
        }, 4000);
      }
    }

    else if (triggerType === "trigger_smoke") {
      const smokeState = !activeSmokeSpike;
      setActiveSmokeSpike(smokeState);
      addLog(
        "INFO", 
        "scrubber", 
        "Air Scrubber", 
        "Industrial Green Zone", 
        smokeState
          ? "[SIMULATION ACTIVE] Heavy industrial smoke stack particulate emission spike injected (280 PPM)."
          : "[SIMULATION ACTIVE] Particulate emission levels normalized."
      );

      if (smokeState) {
        setTimeout(() => {
          addLog("HEALING", "scrubber", "Air Scrubber", "Industrial Green Zone", "[AUTOMATED HEALING] MQ-135 sensor registered > 150 PPM. Triggering high-RPM carbon scrubber fan (Pin GPIO 18).");
        }, 800);
        setTimeout(() => {
          addLog("SUCCESS", "scrubber", "Air Scrubber", "Industrial Green Zone", "[SYSTEM SECURED] Atmosphere scrubber sequence successful. Emission levels returning to clean range.");
          setActiveSmokeSpike(false);
        }, 4500);
      }
    }

    else if (triggerType === "trigger_traffic_peak") {
      const peakState = !activeTrafficPeak;
      setActiveTrafficPeak(peakState);
      addLog(
        "INFO", 
        "traffic_opt", 
        "Congestion Optimizer", 
        "Residential Smart Homes", 
        peakState
          ? "[SIMULATION ACTIVE] Rush hour peak flow injected. Traffic grid congestion spiked to 58%."
          : "[SIMULATION ACTIVE] Rush hour peak flow resolved."
      );

      if (peakState) {
        setTimeout(() => {
          addLog("HEALING", "traffic_opt", "Congestion Optimizer", "Residential Smart Homes", "[AUTOMATED HEALING] Real-time queues exceeded capacity. Extending green light NeoPixel cycles (Pin GPIO 2) for congestion reduction.");
        }, 800);
      }
    }

    else if (triggerType === "trigger_car_exit") {
      addLog("INFO", "parking", "Smart Parking", "Commercial & Business Hub", "[TELEMETRY EVENT] Vehicle departed slot A. IR sensor Pin D7 registered empty. Gate servo reset.");
      
      setSystems((prev) => 
        prev.map((sys) => 
          sys.id === "parking" 
            ? { ...sys, sensorReading: "Available Slots: 8 / 8 (FREE)", status: "ACTIVE" }
            : sys
        )
      );

      setTimeout(() => {
        setSystems((prev) => 
          prev.map((sys) => 
            sys.id === "parking" 
              ? { ...sys, sensorReading: "Available Slots: 5 / 8", status: "ACTIVE" }
              : sys
          )
        );
      }, 5000);
    }

    else if (triggerType === "trigger_ambulance") {
      addLog("HEALING", "priority_routing", "Priority Corridor", "Hospital & Emergency Center", "[TELEMETRY EVENT] RFID tag scanned: NTAG213 ambulance transponder authorized. Locking priority green corrider.");
      
      setSystems((prev) => 
        prev.map((sys) => 
          sys.id === "priority_routing" 
            ? { ...sys, sensorReading: "Scanner: AMBULANCE_TAG_SCAN_OK", status: "HEALING" }
            : sys
        )
      );

      setTimeout(() => {
        addLog("SUCCESS", "priority_routing", "Priority Corridor", "Hospital & Emergency Center", "[TELEMETRY SUCCESS] Ambulance safely routed past high-congestion avenues. Green corridor release.");
        setSystems((prev) => 
          prev.map((sys) => 
            sys.id === "priority_routing" 
              ? { ...sys, sensorReading: "Scanner: WAITING_RFID_TAG", status: "ACTIVE" }
              : sys
          )
        );
      }, 4000);
    }

  }, [activeNighttime, activeDrySoil, activeSmokeSpike, activeTrafficPeak, addLog, handleTriggerEmergency]);

  // Handle clearing the entire log screen
  const handleClearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return (
    <div id="application-layout" className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans antialiased">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        cityStatus={cityStatus}
        activeAlertsCount={activeAlerts.length}
      />

      {/* Main Panel Content Area */}
      <main id="main-content-area" className="flex-1 h-screen overflow-y-auto bg-slate-950 flex flex-col">
        
        {/* Top Control Header bar */}
        <header className="px-8 py-5 border-b border-slate-900 bg-slate-950 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
              Digital Twin Console
            </span>
            <span className="text-slate-800">|</span>
            <span className="text-xs font-semibold text-cyan-400 font-sans tracking-wide">
              {activeTab === "dashboard" ? "CENTRAL AI COMMAND" : activeTab === "map" ? "INTERACTIVE CITY MAP" : activeTab === "simulator" ? "SELF-HEALING SIMULATOR" : "HARDWARE COMPONENT BREAKDOWN"}
            </span>
          </div>

          {/* Quick status pill */}
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
            <span className="text-slate-500">HAZARD OVERRIDES:</span>
            <span className={`font-bold ${activeAlerts.length > 0 ? "text-red-400 animate-pulse" : "text-slate-400"}`}>
              {activeAlerts.length > 0 ? `${activeAlerts.length} TRIPPED` : "NONE"}
            </span>
          </div>
        </header>

        {/* Selected screen renderer */}
        <div className="flex-1 p-8 overflow-y-auto">
          {activeTab === "dashboard" && (
            <CommandCenter 
              metrics={metrics}
              cityStatus={cityStatus}
              alerts={activeAlerts}
              activeNighttime={activeNighttime}
              activeGridFailure={activeGridFailure}
              aiAdvisor={aiAdvisor}
              loadingAi={loadingAi}
              onRefreshAi={handleRunAiDiagnostics}
            />
          )}

          {activeTab === "map" && (
            <CityMap 
              zones={zones}
              systems={systems}
              selectedZoneId={selectedZoneId}
              setSelectedZoneId={setSelectedZoneId}
              selectedSystemId={selectedSystemId}
              setSelectedSystemId={setSelectedSystemId}
              onTriggerAction={handleTriggerComponentAction}
              activeNighttime={activeNighttime}
            />
          )}

          {activeTab === "simulator" && (
            <SelfHealingLog 
              logs={logs}
              onTriggerEmergency={handleTriggerEmergency}
              onClearLogs={handleClearLogs}
              activeEarthquake={activeEarthquake}
              activeFlood={activeFlood}
              activeGridFailure={activeGridFailure}
            />
          )}

          {activeTab === "breakdown" && (
            <ComponentBreakdown 
              systems={systems}
              zones={zones}
              selectedSystemId={selectedSystemId}
              setSelectedSystemId={setSelectedSystemId}
              onTriggerAction={handleTriggerComponentAction}
            />
          )}
        </div>

      </main>

    </div>
  );
}
