import React, { useMemo } from "react";
import { 
  Cpu, 
  Layers, 
  Terminal, 
  Play, 
  Sliders, 
  CheckCircle, 
  Info,
  Hammer,
  AlertOctagon,
  Wrench
} from "lucide-react";
import { SmartSystem, CityZone } from "../types";

interface ComponentBreakdownProps {
  systems: SmartSystem[];
  zones: CityZone[];
  selectedSystemId: string;
  setSelectedSystemId: (id: string) => void;
  onTriggerAction: (triggerType: string) => void;
}

export default function ComponentBreakdown({
  systems,
  zones,
  selectedSystemId,
  setSelectedSystemId,
  onTriggerAction
}: ComponentBreakdownProps) {

  // Retrieve current active system detail
  const currentSystem = useMemo(() => {
    return systems.find((s) => s.id === selectedSystemId) || systems[0];
  }, [systems, selectedSystemId]);

  // Retrieve current active system's zone information
  const currentZone = useMemo(() => {
    return zones.find((z) => z.id === currentSystem.zoneId);
  }, [zones, currentSystem]);

  // Precise schematic pinout lookup for each system (adds highly realistic competition-winning detail!)
  const pinouts = useMemo(() => {
    const pinoutMap: Record<string, { pin: string; device: string; type: string }[]> = {
      streetlights: [
        { pin: "A0", device: "LDR Analog Light Sensor", type: "Input" },
        { pin: "D2", device: "HC-SR01 PIR Motion Sensor", type: "Input (Interrupt)" },
        { pin: "D6", device: "Streetlight High-Power LED array", type: "Output (PWM)" }
      ],
      flood_barrier: [
        { pin: "GPIO 12", device: "HC-SR04 Ultrasonic Trigger", type: "Output" },
        { pin: "GPIO 13", device: "HC-SR04 Ultrasonic Echo", type: "Input" },
        { pin: "GPIO 25", device: "MG996R Heavy Duty Servo Gate", type: "Output (PWM)" },
        { pin: "GPIO 26", device: "Siren active Piezo Buzzer", type: "Output" }
      ],
      waste_mgmt: [
        { pin: "GPIO 4", device: "HC-SR04 Ultrasonic Trigger", type: "Output" },
        { pin: "GPIO 5", device: "HC-SR04 Ultrasonic Echo", type: "Input" },
        { pin: "GPIO 14", device: "SG90 Garbage Bin Micro Servo", type: "Output (PWM)" },
        { pin: "I2C SDA", device: "0.96 inch SSD1306 OLED Display", type: "Bus" }
      ],
      green_grid: [
        { pin: "I2C SDA/SCL", device: "INA219 Current sensor", type: "Bus" },
        { pin: "D9", device: "Azimuth tracker Servo", type: "Output" },
        { pin: "D10", device: "Elevation tracker Servo", type: "Output" },
        { pin: "D22", device: "Battery backup bypass Relay", type: "Output" }
      ],
      greenhouse: [
        { pin: "GPIO 34", device: "Soil moisture Analog Sensor", type: "Input" },
        { pin: "GPIO 23", device: "12V Water Pump Relay", type: "Output" }
      ],
      seismic: [
        { pin: "I2C SDA/SCL", device: "ADXL345 Accelerometer", type: "Bus" },
        { pin: "D4", device: "Alarm buzzer", type: "Output" },
        { pin: "D5", device: "Solenoid main gas valve Relay", type: "Output" }
      ],
      parking: [
        { pin: "D7", device: "Parking Slot A IR sensor", type: "Input" },
        { pin: "D8", device: "Parking Slot B IR sensor", type: "Input" },
        { pin: "D11", device: "SG90 Gate barrier Servo", type: "Output" },
        { pin: "I2C SDA/SCL", device: "1602 Character LCD Panel", type: "Bus" }
      ],
      scrubber: [
        { pin: "GPIO 32", device: "MQ-135 Gas Sensor", type: "Input" },
        { pin: "GPIO 18", device: "DC Exhaust Fan Relay", type: "Output" },
        { pin: "GPIO 19", device: "Electrostatic Scrubber Relay", type: "Output" }
      ],
      traffic_opt: [
        { pin: "GPIO 15", device: "HC-SR04 Ultrasonic Queue A", type: "Input/Output" },
        { pin: "GPIO 2", device: "NeoPixel RGB Signal strip", type: "Output" }
      ],
      priority_routing: [
        { pin: "GPIO 21 (SDA)", device: "MFRC522 RFID SPI SDA", type: "SPI" },
        { pin: "GPIO 19 (MISO)", device: "MFRC522 RFID SPI MISO", type: "SPI" },
        { pin: "GPIO 23 (MOSI)", device: "MFRC522 RFID SPI MOSI", type: "SPI" },
        { pin: "GPIO 18 (SCK)", device: "MFRC522 RFID SPI SCK", type: "SPI" }
      ]
    };
    return pinoutMap[currentSystem.id] || [];
  }, [currentSystem.id]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in font-sans p-2">
      
      {/* LEFT COLUMN: System List (5 cols) */}
      <div className="lg:col-span-5 space-y-4">
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
            Core 10 Smart Units
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Deep dive into hardware mapping, microchip pin configurations, and active C++ scripts
          </p>
        </div>

        {/* Master list scroll array */}
        <div className="space-y-2 max-h-[660px] overflow-y-auto pr-1">
          {systems.map((sys) => {
            const isSelected = sys.id === selectedSystemId;
            const zoneName = zones.find(z => z.id === sys.zoneId)?.name || "";

            return (
              <button
                key={sys.id}
                id={`breakdown-item-${sys.id}`}
                onClick={() => setSelectedSystemId(sys.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all duration-300 flex items-center justify-between group relative overflow-hidden ${
                  isSelected 
                    ? "bg-slate-900 border-cyan-500/30 text-cyan-400" 
                    : "bg-slate-900/40 border-slate-850/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                {isSelected && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"></span>
                )}

                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg transition-colors ${
                    isSelected ? "bg-cyan-500/10" : "bg-slate-950 group-hover:bg-cyan-500/5"
                  }`}>
                    <Cpu className={`h-4.5 w-4.5 ${isSelected ? "text-cyan-400" : "text-slate-500 group-hover:text-cyan-400"}`} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold block tracking-wide truncate max-w-[190px] md:max-w-[260px]">{sys.name}</span>
                    <span className="text-[10px] text-slate-500 block font-mono mt-0.5 uppercase tracking-wider">
                      {zoneName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    sys.status === "ALERT" 
                      ? "bg-red-500/15 text-red-400 border border-red-500/20" 
                      : sys.status === "HEALING"
                        ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20"
                        : "bg-green-500/15 text-green-400 border border-green-500/20"
                  }`}>
                    {sys.status}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: Hardware Schematic Details (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        
        {/* Schematic Card */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/60">
            <div>
              <span className="text-[10px] font-bold font-mono tracking-widest text-cyan-400 uppercase">
                Schematic and Pin Layout
              </span>
              <h4 className="text-md font-bold text-slate-100 mt-0.5">{currentSystem.name}</h4>
            </div>
            
            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-850">
              <Layers className="h-4 w-4 text-slate-500" />
              <span className="font-mono">Zone: {currentZone?.name}</span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs text-slate-400 leading-relaxed">
              {currentSystem.howItWorks}
            </p>

            {/* Simulated Schematic Board Representation */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 font-mono text-xs text-slate-300">
              <span className="text-[10px] text-slate-500 font-bold block mb-3 uppercase tracking-wider">
                Microcontroller Hardware Pinout (GPIO Map)
              </span>

              <div className="space-y-2">
                {pinouts.map((pin, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/40 border border-slate-850 hover:border-cyan-500/20 transition-all">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[9px] font-bold bg-cyan-950/40 text-cyan-400 rounded border border-cyan-500/25 min-w-[50px] text-center">
                        {pin.pin}
                      </span>
                      <span className="font-sans text-slate-300 text-xs">{pin.device}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest">{pin.type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Embedded C++ Firmware Template Block */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold font-mono tracking-wider text-slate-500 uppercase">
                  Production C++ Firmware Snippet (Arduino/ESP32)
                </span>
                <span className="text-[9px] font-mono text-slate-600 uppercase">Hardware Native Loop</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto max-h-52 shadow-inner">
                <span className="text-slate-500">// Native firmware configuration template</span>
                <div className="text-cyan-400 font-semibold mt-1">
                  {`#include <Arduino.h>
#include <Wire.h>

// Microcontroller pins configuration
${pinouts.map(p => `#define PIN_${p.pin.replace(/\s+/g, '_').replace(/GPIO_/g, '').toUpperCase()} ${p.pin.includes('I2C') ? '0 // Bus address' : p.pin.replace(/GPIO\s+/g, '').replace(/[AD]/g, '')}`).join('\n')}

void setup() {
  Serial.begin(115200);
  ${pinouts.map(p => p.type === 'Input' ? `pinMode(PIN_${p.pin.replace(/\s+/g, '_').replace(/GPIO_/g, '').toUpperCase()}, INPUT);` : p.type === 'Output' ? `pinMode(PIN_${p.pin.replace(/\s+/g, '_').replace(/GPIO_/g, '').toUpperCase()}, OUTPUT);` : `// Initialize ${p.device}`).join('\n  ')}
  Serial.println("System telemetry initialized.");
}

void loop() {
  // Core logic sequence
  ${currentSystem.activeLogic.split(';').map(line => line.trim()).filter(Boolean).join(';\n  ')};
  delay(100); // 10Hz poll rate
}`}
                </div>
              </div>
            </div>

            {/* Interactive hardware test suite */}
            <div className="p-4 bg-cyan-950/10 border border-cyan-500/10 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-start gap-2.5">
                <Sliders className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <h5 className="text-xs font-bold text-slate-200">Interactive Diagnostics Simulation</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Inject a localized test signal directly into physical Pin registry {pinouts[0]?.pin || "D2"}.
                  </p>
                </div>
              </div>

              <button
                onClick={() => onTriggerAction(currentSystem.simActionTrigger)}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all active:scale-95 whitespace-nowrap cursor-pointer"
              >
                Inject Pulse
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
