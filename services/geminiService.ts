export const generateGeminiContent = async (prompt: string): Promise<string> => {
    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "API request failed");
        }

        const data = await response.json();
        return data.content;
    } catch (error) {
        console.error("API call failed:", error);
        if (error instanceof Error) {
            return `Error: Unable to generate content. ${error.message}`;
        }
        return "Error: An unknown error occurred while generating content.";
    }
};