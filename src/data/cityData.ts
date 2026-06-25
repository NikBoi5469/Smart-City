import { CityZone, SmartSystem, EmergencyTrigger } from "../types";

export const INITIAL_SYSTEMS: SmartSystem[] = [
  {
    id: "streetlights",
    name: "Adaptive Smart Streetlights",
    zoneId: "residential",
    hardware: ["Arduino Nano", "LDR (Light Dependent Resistor)", "HC-SR501 PIR Motion Sensor", "High-Power White LEDs"],
    howItWorks: "Monitors ambient light using the LDR sensor. Toggles lights ON during dusk/night. Integrates PIR motion sensors to automatically dim streetlights to 20% intensity when street is empty, and boost to 100% when vehicles or pedestrians approach, conserving up to 60% energy.",
    activeLogic: "IF (LDR < 300) { activeMode = NIGHT; IF (Motion == HIGH) LED_Brightness = 100%; ELSE LED_Brightness = 20%; } ELSE { activeMode = DAY; LED_Brightness = 0%; }",
    simActionLabel: "Simulate Pedestrian",
    simActionTrigger: "trigger_motion",
    status: "ACTIVE",
    sensorReading: "LDR: 820 lx (Daytime) | PIR: IDLE"
  },
  {
    id: "flood_barrier",
    name: "Automatic Self-Healing Flood Barriers",
    zoneId: "hospital",
    hardware: ["ESP32-WROOM-32D", "HC-SR04 Ultrasonic Distance Sensor", "MG996R Metal Gear Servo Motors", "Pulsing Active Piezo Buzzer"],
    howItWorks: "Continuously polls water height inside municipal canal arrays. If water level exceeds critical flood thresholds, the controller fires an emergency alarm, raises heavy mechanical rack-and-pinion flood gates via servos, and redirects street runoff channels into subterranean detention reservoirs.",
    activeLogic: "IF (Ultrasonic_Distance < 15.0cm) { raiseBarrier(); activateBuzzer(); triggerRerouteFlag(); } ELSE { lowerBarrier(); deactivateBuzzer(); }",
    simActionLabel: "Simulate Water Rise",
    simActionTrigger: "trigger_flood_water",
    status: "ACTIVE",
    sensorReading: "Ultrasonic: 72.4 cm (Safe)"
  },
  {
    id: "waste_mgmt",
    name: "IoT Smart Waste Allocator",
    zoneId: "commercial",
    hardware: ["ESP8266 NodeMCU", "HC-SR04 Ultrasonic Sensor", "SG90 Micro Servo Motor", "OLED I2C Display Module"],
    howItWorks: "Measures internal bin trash levels via an ultrasonic sensor. The servo controls a secure, automatic latching lid. When fill level reaches 90%, it locks the bin, displays a 'LID LOCKED - FULL' notice on the local OLED screen, and transmits a pickup dispatch coordinate directly to the smart routing system.",
    activeLogic: "IF (Trash_Depth < 5.0cm) { state = FULL; lockLid(); sendMqttNotification('Bin_ID_45_Full'); } ELSE { state = AVAILABLE; unlockLid(); }",
    simActionLabel: "Simulate Garbage Dumping",
    simActionTrigger: "trigger_waste",
    status: "ACTIVE",
    sensorReading: "Fill Level: 28% capacity"
  },
  {
    id: "green_grid",
    name: "Dynamic Micro-Grid Energy Harvester",
    zoneId: "renewable",
    hardware: ["Arduino Mega 2560", "INA219 High-Side I2C Current Sensor", "Dual-Axis Servo Solar Tracker", "12V Buck Booster Controller"],
    howItWorks: "Synchronizes power production between wind turbines and solar tracker panels. An INA219 sensor monitors micro-grid current. If green generation drops (nighttime/overcast), the energy manager instantly switches key networks to rechargeable lithium iron phosphate battery backup arrays.",
    activeLogic: "IF (Solar_V + Wind_V < 11.5V) { switchSource(BATTERY_BACKUP); status = 'GRID_BACKUP'; } ELSE { switchSource(SOLAR_WIND_DIRECT); status = 'GRID_DIRECT'; }",
    simActionLabel: "Toggle Night Mode",
    simActionTrigger: "toggle_night",
    status: "ACTIVE",
    sensorReading: "Direct: 14.2V 3.4A | Battery: 94%"
  },
  {
    id: "greenhouse",
    name: "Soil-Watering Automation (Smart Farming)",
    zoneId: "farming",
    hardware: ["ESP32-WROOM-32D", "Capacitive Soil Moisture Sensor v1.2", "5V Electromagnetic Relay", "12V Submersible DC Water Pump"],
    howItWorks: "Monitors the moisture content in multi-crop smart farming fields. If soil moisture level drops below the user-configured optimal hydration threshold (e.g., 40%), the ESP32 activates the submersible relay to supply exact, localized root hydration, minimizing water loss.",
    activeLogic: "IF (Moisture_Percent < 40%) { digitalWrite(RELAY_PIN, HIGH); status = 'IRRIGATING'; } ELSE { digitalWrite(RELAY_PIN, LOW); status = 'OPTIMAL'; }",
    simActionLabel: "Simulate Dry Soil",
    simActionTrigger: "trigger_dry_soil",
    status: "ACTIVE",
    sensorReading: "Soil Moisture: 58% (Healthy)"
  },
  {
    id: "seismic",
    name: "Seismic Structural Monitor & Auto-Shutdown",
    zoneId: "control",
    hardware: ["Arduino Nano 33 IoT", "ADXL345 3-Axis Accelerometer", "Active Alarm Buzzer", "Normally-Closed Solenoid Valve Relay"],
    howItWorks: "Maintains high-frequency polling on structural vibration. If acceleration exceeds safe Richter/g-force limits, it instantly triggers municipal gas solenoid valve emergency shutoff, commands the simulated electric metro line to hit automated emergency brakes, and activates warning sirens.",
    activeLogic: "IF (abs(ax) > LIMIT || abs(ay) > LIMIT) { cutoffMainGasSolenoid(); emergencyHaltMetro(); triggerVisualAlert(); }",
    simActionLabel: "Trigger Shake Test",
    simActionTrigger: "trigger_shake",
    status: "ACTIVE",
    sensorReading: "X: 0.02g | Y: -0.01g | Z: 0.99g (STABLE)"
  },
  {
    id: "parking",
    name: "Guided IoT Smart Parking System",
    zoneId: "commercial",
    hardware: ["Arduino Uno", "Infrared Obstacle Avoidance Sensors", "SG90 Servo Barrier Gate", "I2C 16x2 LCD Panel"],
    howItWorks: "IR sensors monitor each parking bay's occupancy. A dynamic entry barrier gate controlled by a servo opens only if available slots > 0. The LCD panel displays real-time available bays at the entrance, reducing cruising traffic and local emissions.",
    activeLogic: "IF (available_slots == 0) { displayLCD('FULL'); lockGate(); } ELSE { displayLCD('Slots: ' + available_slots); allowEntry(); }",
    simActionLabel: "Simulate Car Exit",
    simActionTrigger: "trigger_car_exit",
    status: "ACTIVE",
    sensorReading: "Available Slots: 5 / 8"
  },
  {
    id: "scrubber",
    name: "Eco-Industrial Smart Air Scrubber",
    zoneId: "industrial",
    hardware: ["ESP32-WROOM-32D", "MQ-135 Gas/Air Quality Sensor", "High-RPM DC Exhaust Fan", "Ozone Generator Relay"],
    howItWorks: "Monitors harmful emissions (CO2, Ammonia, Smoke) in the industrial hub. If MQ-135 analog feedback spikes above 150 PPM, the ESP32 triggers high-powered carbon-scrubber exhaust fans and triggers active electrostatic precipitator relays to filter particulates before venting.",
    activeLogic: "IF (MQ135_PPM > 150) { setFanSpeed(MAX); activatePrecipitator(); triggerAlertLevel(YELLOW); } ELSE { setFanSpeed(LOW); deactivatePrecipitator(); }",
    simActionLabel: "Simulate Exhaust Spike",
    simActionTrigger: "trigger_smoke",
    status: "ACTIVE",
    sensorReading: "Emission Level: 42 PPM (Clean)"
  },
  {
    id: "traffic_opt",
    name: "Adaptive Congestion Optimizer",
    zoneId: "residential",
    hardware: ["ESP32-CAM AI Camera", "HC-SR04 Ultrasonic Sensors", "NeoPixel RGB LED Signal Arrays", "12V Linear Actuators"],
    howItWorks: "Uses ultrasonic sensors on intersecting lanes to measure real-time vehicle queue lengths. During peak congestion, the controller dynamically extends green light cycles for lanes showing high queue lengths, reducing static exhaust build-up and idling times.",
    activeLogic: "IF (Lane_A_Queue > Lane_B_Queue * 1.5) { extendGreenLight('LANE_A', 15s); updateLEDColors(); }",
    simActionLabel: "Simulate Rush Hour",
    simActionTrigger: "trigger_traffic_peak",
    status: "ACTIVE",
    sensorReading: "Queue A: 2 cars | Queue B: 1 car"
  },
  {
    id: "priority_routing",
    name: "Emergency Priority Green Corridor",
    zoneId: "hospital",
    hardware: ["MFRC522 RFID Reader Module", "ESP8266 NodeMCU", "NTAG213 Smart Ambulance Tags", "RGB Traffic Light LEDs"],
    howItWorks: "Installs RFID readers at primary hospital lane corridors. When an approaching smart ambulance (carrying active RFID tags) is scanned, the ESP8266 communicates via MQTT to switch all traffic intersections leading to the ER bay immediately to GREEN, ensuring zero delays.",
    activeLogic: "IF (RFID_Tag_Detected == AMBULANCE_MOCK_ID) { triggerPriorityCorridor(); setAllLightsInCorridor(GREEN); alertERStaff(); }",
    simActionLabel: "Dispatch Ambulance",
    simActionTrigger: "trigger_ambulance",
    status: "ACTIVE",
    sensorReading: "Scanner: WAITING_RFID_TAG"
  }
];

