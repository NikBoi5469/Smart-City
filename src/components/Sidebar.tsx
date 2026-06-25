import React from "react";
import { 
  LayoutDashboard, 
  Map, 
  ShieldAlert, 
  Cpu, 
  Activity, 
  Wifi, 
  Clock 
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cityStatus: "OPTIMAL" | "WARNING" | "HAZARD";
  activeAlertsCount: number;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  cityStatus, 
  activeAlertsCount 
}: SidebarProps) {
  
  const menuItems = [
    {
      id: "dashboard",
      label: "Central AI Command",
      icon: LayoutDashboard,
      description: "Live telemetry & micro-grids"
    },
    {
      id: "map",
      label: "Interactive City Map",
      icon: Map,
      description: "Visual 7-zone twin selection"
    },
    {
      id: "simulator",
      label: "Self-Healing Sim",
      icon: ShieldAlert,
      badge: activeAlertsCount > 0 ? activeAlertsCount : undefined,
      description: "Active emergency trigger bay"
    },
    {
      id: "breakdown",
      label: "System Breakdown",
      icon: Cpu,
      description: "Deep-dive into 10 IoT units"
    }
  ];

  return (
    <aside id="sidebar-container" className="w-80 h-screen bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none font-sans">
      <div>
        {/* Top Header Logo */}
        <div className="p-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/30 animate-pulse">
              <Activity className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-md font-bold tracking-wider text-slate-100 uppercase font-sans">
                Aetheris Twin
              </h1>
              <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                Sustainable Smart City
              </p>
            </div>
          </div>
        </div>

        {/* Live Network Indicators */}
        <div className="px-6 py-3 bg-slate-900/40 border-b border-slate-800/50 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <span className={`inline-block w-2 h-2 rounded-full ${cityStatus === "OPTIMAL" ? "bg-green-500 animate-pulse" : cityStatus === "WARNING" ? "bg-amber-500 animate-ping" : "bg-red-500 animate-ping"}`}></span>
            <span className="uppercase text-slate-300 tracking-wider">
              System: {cityStatus}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Wifi className="h-3 w-3 text-cyan-400" />
            <span className="text-slate-500 uppercase tracking-widest">Twin Connected</span>
          </div>
        </div>

        {/* Navigation Options */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left flex items-center justify-between p-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  isActive 
                    ? "bg-slate-900 border border-cyan-500/30 text-cyan-400" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent"
                }`}
              >
                {/* Visual active neon vertical indicator line */}
                {isActive && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"></span>
                )}

                <div className="flex items-center gap-3.5 z-10">
                  <Icon className={`h-5 w-5 transition-transform duration-300 group-hover:scale-105 ${isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-cyan-400"}`} />
                  <div>
                    <span className="font-medium text-sm block tracking-wide">{item.label}</span>
                    <span className="text-[10px] text-slate-500 block font-sans tracking-normal mt-0.5 group-hover:text-slate-400 transition-colors">
                      {item.description}
                    </span>
                  </div>
                </div>

                {item.badge !== undefined && (
                  <span className="z-10 px-2 py-0.5 text-[10px] font-bold font-mono rounded bg-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_8px_rgba(239,68,68,0.2)] animate-pulse">
                    {item.badge} ACTIVE
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status Panel */}
      <div className="p-6 border-t border-slate-800 bg-slate-950">
        <div className="rounded-xl bg-slate-900/60 p-4 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 font-sans">Core CPU Node</span>
            <span className="text-xs font-mono text-cyan-400 animate-pulse">1.22 GigaFlops</span>
          </div>
          
          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
            <div className={`h-full transition-all duration-500 ${cityStatus === "OPTIMAL" ? "bg-cyan-500 w-[14%]" : "bg-amber-500 w-[58%]"}`}></div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-1 pt-1 border-t border-slate-800/50">
            <span className="flex items-center gap-1 uppercase">
              <Clock className="h-3 w-3 text-slate-500" /> Live Synchronized
            </span>
            <span className="text-slate-400">2026.06.25 UTC</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
