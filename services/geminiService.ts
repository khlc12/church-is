import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;

// Initialize the client securely
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateAnnouncementDraft = async (topic: string, tone: string): Promise<string> => {
  if (!ai) {
    return "API Key is missing. Please configure the environment variable.";
  }

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `Write a short, engaging parish bulletin announcement about: "${topic}". 
    Tone: ${tone}. 
    Keep it under 100 words. 
    Format it with a clear title followed by the body text.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Failed to generate content.";
  } catch (error) {
    console.error("Error generating announcement:", error);
    return "An error occurred while contacting the AI service.";
  }
};

export const generateHomilyOutline = async (gospelReading: string): Promise<string> => {
  if (!ai) {
    return "API Key is missing.";
  }

  try {
     const model = 'gemini-2.5-flash';
     const prompt = `Create a structured 3-point homily outline based on this Gospel reading/theme: "${gospelReading}". 
     Provide a reflection suitable for a Filipino Catholic community.`;

     const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
     });

     return response.text || "Failed to generate outline.";
  } catch (error) {
    console.error("Error generating homily:", error);
    return "An error occurred.";
  }
}