export const INITIAL_ZONES: CityZone[] = [
  {
    id: "residential",
    name: "Residential Smart Homes",
    description: "Highly integrated eco-district using smart streetlights, solar roof shingles, and dynamic traffic signal optimization to coordinate eco-living.",
    status: "OPTIMAL",
    components: ["streetlights", "traffic_opt"],
    coordinates: { x: 18, y: 35 },
    icon: "Home"
  },
  {
    id: "commercial",
    name: "Commercial & Business Hub",
    description: "Multi-story smart high-rises utilizing infrared parking sensors, automated waste routing bins, and intelligent heating ventilation (HVAC) systems.",
    status: "OPTIMAL",
    components: ["waste_mgmt", "parking"],
    coordinates: { x: 50, y: 22 },
    icon: "Building2"
  },
  {
    id: "industrial",
    name: "Industrial Green Zone",
    description: "Self-regulating carbon capture and air scrubbing facilities that continuously analyze gas telemetry and neutralize atmospheric pollutants.",
    status: "OPTIMAL",
    components: ["scrubber"],
    coordinates: { x: 82, y: 35 },
    icon: "Factory"
  },
  {
    id: "renewable",
    name: "Renewable Energy Park",
    description: "The primary power source of the twin city, boasting dual-axis solar trackers, smart wind turbines, and dynamic battery micro-grids.",
    status: "OPTIMAL",
    components: ["green_grid"],
    coordinates: { x: 15, y: 72 },
    icon: "Sun"
  },
  {
    id: "hospital",
    name: "Hospital & Emergency Zone",
    description: "Critical safety wing housing autonomous water flood gates, heavy drainage pumps, and emergency RFID medical routing systems.",
    status: "OPTIMAL",
    components: ["flood_barrier", "priority_routing"],
    coordinates: { x: 50, y: 78 },
    icon: "HeartPulse"
  },
  {
    id: "farming",
    name: "Smart Farming Area",
    description: "Automated greenhouses equipped with capacitive sensors and micro-watering pumps that run localized vertical farming systems.",
    status: "OPTIMAL",
    components: ["greenhouse"],
    coordinates: { x: 85, y: 72 },
    icon: "Sprout"
  },
  {
    id: "control",
    name: "Central Control Center",
    description: "The digital twin headquarters containing the 3-axis accelerometer earthquake halts, main database linkages, and full AI diagnostics.",
    status: "OPTIMAL",
    components: ["seismic"],
    coordinates: { x: 50, y: 50 },
    icon: "Cpu"
  }
];

