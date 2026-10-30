import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/timeline - Get aggregated health timeline events
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get("profileId");

    const events = await prisma.timelineEvent.findMany({
      where: profileId ? { profileId } : {},
      orderBy: { eventDate: "desc" },
      take: 100,
    });

    const formatted = events.map((e) => ({
      ...e,
      eventDate: e.eventDate.toISOString(),
      createdAt: e.createdAt.toISOString(),
    }));

    return NextResponse.json({ events: formatted });
  } catch (error) {
    console.error("Error fetching health timeline:", error);
    return NextResponse.json({ error: "Failed to retrieve health timeline" }, { status: 500 });
  }
}

// POST /api/timeline - Manually log a timeline health event (symptom, medication, etc.)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profileId, title, category, eventDate, description, severity } = body;

    if (!title || !category || !description) {
      return NextResponse.json(
        { error: "Title, category, and description are required for a timeline event." },
        { status: 400 }
      );
    }

    const newEvent = await prisma.timelineEvent.create({
      data: {
        profileId: profileId || null,
        title: title.trim(),
        category,
        eventDate: eventDate ? new Date(eventDate) : new Date(),
        description: description.trim(),
        severity: severity || "mild",
      },
    });

    return NextResponse.json({
      event: {
        ...newEvent,
        eventDate: newEvent.eventDate.toISOString(),
        createdAt: newEvent.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error logging timeline event:", error);
    return NextResponse.json({ error: "Failed to create timeline event" }, { status: 500 });
  }
}
