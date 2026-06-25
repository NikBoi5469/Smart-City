import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini AI client to prevent startup crashes if key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// REST API for AI smart city advisor diagnostics
app.post("/api/gemini/advisor", async (req, res) => {
  try {
    const { metrics, alerts, activeZone, activeNighttime } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      // Graceful fallback when GEMINI_API_KEY is not configured
      return res.json({
        status: alerts.length > 0 ? "WARNING" : "OPTIMAL",
        diagnosis: "System is operating on local emergency fallback logic. [AI Offline: GEMINI_API_KEY not set in Settings > Secrets]",
        recommendations: [
          alerts.length > 0
            ? "Inspect hardware sensor arrays for localized telemetry failures."
            : "Optimize municipal micro-grid dispatch during offline maintenance periods.",
          "Check documentation to configure API keys for full neural diagnostics."
        ]
      });
    }

    const prompt = `You are the central AI supervisor of the "AI-Powered Self-Healing Sustainable Smart City" digital twin control center.
Analyze the current city state and provide a concise, professional, futuristic diagnosis and system remediation steps.

City Metrics:
- Green Energy Grid: ${metrics.energy}% (Solar/Wind/Battery reserves)
- Traffic Congestion: ${metrics.traffic}%
- Air Quality Index (AQI): ${metrics.aqi}
- Water Reserves: ${metrics.water}%
- Selected Zone/View: ${activeZone || "Central Control Center"}
- Nighttime Simulation Mode: ${activeNighttime ? "ON (Solar output dimmed, smart streetlights active)" : "OFF (Full daylight solar harvesting)"}
- Active System Alerts / Hazards: ${alerts && alerts.length > 0 ? alerts.join(", ") : "None. All systems optimal."}

Response Requirement:
Provide a 1-word status, a highly polished, analytical 2-to-3 sentence diagnosis, and exactly 2 or 3 predictive sustainability or healing recommendations.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { 
              type: Type.STRING,
              description: "Must be one of: OPTIMAL, WARNING, HAZARD" 
            },
            diagnosis: { 
              type: Type.STRING, 
              description: "A professional, highly futuristic, technical analysis of current city operations." 
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2 or 3 specific, actionable recommendations."
            }
          },
          required: ["status", "diagnosis", "recommendations"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response content from Gemini.");
    }

    const data = JSON.parse(text);
    return res.json(data);
  } catch (error: any) {
    console.error("Gemini Advisor Endpoint Error:", error);
    return res.status(500).json({
      status: "WARNING",
      diagnosis: `Neural link communication anomaly. Standard operational protocols remain active. (${error.message})`,
      recommendations: [
        "Monitor local microcontroller logs for signal interference.",
        "Initiate manual telemetry audit across the sustainable grid."
      ]
    });
  }
});

// Configure Vite or Static Assets serving
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Smart City Digital Twin running on http://localhost:${PORT}`);
  });
}

setupServer();
