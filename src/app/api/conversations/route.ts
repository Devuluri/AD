import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/conversations - List past conversations
export async function GET() {
  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        _count: {
          select: { messages: true },
        },
      },
    });

    const formatted = conversations.map((conv) => ({
      id: conv.id,
      title: conv.title,
      createdAt: conv.createdAt.toISOString(),
      updatedAt: conv.updatedAt.toISOString(),
      isSaved: conv.isSaved,
      messageCount: conv._count.messages,
      lastMessage: conv.messages[0]?.content || "",
    }));

    return NextResponse.json({ conversations: formatted });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json({ conversations: [] }, { status: 200 });
  }
}

// POST /api/conversations - Create a fresh conversation
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const title = body.title || "New Health Consultation";

    const conv = await prisma.conversation.create({
      data: {
        title,
      },
    });

    return NextResponse.json({
      id: conv.id,
      title: conv.title,
      createdAt: conv.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { error: "Could not create conversation" },
      { status: 500 }
    );
  }
}
