import { NextRequest, NextResponse } from "next/server";
import { compareMedicalReports } from "@/lib/medicalReportAnalyzer";
import { BiomarkerItem } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { reportA, reportB } = body;

    if (!reportA || !reportB || !Array.isArray(reportA.biomarkers) || !Array.isArray(reportB.biomarkers)) {
      return NextResponse.json(
        { error: "Both reportA and reportB with 'biomarkers' arrays are required for comparison." },
        { status: 400 }
      );
    }

    const comparison = compareMedicalReports(
      {
        title: reportA.title || "Baseline Report",
        date: reportA.date || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        biomarkers: reportA.biomarkers as BiomarkerItem[],
      },
      {
        title: reportB.title || "Recent Report",
        date: reportB.date || new Date().toISOString(),
        biomarkers: reportB.biomarkers as BiomarkerItem[],
      }
    );

    return NextResponse.json({
      success: true,
      comparison,
    });
  } catch (error) {
    console.error("Error comparing medical reports:", error);
    return NextResponse.json({ error: "Failed to perform longitudinal comparison." }, { status: 500 });
  }
}
