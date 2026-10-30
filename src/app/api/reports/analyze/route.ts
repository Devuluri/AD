import { NextRequest, NextResponse } from "next/server";
import { analyzeReportWithGemini } from "@/lib/medicalReportAnalyzer";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { reportText, testType, profileId, saveToDatabase } = body;

    if (!reportText || typeof reportText !== "string" || reportText.trim() === "") {
      return NextResponse.json(
        { error: "Report text or extracted medical findings are required." },
        { status: 400 }
      );
    }

    // Call analyzer (Gemini API with seamless clinical fallback)
    const analysis = await analyzeReportWithGemini(reportText.trim(), testType);

    // Save report & extracted biomarkers to SQLite if requested
    let savedReportId: string | null = null;
    if (saveToDatabase) {
      try {
        const saved = await prisma.medicalReport.create({
          data: {
            profileId: profileId || null,
            title: analysis.title,
            testType: testType || "General",
            summary: analysis.summary,
            findings: analysis.findings,
            recommendations: analysis.recommendations,
            rawContent: reportText.substring(0, 3000),
            biomarkers: {
              create: analysis.biomarkers.map((b) => ({
                name: b.name,
                value: String(b.value),
                unit: b.unit,
                referenceRange: b.referenceRange,
                status: b.status,
                interpretation: b.interpretation || "",
              })),
            },
          },
        });
        savedReportId = saved.id;

        // Add to Timeline
        await prisma.timelineEvent.create({
          data: {
            profileId: profileId || null,
            title: `Medical Report Analyzed: ${analysis.title}`,
            category: "report",
            description: analysis.summary,
            severity: analysis.biomarkers.some((b) => b.status === "abnormal" || b.status === "critical")
              ? "moderate"
              : "mild",
          },
        });
      } catch (dbErr) {
        console.error("Warning: Failed to persist report in database:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      reportId: savedReportId,
      analysis,
    });
  } catch (err: unknown) {
    console.error("Error analyzing medical report:", err);
    return NextResponse.json(
      { error: "An error occurred while processing the medical report." },
      { status: 500 }
    );
  }
}
