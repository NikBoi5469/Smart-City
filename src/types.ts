/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CityMetrics {
  energy: number;      // % green energy (solar/wind/battery)
  traffic: number;     // % congestion
  aqi: number;         // Air Quality Index (0-500 scale)
  water: number;       // % capacity
}

export interface SmartSystem {
  id: string;
  name: string;
  zoneId: string;
  hardware: string[];
  howItWorks: string;
  activeLogic: string;
  simActionLabel: string;
  simActionTrigger: string;
  status: "ACTIVE" | "IDLE" | "HEALING" | "STANDBY" | "ALERT";
  sensorReading: string;
}

export interface CityZone {
  id: string;
  name: string;
  description: string;
  status: "OPTIMAL" | "WARNING" | "HAZARD";
  components: string[]; // references SmartSystem IDs
  coordinates: { x: number; y: number }; // Relative coordinates for the 2D interactive layout
  icon: string; // Lucide icon name
}

export interface LogEntry {
  id: string;
  timestamp: string; // ISO or local time string
  systemId: string;
  systemName: string;
  zoneName: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "HEALING" | "DANGER";
  message: string;
}

export interface EmergencyTrigger {
  id: string;
  name: string;
  icon: string;
  hazardType: "EARTHQUAKE" | "FLOOD" | "GRID_FAILURE";
  description: string;
  buttonClass: string;
}

export interface AdvisorResponse {
  status: "OPTIMAL" | "WARNING" | "HAZARD";
  diagnosis: string;
  recommendations: string[];
}
