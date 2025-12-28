
import { GoogleGenAI, Type } from "@google/genai";
import { SymptomData, PredictionResult, HospitalRecommendation } from "../types.ts";

const getApiKey = () => {
  const key = (typeof process !== 'undefined' && process.env.API_KEY) || 
              (window as any)._env_?.API_KEY || 
              '';
  return key;
};

// Create instance inside functions or ensure it's handled gracefully
const getAIClient = () => new GoogleGenAI({ apiKey: getApiKey() });

const PREDICTION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    diseaseName: { type: Type.STRING },
    confidence: { type: Type.NUMBER },
    description: { type: Type.STRING },
    precautions: { type: Type.ARRAY, items: { type: Type.STRING } },
    medications: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          usage: { type: Type.STRING }
        },
        required: ["name", "description", "usage"]
      }
    },
    specialistType: { type: Type.STRING },
    urgencyLevel: { type: Type.STRING, enum: ["low", "medium", "high", "emergency"] }
  },
  required: ["diseaseName", "confidence", "description", "precautions", "medications", "specialistType", "urgencyLevel"]
};

/**
 * Robustly extract JSON from AI response strings
 */
function extractJsonFromText(text: string): any {
  if (!text) return [];
  try {
    // Attempt 1: Standard parse
    return JSON.parse(text);
  } catch (e) {
    // Attempt 2: Extract content between code blocks
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch && codeBlockMatch[1]) {
      try {
        return JSON.parse(codeBlockMatch[1]);
      } catch (e2) {}
    }
    
    // Attempt 3: Find the first '[' and last ']'
    const bracketMatch = text.match(/\[[\s\S]*\]/);
    if (bracketMatch) {
      try {
        return JSON.parse(bracketMatch[0]);
      } catch (e3) {}
    }
  }
  return [];
}

export const predictDisease = async (data: SymptomData): Promise<PredictionResult> => {
  const ai = getAIClient();
  const prompt = `Analyze these symptoms: ${data.symptoms}. Duration: ${data.duration} days. Severity: ${data.severity}. 
  Provide a detailed medical assessment including probable disease, medications, precautions, and specialist recommendation. 
  Note: If fever has persisted for ${data.duration} days, prioritize evaluating it.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: PREDICTION_SCHEMA as any,
    }
  });

  return JSON.parse(response.text || '{}');
};

export const findHospitals = async (specialization: string, disease: string): Promise<HospitalRecommendation[]> => {
  const ai = getAIClient();
  const prompt = `Provide a list of 5 real-world top-tier hospitals and famous specialists in India for ${specialization} to treat ${disease}.
  Return ONLY a JSON array of objects with keys: "name", "city", "doctorName", "specialization", "appointmentLink", "rating".
  Format exactly like this: [{"name": "Apollo Hospital", "city": "Delhi", "doctorName": "Dr. Sharma", "specialization": "Cardiology", "appointmentLink": "https://www.apollohospitals.com", "rating": "4.9"}]`;

  try {
    // ATTEMPT 1: Search Grounding (Real-time)
    console.debug("Attempting hospital search with grounding...");
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // No responseMimeType here to avoid conflicts with tools
      }
    });

    const results = extractJsonFromText(response.text);
    if (results && Array.isArray(results) && results.length > 0) return results;
    throw new Error("Empty search results");

  } catch (error) {
    console.warn("Search grounding failed, falling back to internal knowledge:", error);
    
    // ATTEMPT 2: Fallback to internal knowledge (No Search Tool)
    try {
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          // Static JSON schema for fallback stability
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                city: { type: Type.STRING },
                doctorName: { type: Type.STRING },
                specialization: { type: Type.STRING },
                appointmentLink: { type: Type.STRING },
                rating: { type: Type.STRING }
              },
              required: ["name", "city", "doctorName", "specialization", "appointmentLink"]
            }
          } as any
        }
      });
      
      const fallbackResults = JSON.parse(fallbackResponse.text || '[]');
      return Array.isArray(fallbackResults) ? fallbackResults : [];
    } catch (fallbackError) {
      console.error("Critical: Both search and fallback failed.", fallbackError);
      throw fallbackError;
    }
  }
};

export const getChatResponse = async (history: { role: string, content: string }[], userMessage: string) => {
  const ai = getAIClient();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "You are MediMind AI, a highly accurate professional AI medical doctor. IMPORTANT: Always keep your answers extremely brief and concise. Do not exceed 3-4 lines of text. Get straight to the point. Provide medical advice based on symptoms, suggest precautions, and always advise consulting a physical doctor for serious conditions. Maintain a caring but clinical tone."
    }
  });

  const response = await chat.sendMessage({ message: userMessage });
  return response.text;
};
