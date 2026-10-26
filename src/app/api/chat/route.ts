import { NextRequest, NextResponse } from "next/server";
import { getGeminiChatResponse } from "@/lib/gemini";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, conversationId } = body;

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
    const { text: responseText, modelUsed } = await getGeminiChatResponse(messages);

    // Save to Prisma SQLite database if conversationId is provided or if saving is enabled
    let activeConvId = conversationId;
    try {
      if (activeConvId) {
        // Ensure conversation exists or create it
        let conversation = await prisma.conversation.findUnique({
          where: { id: activeConvId },
        });

        if (!conversation) {
          // Generate an intelligent title from first user query
          const titleSnippet =
            latestMessage.content.length > 35
              ? latestMessage.content.substring(0, 35) + "..."
              : latestMessage.content;

          conversation = await prisma.conversation.create({
            data: {
              id: activeConvId,
              title: titleSnippet,
            },
          });
        }

        // Save the user message and assistant response
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
        // Create a new conversation and persist
        const titleSnippet =
          latestMessage.content.length > 35
            ? latestMessage.content.substring(0, 35) + "..."
            : latestMessage.content;

        const newConv = await prisma.conversation.create({
          data: {
            title: titleSnippet,
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
    } catch (dbError) {
      // Don't let database write error prevent returning the AI response
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
