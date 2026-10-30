import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, profileId } = body;

    if (!query || typeof query !== "string" || query.trim() === "") {
      return NextResponse.json({ error: "Search query is required." }, { status: 400 });
    }

    // Retrieve past user messages from database
    const pastConversations = await prisma.conversation.findMany({
      where: profileId ? { profileId } : {},
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (pastConversations.length === 0) {
      return NextResponse.json({
        answer: "You do not have any past recorded health conversations yet. Once you chat with Vaidya Sahay AI, your reported symptoms will be securely indexed here.",
        matchedRecords: 0,
      });
    }

    // Compile past dialogue history with dates
    let historyCorpus = "";
    let totalMessages = 0;

    pastConversations.forEach((conv, idx) => {
      const convDate = new Date(conv.createdAt).toLocaleDateString([], {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      historyCorpus += `\n--- Conversation Session #${idx + 1} (${convDate}): "${conv.title}" ---\n`;
      conv.messages.forEach((msg) => {
        totalMessages++;
        historyCorpus += `[${msg.role === "user" ? "Patient Reported" : "Vaidya Sahay Guidance"}]: ${msg.content}\n`;
      });
    });

    // Synthesize answer using Gemini or Clinical History Synthesizer
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    let synthesis = "";

    if (apiKey && apiKey !== "your_gemini_api_key_here") {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
You are the Conversational Memory Query Engine for Vaidya Sahay AI.
A patient is asking a question about what they reported in previous conversations.

User Question: "${query}"

Here is their securely recorded conversation history:
${historyCorpus}

INSTRUCTIONS:
1. Direct Answer: Answer the user's question accurately based ONLY on what was reported in their history.
2. Timeline Accuracy: Cite the specific dates and sessions when they mentioned those symptoms or numbers (e.g. "On Oct 26, you mentioned having a 102°F fever and headache").
3. Clinical Distinction: Clearly distinguish what the patient reported from any certified physician medical records.
4. Tone: Helpful, empathetic, and clear.
        `.trim();

        const result = await model.generateContent(prompt);
        const res = await result.response;
        synthesis = res.text();
      } catch (err) {
        console.error("Gemini history query error:", err);
      }
    }

    // Fallback extraction if Gemini is not available or threw an error
    if (!synthesis) {
      const q = query.toLowerCase();
      const relevantSnippets: string[] = [];

      pastConversations.forEach((conv) => {
        const convDate = new Date(conv.createdAt).toLocaleDateString();
        conv.messages.forEach((msg) => {
          if (msg.role === "user" && (q.split(" ").some((w) => w.length > 3 && msg.content.toLowerCase().includes(w)))) {
            relevantSnippets.push(`• On ${convDate}: You reported "${msg.content}"`);
          }
        });
      });

      if (relevantSnippets.length > 0) {
        synthesis =
          `Based on your previous conversations, here is what you reported regarding "${query}":\n\n` +
          relevantSnippets.slice(0, 5).join("\n\n") +
          "\n\n*Note: This information reflects your self-reported symptoms in chat and does not constitute a formal electronic health record.*";
      } else {
        synthesis =
          `I searched through your ${pastConversations.length} previous consultation session(s), but did not find a specific match for "${query}". You can ask about other symptoms such as fever, headache, or medications discussed.`;
      }
    }

    return NextResponse.json({
      answer: synthesis,
      matchedSessions: pastConversations.length,
      totalMessagesExamined: totalMessages,
    });
  } catch (error) {
    console.error("Error in history-query:", error);
    return NextResponse.json({ error: "Failed to query past health conversations." }, { status: 500 });
  }
}
