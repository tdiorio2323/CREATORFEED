import { GoogleGenAI } from "@google/genai";

// Prefer GEMINI_API_KEY for clarity; fall back to API_KEY for compatibility
const apiKey = (process.env.GEMINI_API_KEY || process.env.API_KEY || '').trim();

if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. AI features will be disabled.");
}

// Instantiate client only when a key exists to avoid runtime errors in dev
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateGeminiContent = async (prompt: string): Promise<string> => {
    if (!apiKey || !ai) {
        return "Error: AI is not configured (missing GEMINI_API_KEY).";
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
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
