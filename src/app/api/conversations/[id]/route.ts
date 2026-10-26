import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/conversations/[id] - Get messages for a conversation
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    const formattedMessages = conversation.messages.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      createdAt: m.createdAt.toISOString(),
    }));

    return NextResponse.json({
      id: conversation.id,
      title: conversation.title,
      isSaved: conversation.isSaved,
      messages: formattedMessages,
    });
  } catch (error) {
    console.error("Error fetching conversation details:", error);
    return NextResponse.json(
      { error: "Failed to load conversation" },
      { status: 500 }
    );
  }
}

// DELETE /api/conversations/[id] - Delete a conversation
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.conversation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return NextResponse.json(
      { error: "Failed to delete conversation" },
      { status: 500 }
    );
  }
}

// PATCH /api/conversations/[id] - Toggle saved or rename
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();

    const updated = await prisma.conversation.update({
      where: { id },
      data: {
        ...(typeof body.isSaved === "boolean" ? { isSaved: body.isSaved } : {}),
        ...(typeof body.title === "string" ? { title: body.title } : {}),
      },
    });

    return NextResponse.json({
      id: updated.id,
      title: updated.title,
      isSaved: updated.isSaved,
    });
  } catch (error) {
    console.error("Error updating conversation:", error);
    return NextResponse.json(
      { error: "Failed to update conversation" },
      { status: 500 }
    );
  }
}
