import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/vitals - Retrieve vital records, optionally filtered by profileId
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get("profileId");

    const vitals = await prisma.vitalRecord.findMany({
      where: profileId ? { profileId } : {},
      orderBy: { recordedAt: "desc" },
      take: 50,
    });

    const formatted = vitals.map((v) => ({
      ...v,
      recordedAt: v.recordedAt.toISOString(),
      createdAt: v.createdAt.toISOString(),
    }));

    return NextResponse.json({ vitals: formatted });
  } catch (error) {
    console.error("Error fetching vitals:", error);
    return NextResponse.json({ error: "Failed to retrieve vitals" }, { status: 500 });
  }
}

// POST /api/vitals - Log a new vital measurement
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profileId, type, value, unit, notes } = body;

    if (!type || !value) {
      return NextResponse.json({ error: "Vital 'type' and 'value' are required." }, { status: 400 });
    }

    // Determine clinical status automatically
    let status = "normal";
    const num = parseFloat(value);

    if (type === "blood_pressure") {
      // e.g. "120/80" or "140/90"
      const parts = value.split("/");
      if (parts.length === 2) {
        const sys = parseInt(parts[0], 10);
        const dia = parseInt(parts[1], 10);
        if (sys >= 180 || dia >= 120) status = "critical";
        else if (sys >= 130 || dia >= 85) status = "warning";
      }
    } else if (type === "heart_rate") {
      if (num > 120 || num < 45) status = "critical";
      else if (num > 100 || num < 55) status = "warning";
    } else if (type === "glucose") {
      if (num > 250 || num < 60) status = "critical";
      else if (num > 125 || num < 70) status = "warning";
    } else if (type === "spo2") {
      if (num < 90) status = "critical";
      else if (num < 95) status = "warning";
    } else if (type === "temperature") {
      const tempF = unit === "°C" ? (num * 9) / 5 + 32 : num;
      if (tempF >= 103 || tempF < 95) status = "critical";
      else if (tempF >= 100.4) status = "warning";
    }

    const vital = await prisma.vitalRecord.create({
      data: {
        profileId: profileId || null,
        type,
        value: String(value),
        unit: unit || "",
        status,
        notes: notes || null,
      },
    });

    // Also auto-log to Timeline
    try {
      await prisma.timelineEvent.create({
        data: {
          profileId: profileId || null,
          title: `Logged ${type.replace("_", " ").toUpperCase()}: ${value} ${unit || ""}`,
          category: "vital",
          description: notes ? `Notes: ${notes} (Status: ${status})` : `Status evaluated as: ${status}`,
          severity: status === "critical" ? "severe" : status === "warning" ? "moderate" : "mild",
        },
      });
    } catch (e) {
      console.warn("Timeline log warning:", e);
    }

    return NextResponse.json({
      vital: {
        ...vital,
        recordedAt: vital.recordedAt.toISOString(),
        createdAt: vital.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error logging vital:", error);
    return NextResponse.json({ error: "Failed to record vital" }, { status: 500 });
  }
}
