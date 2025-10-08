// ✅ Conversation API
export const generateGeminiResponse = async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array is required" });
    }

    const formatted = messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: formatted })
      }
    );

    const data = await response.json();
    // console.log(data);  
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    return res.json({ output: text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// ✅ Summary API
export const summaryGeminiResponse = async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array is required" });
    }

    const conversation = messages
      .map((m) => `${m.role === "user" ? "User" : "Bot"}: ${m.text}`)
      .join("\n");

    const prompt = `Summarize this conversation briefly:\n\n${conversation}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "No summary";
    return res.json({ output: text });
  } catch (error) {
    console.error("Gemini Summary API Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
