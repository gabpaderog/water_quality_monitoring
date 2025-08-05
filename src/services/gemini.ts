// src/services/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

// Interface for the water quality data
export interface WaterQualityData {
  ph: number;
  turbidity: number;
  tds: number;
  temperature: number;
  timestamp: string;
}

// Validate API key from environment
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("VITE_GEMINI_API_KEY is not defined.");
}

// Initialize Gemini instance
const genAI = new GoogleGenerativeAI(API_KEY);

// Create a formatted prompt string
const createWaterQualityPrompt = (data: WaterQualityData): string => {
  return `
You are an expert in water quality monitoring. Based on the following sensor data, give a **simple and clear summary** (3–5 sentences max) of the water condition.

Sensor Readings:
- pH: ${data.ph}
- Turbidity (NTU): ${data.turbidity}
- TDS (mg/L): ${data.tds}
- Temperature (°C): ${data.temperature}
- Time: ${data.timestamp}

Focus on:
1. Overall water condition (safe or not).
2. Any issues in the values.
3. One suggestion (if needed).

Avoid headings. Just provide a short summary in plain language.
`;
};

// Exported function to call Gemini and analyze water quality
export const analyzeWaterQuality = async (data: WaterQualityData): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = createWaterQualityPrompt(data);

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return text;
  } catch (error) {
    console.error("Error fetching Gemini analysis:", error);
    throw new Error("Failed to get analysis from Gemini API.");
  }
};
