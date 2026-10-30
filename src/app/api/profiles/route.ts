import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/profiles - List all family profiles (creates default Self profile if none exist)
export async function GET() {
  try {
    let profiles = await prisma.profile.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        _count: {
          select: {
            conversations: true,
            vitalRecords: true,
            medicalReports: true,
          },
        },
      },
    });

    // Create default "Self" profile if none exist yet
    if (profiles.length === 0) {
      const defaultProfile = await prisma.profile.create({
        data: {
          name: "Primary User",
          relationship: "Self",
          age: 28,
          gender: "Other",
          bloodGroup: "O+",
          consentGranted: true,
        },
      });
      return NextResponse.json({
        profiles: [
          {
            ...defaultProfile,
            createdAt: defaultProfile.createdAt.toISOString(),
            updatedAt: defaultProfile.updatedAt.toISOString(),
            _count: { conversations: 0, vitalRecords: 0, medicalReports: 0 },
          },
        ],
      });
    }

    const formatted = profiles.map((p) => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));

    return NextResponse.json({ profiles: formatted });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return NextResponse.json({ error: "Failed to load family profiles" }, { status: 500 });
  }
}

// POST /api/profiles - Create a new family profile with consent
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, relationship, age, gender, bloodGroup, allergies, chronicConditions, consentGranted } = body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json({ error: "Profile name is required." }, { status: 400 });
    }

    if (consentGranted === false) {
      return NextResponse.json(
        { error: "Consent is required to store health information for family members under HIPAA/DISHA guidelines." },
        { status: 400 }
      );
    }

    const newProfile = await prisma.profile.create({
      data: {
        name: name.trim(),
        relationship: relationship || "Family Member",
        age: age ? parseInt(age, 10) : null,
        gender: gender || null,
        bloodGroup: bloodGroup || null,
        allergies: allergies || null,
        chronicConditions: chronicConditions || null,
        consentGranted: consentGranted ?? true,
      },
    });

    return NextResponse.json({
      profile: {
        ...newProfile,
        createdAt: newProfile.createdAt.toISOString(),
        updatedAt: newProfile.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error creating family profile:", error);
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
  }
}

// DELETE /api/profiles - Delete a profile (and all associated data under GDPR / patient data deletion rights)
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Profile ID is required" }, { status: 400 });
    }

    await prisma.profile.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error("Error deleting family profile:", error);
    return NextResponse.json({ error: "Failed to delete profile" }, { status: 500 });
  }
}
