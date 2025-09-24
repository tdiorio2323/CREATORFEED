import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  try {
    const { messages } = event.body ? JSON.parse(event.body) : { messages: [] };
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: messages.length ? messages : [{ role: "user", content: "Ping" }],
        temperature: 0.3,
      }),
    });
    const j = await r.json();
    return { statusCode: 200, body: JSON.stringify({ content: j.choices?.[0]?.message?.content ?? "" }) };
  } catch (e: any) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message || "error" }) };
  }
};
