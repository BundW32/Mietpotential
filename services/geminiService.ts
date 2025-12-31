
import { GoogleGenAI, Type } from "@google/genai";
import { UserInput, AnalysisResult, GroundingSource } from "../types";

export const analyzePotential = async (input: UserInput): Promise<AnalysisResult> => {
  // Always create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    DU BIST EIN IMMOBILIEN-EXPERTE FÜR DEN DEUTSCHEN MARKT.
    Analysiere das Miet-Potential für:
    ADRESSE: ${input.address}
    DETAILS: ${input.sizeSqm}m², ${input.rooms} Zimmer, Baujahr ${input.yearBuilt}, Zustand: ${input.condition}.
    AUSSTATTUNG: Balkon: ${input.hasBalcony}, Fußbodenheizung: ${input.hasFloorHeating}, Barrierefrei: ${input.isBarrierFree}.

    AUFGABE:
    1. Nutze die Google-Suche, um aktuelle Vergleichsmieten (Immoscout24, Mietspiegel der Stadt, lokale Portale) für genau diesen Standort zu finden.
    2. Berechne die geschätzte Marktmiete pro m².
    3. Erkläre kurz die Lagequalität.
    4. Erstelle 3 typische Standort-Zonen (z.B. Einfache Lage, Mittlere Lage, Gute Lage) mit Kurzbeschreibung und Beispielen.

    ANTWORTE IM GEWÜNSCHTEN JSON-FORMAT.
  `;

  try {
    // Using responseSchema as recommended for structured JSON output and reliable parsing
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            estimatedMarketRentPerSqm: {
              type: Type.NUMBER,
              description: "The estimated market rent per square meter."
            },
            locationAnalysis: {
              type: Type.STRING,
              description: "Brief analysis of the location quality (max 3 sentences)."
            },
            confidenceScore: {
              type: Type.NUMBER,
              description: "Confidence score from 0 to 100."
            },
            featureImpacts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  feature: { type: Type.STRING },
                  impactPercent: { type: Type.NUMBER },
                  direction: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["feature", "impactPercent", "direction", "description"]
              }
            },
            locationZones: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  color: { type: Type.STRING },
                  examples: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["id", "name", "description"]
              }
            }
          },
          required: ["estimatedMarketRentPerSqm", "locationAnalysis", "confidenceScore", "featureImpacts"]
        }
      }
    });

    // Access the text property directly as it returns the string output from the model (do not use text())
    const rawJson = JSON.parse(response.text || "{}");
    
    // Extract website URLs from grounding chunks as required when using the googleSearch tool
    const sources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    chunks.forEach((chunk: any) => {
      if (chunk.web?.uri) {
        sources.push({
          uri: chunk.web.uri,
          title: chunk.web.title || "Marktdaten-Quelle"
        });
      }
    });

    const marketRentTotal = rawJson.estimatedMarketRentPerSqm * input.sizeSqm;
    const gain = Math.max(0, marketRentTotal - input.currentColdRent);

    return {
      ...rawJson,
      estimatedTotalMarketRent: marketRentTotal,
      potentialYearlyGain: gain * 12,
      rentGapPercentage: input.currentColdRent > 0 ? ((marketRentTotal - input.currentColdRent) / input.currentColdRent) * 100 : 0,
      sources: sources,
      sourceType: sources.length > 0 ? 'MARKET_DATA_GROUNDED' : 'AI_ESTIMATION'
    };
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
