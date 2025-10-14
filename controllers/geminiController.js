import User from "../models/User.js";
import UserProgramTrack from "../models/UserProgramTrack.js";
import UserDayTrack from "../models/UserDayTrack.js";
import Program from "../models/Program.js";
import fetch from "node-fetch";

// ✅ Conversation API
export const generateGeminiResponse = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { messages } = req.body;

    if (!userId) return res.status(400).json({ error: "userId is required" });
    if (!messages || !Array.isArray(messages))
      return res.status(400).json({ error: "messages array is required" });

    // ✅ Fetch user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const userName = user.name || user.username;

    // ✅ Get program progress
    const enrolledPrograms = await UserProgramTrack.find({ userId }).populate("programId");
    const programProgress = await Promise.all(
      enrolledPrograms.map(async (track) => {
        const program = track.programId;
        const dayTracks = await UserDayTrack.find({ userId, programId: program._id });
        const completedDays = dayTracks.length;
        const totalDays = Number(program.days);
        return `${program.title}: ${completedDays}/${totalDays} days completed`;
      })
    );

    // ✅ Prepare conversation for Gemini
    const contextText = `You are a wellness chatbot talking to ${userName}. User's program progress:\n${programProgress.join(
      "\n"
    )}`;

    // ✅ Gemini only accepts user/assistant roles, so prepend context as first user message
    const fullConversation = [
      { role: "user", parts: [{ text: contextText }] },
      ...messages.map((m) => ({ role: "user", parts: [{ text: m.text }] })),
    ];

    // ✅ Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: fullConversation }),
      }
    );

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    return res.json({ output: text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};


export const summaryGeminiResponse = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { messages } = req.body;

    if (!userId) return res.status(400).json({ error: "userId is required" });
    if (!messages || !Array.isArray(messages))
      return res.status(400).json({ error: "messages array is required" });

    // ✅ Fetch user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const userName = user.name || user.username;

    // ✅ Prepare conversation text
    const conversation = messages
      .map((m) => `${m.role === "user" ? userName : "Bot"}: ${m.text}`)
      .join("\n");

    const prompt = `Summarize this conversation briefly for ${userName}:\n\n${conversation}`;

    // ✅ Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No summary";

    return res.json({ output: text });
  } catch (error) {
    console.error("Gemini Summary API Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