export const EMERGENCY_TRIGGERS: EmergencyTrigger[] = [
  {
    id: "earthquake",
    name: "Trigger Earthquake Simulation",
    icon: "Activity",
    hazardType: "EARTHQUAKE",
    description: "Simulates severe structural movement (Richter 7.2) to test structural seismographs, emergency gas solenoid shutoffs, and automated metro deceleration.",
    buttonClass: "border-red-500/40 text-red-400 hover:bg-red-500/10 focus:ring-red-500/30"
  },
  {
    id: "flood",
    name: "Trigger Flash Flood Simulation",
    icon: "Waves",
    hazardType: "FLOOD",
    description: "Simulates rapid storm surge flooding to test ultrasonic water feedback, auto-raising heavy physical barriers, and emergency ambulance ER corridor rerouting.",
    buttonClass: "border-blue-500/40 text-blue-400 hover:bg-blue-500/10 focus:ring-blue-500/30"
  },
  {
    id: "grid_failure",
    name: "Trigger Grid Failure Simulation",
    icon: "ZapOff",
    hazardType: "GRID_FAILURE",
    description: "Simulates sudden central power grid blackout to verify high-speed current monitoring and seamless backup battery storage system takeover.",
    buttonClass: "border-amber-500/40 text-amber-400 hover:bg-amber-500/10 focus:ring-amber-500/30"
  }
];
