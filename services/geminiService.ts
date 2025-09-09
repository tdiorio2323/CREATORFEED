import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateGeminiContent = async (prompt: string): Promise<string> => {
    if (!process.env.API_KEY) {
        return "Error: API key is not configured.";
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            // FIX: Simplified `contents` to a string for single-turn requests.
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Gemini API call failed:", error);
        if (error instanceof Error) {
            return `Error: Unable to generate content. ${error.message}`;
        }
        return "Error: An unknown error occurred while generating content.";
    }
};
