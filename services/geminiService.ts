import { GoogleGenAI, Type } from "@google/genai";
import { ThemeResponse } from "../types";

const apiKey = process.env.API_KEY;

// Initialize conditionally to allow app to load (albeit with limited features) without key
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const generatePrizesFromTheme = async (theme: string): Promise<{ text: string }[]> => {
  if (!ai) throw new Error("API Key missing");

  const prompt = `Generate a list of 6 exciting prize names for a roulette game based on the theme: "${theme}". Keep names under 15 characters.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prizes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                }
              },
            },
          },
        },
      },
    });

    const result = JSON.parse(response.text || '{"prizes": []}') as ThemeResponse;
    return result.prizes;
  } catch (error) {
    console.error("Gemini Prize Generation Error:", error);
    return [
      { text: "Mystery Prize" },
      { text: "Try Again" },
      { text: "Jackpot" },
      { text: "One Cookie" }
    ];
  }
};

export const generateWinningMessage = async (prizeName: string): Promise<string> => {
  if (!ai) return `You won ${prizeName}!`;

  const prompt = `The user just won "${prizeName}" on a spin-the-wheel game. Write a very short (max 15 words), witty, or funny congratulatory message.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || `Congratulations on winning ${prizeName}!`;
  } catch (error) {
    console.error("Gemini Message Generation Error:", error);
    return `Wow! You got ${prizeName}!`;
  }
};