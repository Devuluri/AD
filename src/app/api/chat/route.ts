import { NextRequest, NextResponse } from "next/server";
import { getGeminiChatResponse } from "@/lib/gemini";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, conversationId, language, profileId } = body;

    // Input validation
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid request: 'messages' must be a non-empty array." },
        { status: 400 }
      );
    }

    const latestMessage = messages[messages.length - 1];
    if (
      !latestMessage ||
      !latestMessage.content ||
      typeof latestMessage.content !== "string" ||
      latestMessage.content.trim() === ""
    ) {
      return NextResponse.json(
        { error: "Invalid request: Latest message content cannot be empty." },
        { status: 400 }
      );
    }

    // Call Gemini API (with seamless medical fallback)
    const { text: responseText, modelUsed } = await getGeminiChatResponse(messages, language);

    // Save to Prisma SQLite database if conversationId is provided or if saving is enabled
    let activeConvId = conversationId;
    try {
      if (activeConvId) {
        let conversation = await prisma.conversation.findUnique({
          where: { id: activeConvId },
        });

        if (!conversation) {
          const titleSnippet =
            latestMessage.content.length > 35
              ? latestMessage.content.substring(0, 35) + "..."
              : latestMessage.content;

          conversation = await prisma.conversation.create({
            data: {
              id: activeConvId,
              title: titleSnippet,
              profileId: profileId || null,
            },
          });
        }

        await prisma.message.createMany({
          data: [
            {
              conversationId: activeConvId,
              role: latestMessage.role || "user",
              content: latestMessage.content.trim(),
            },
            {
              conversationId: activeConvId,
              role: "assistant",
              content: responseText,
            },
          ],
        });
      } else {
        const titleSnippet =
          latestMessage.content.length > 35
            ? latestMessage.content.substring(0, 35) + "..."
            : latestMessage.content;

        const newConv = await prisma.conversation.create({
          data: {
            title: titleSnippet,
            profileId: profileId || null,
            messages: {
              create: [
                {
                  role: latestMessage.role || "user",
                  content: latestMessage.content.trim(),
                },
                {
                  role: "assistant",
                  content: responseText,
                },
              ],
            },
          },
        });
        activeConvId = newConv.id;
      }

      // Auto-index health complaint to timeline if it's a first turn or significant symptom
      const symptomKeywords = ["fever", "pain", "cough", "headache", "vomiting", "dizziness", "chest", "rash"];
      const hasSymptom = symptomKeywords.some((w) => latestMessage.content.toLowerCase().includes(w));
      if (hasSymptom && latestMessage.role === "user") {
        await prisma.timelineEvent.create({
          data: {
            profileId: profileId || null,
            title: `Reported Symptom: ${latestMessage.content.substring(0, 45)}...`,
            category: "symptom",
            description: `Patient reported: "${latestMessage.content}". Vaidya Sahay AI initiated clinical triage assessment.`,
            severity: latestMessage.content.toLowerCase().includes("chest") ? "severe" : "moderate",
          },
        });
      }
    } catch (dbError) {
      console.error("Database persistence warning:", dbError);
    }

    return NextResponse.json({
      response: responseText,
      conversationId: activeConvId,
      modelUsed,
    });
  } catch (err: unknown) {
    console.error("Error in /api/chat route:", err);
    return NextResponse.json(
      {
        error: "Unable to process your request at this moment.",
        response:
          "I am experiencing a momentary connection issue. Please feel free to repeat your question or consult a local doctor if you are experiencing severe symptoms.",
      },
      { status: 500 }
    );
  }
}
