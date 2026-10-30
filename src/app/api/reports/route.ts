import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { SAMPLE_LAB_REPORTS } from "@/lib/medicalReportAnalyzer";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get("profileId");

    const savedReports = await prisma.medicalReport.findMany({
      where: profileId ? { profileId } : {},
      orderBy: { createdAt: "desc" },
      include: {
        biomarkers: true,
      },
    });

    const formattedSaved = savedReports.map((r) => ({
      id: r.id,
      profileId: r.profileId,
      title: r.title,
      testType: r.testType,
      testDate: r.testDate.toISOString(),
      summary: r.summary,
      findings: r.findings,
      recommendations: r.recommendations,
      rawContent: r.rawContent,
      createdAt: r.createdAt.toISOString(),
      biomarkers: r.biomarkers.map((b) => ({
        id: b.id,
        name: b.name,
        value: b.value,
        numericValue: parseFloat(b.value.replace(/,/g, "")) || undefined,
        unit: b.unit,
        referenceRange: b.referenceRange,
        status: b.status as "normal" | "borderline" | "abnormal" | "critical",
        interpretation: b.interpretation || "",
      })),
    }));

    return NextResponse.json({
      savedReports: formattedSaved,
      sampleReports: SAMPLE_LAB_REPORTS,
    });
  } catch (error) {
    console.error("Error retrieving medical reports:", error);
    return NextResponse.json({ error: "Failed to fetch medical reports" }, { status: 500 });
  }
}
