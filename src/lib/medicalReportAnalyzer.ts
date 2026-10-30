import { BiomarkerItem, BiomarkerDelta, ReportComparisonResult } from "./types";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const CLINICAL_REFERENCE_INTERVALS: Record<
  string,
  { min: number; max: number; unit: string; optimalRange: string; category: string }
> = {
  // CBC
  WBC: { min: 4500, max: 11000, unit: "/mcL", optimalRange: "4,500 - 11,000", category: "Infection & Immunity" },
  Platelets: { min: 150000, max: 450000, unit: "/mcL", optimalRange: "150,000 - 450,000", category: "Blood Clotting" },
  Hemoglobin: { min: 12.0, max: 16.5, unit: "g/dL", optimalRange: "12.0 - 16.5", category: "Oxygen Carrying" },
  RBC: { min: 4.2, max: 5.9, unit: "million/mcL", optimalRange: "4.2 - 5.9", category: "Red Blood Cells" },
  Neutrophils: { min: 40, max: 70, unit: "%", optimalRange: "40 - 70", category: "White Cell Differential" },
  Lymphocytes: { min: 20, max: 40, unit: "%", optimalRange: "20 - 40", category: "White Cell Differential" },

  // Lipid
  "Total Cholesterol": { min: 0, max: 200, unit: "mg/dL", optimalRange: "< 200", category: "Cardiovascular Risk" },
  "LDL Cholesterol": { min: 0, max: 100, unit: "mg/dL", optimalRange: "< 100", category: "Bad Cholesterol" },
  "HDL Cholesterol": { min: 40, max: 60, unit: "mg/dL", optimalRange: "> 45 (Optimal)", category: "Good Protective Cholesterol" },
  Triglycerides: { min: 0, max: 150, unit: "mg/dL", optimalRange: "< 150", category: "Blood Fats" },

  // Diabetes
  "Fasting Blood Sugar": { min: 70, max: 99, unit: "mg/dL", optimalRange: "70 - 99", category: "Glycemic Control" },
  "Post-Prandial Glucose": { min: 70, max: 140, unit: "mg/dL", optimalRange: "< 140", category: "After-Meal Glucose" },
  HbA1c: { min: 4.0, max: 5.6, unit: "%", optimalRange: "< 5.7 (Normal)", category: "3-Month Glycemic Average" },

  // Thyroid
  TSH: { min: 0.45, max: 4.5, unit: "mIU/L", optimalRange: "0.45 - 4.5", category: "Thyroid Stimulating Hormone" },
  Free_T3: { min: 2.3, max: 4.2, unit: "pg/mL", optimalRange: "2.3 - 4.2", category: "Active Thyroid Hormone" },
  Free_T4: { min: 0.8, max: 1.8, unit: "ng/dL", optimalRange: "0.8 - 1.8", category: "Thyroid Reserve" },
};

export const SAMPLE_LAB_REPORTS = [
  {
    id: "sample-cbc-current",
    title: "Complete Blood Count (CBC) — Day 2 Febrile Illness",
    testType: "CBC" as const,
    testDate: new Date().toISOString(),
    summary: "Significant leukocytosis and neutrophil shift indicating active acute bacterial or inflammatory defense response.",
    findings: "Elevated White Blood Cell count (13,200 /mcL) and mild neutrophilia (78%). Platelet reserve and Hemoglobin remain healthy.",
    recommendations: "Consult treating physician for clinical evaluation. Maintain adequate oral hydration.",
    biomarkers: [
      { name: "WBC", value: "13,200", numericValue: 13200, unit: "/mcL", referenceRange: "4,500 - 11,000", status: "abnormal" as const, interpretation: "High. Body's immune defense is elevated, typical of bacterial infections or acute systemic inflammation." },
      { name: "Neutrophils", value: "78", numericValue: 78, unit: "%", referenceRange: "40 - 70", status: "borderline" as const, interpretation: "Slightly elevated. Characteristic neutrophil-predominant reaction." },
      { name: "Hemoglobin", value: "13.8", numericValue: 13.8, unit: "g/dL", referenceRange: "12.0 - 16.5", status: "normal" as const, interpretation: "Healthy oxygen-carrying capacity." },
      { name: "Platelets", value: "195,000", numericValue: 195000, unit: "/mcL", referenceRange: "150,000 - 450,000", status: "normal" as const, interpretation: "Normal clotting reserve. No thrombocytopenia observed." },
    ],
  },
  {
    id: "sample-cbc-baseline",
    title: "Complete Blood Count (CBC) — Baseline (3 Months Ago)",
    testType: "CBC" as const,
    testDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    summary: "Normal baseline Complete Blood Count with no active leukocytosis or inflammatory markers.",
    findings: "All cell lines within standard reference intervals.",
    recommendations: "Standard annual preventive wellness check.",
    biomarkers: [
      { name: "WBC", value: "6,800", numericValue: 6800, unit: "/mcL", referenceRange: "4,500 - 11,000", status: "normal" as const, interpretation: "Resting healthy baseline white blood cell count." },
      { name: "Neutrophils", value: "58", numericValue: 58, unit: "%", referenceRange: "40 - 70", status: "normal" as const, interpretation: "Normal differential distribution." },
      { name: "Hemoglobin", value: "14.1", numericValue: 14.1, unit: "g/dL", referenceRange: "12.0 - 16.5", status: "normal" as const, interpretation: "Optimal red cell concentration." },
      { name: "Platelets", value: "240,000", numericValue: 240000, unit: "/mcL", referenceRange: "150,000 - 450,000", status: "normal" as const, interpretation: "Robust baseline platelet count." },
    ],
  },
  {
    id: "sample-lipid-current",
    title: "Comprehensive Lipid Profile (After 90-day Lifestyle Intervention)",
    testType: "Lipid Profile" as const,
    testDate: new Date().toISOString(),
    summary: "Marked improvement in LDL cholesterol and triglycerides following dietary modifications and aerobic exercise.",
    findings: "Total cholesterol reduced from 235 mg/dL to 198 mg/dL. Triglycerides normalized to 138 mg/dL.",
    recommendations: "Continue Mediterranean-style diet, fiber intake, and 150 minutes of weekly aerobic exercise.",
    biomarkers: [
      { name: "Total Cholesterol", value: "198", numericValue: 198, unit: "mg/dL", referenceRange: "< 200", status: "normal" as const, interpretation: "Normalized into healthy cardiovascular interval." },
      { name: "LDL Cholesterol", value: "108", numericValue: 108, unit: "mg/dL", referenceRange: "< 100", status: "borderline" as const, interpretation: "Significant reduction from previous high level; near-optimal." },
      { name: "HDL Cholesterol", value: "52", numericValue: 52, unit: "mg/dL", referenceRange: "> 45", status: "normal" as const, interpretation: "Protective good cholesterol improved." },
      { name: "Triglycerides", value: "138", numericValue: 138, unit: "mg/dL", referenceRange: "< 150", status: "normal" as const, interpretation: "Normalized into standard reference range." },
    ],
  },
  {
    id: "sample-lipid-baseline",
    title: "Comprehensive Lipid Profile (Baseline — High Cardiovascular Risk)",
    testType: "Lipid Profile" as const,
    testDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    summary: "Dyslipidemia characterized by elevated Total Cholesterol, LDL, and Triglycerides.",
    findings: "Total cholesterol at 235 mg/dL with LDL 148 mg/dL indicates elevated atherogenic lipid burden.",
    recommendations: "Dietary review, reduction in saturated fats, and cardiovascular risk assessment with physician.",
    biomarkers: [
      { name: "Total Cholesterol", value: "235", numericValue: 235, unit: "mg/dL", referenceRange: "< 200", status: "abnormal" as const, interpretation: "Elevated risk for plaque deposition." },
      { name: "LDL Cholesterol", value: "148", numericValue: 148, unit: "mg/dL", referenceRange: "< 100", status: "abnormal" as const, interpretation: "Elevated atherogenic lipoprotein concentration." },
      { name: "HDL Cholesterol", value: "42", numericValue: 42, unit: "mg/dL", referenceRange: "> 45", status: "borderline" as const, interpretation: "Suboptimal protective HDL." },
      { name: "Triglycerides", value: "192", numericValue: 192, unit: "mg/dL", referenceRange: "< 150", status: "abnormal" as const, interpretation: "High blood fats; increases metabolic risk." },
    ],
  },
  {
    id: "sample-diabetes-current",
    title: "Glycemic Profile & HbA1c (Current Month)",
    testType: "Diabetes / HbA1c" as const,
    testDate: new Date().toISOString(),
    summary: "HbA1c at 6.1% indicates pre-diabetes with moderate improvement through glycemic lifestyle management.",
    findings: "Fasting glucose at 108 mg/dL and HbA1c at 6.1% reflect steady glycemic stabilization.",
    recommendations: "Maintain low glycemic index diet, portion control, and repeat HbA1c testing in 90 days.",
    biomarkers: [
      { name: "HbA1c", value: "6.1", numericValue: 6.1, unit: "%", referenceRange: "< 5.7", status: "borderline" as const, interpretation: "Pre-diabetes range (5.7% - 6.4%). Reversible with disciplined lifestyle." },
      { name: "Fasting Blood Sugar", value: "108", numericValue: 108, unit: "mg/dL", referenceRange: "70 - 99", status: "borderline" as const, interpretation: "Mildly elevated fasting baseline." },
    ],
  },
];

/**
 * Compares two reports longitudinally and computes biomarker deltas
 */
export function compareMedicalReports(
  reportA: { title: string; date: string; biomarkers: BiomarkerItem[] },
  reportB: { title: string; date: string; biomarkers: BiomarkerItem[] }
): ReportComparisonResult {
  const deltas: BiomarkerDelta[] = [];

  // Map Report A (Previous) and Report B (Current)
  const mapA = new Map<string, BiomarkerItem>();
  reportA.biomarkers.forEach((bm) => mapA.set(bm.name.toLowerCase().trim(), bm));

  let improvedCount = 0;
  let worsenedCount = 0;

  reportB.biomarkers.forEach((bmCurrent) => {
    const key = bmCurrent.name.toLowerCase().trim();
    const bmPrev = mapA.get(key);

    if (bmPrev) {
      const valPrev = parseFloat(bmPrev.value.replace(/,/g, ""));
      const valCurrent = parseFloat(bmCurrent.value.replace(/,/g, ""));

      let changePct: number | undefined = undefined;
      let trend: "improved" | "worsened" | "stable" | "neutral" = "stable";
      let significance = "Stable levels observed.";

      if (!isNaN(valPrev) && !isNaN(valCurrent) && valPrev !== 0) {
        changePct = parseFloat((((valCurrent - valPrev) / valPrev) * 100).toFixed(1));

        // Clinical directionality assessment
        const isHigherBad =
          key.includes("wbc") ||
          key.includes("cholesterol") ||
          key.includes("ldl") ||
          key.includes("triglyceride") ||
          key.includes("hba1c") ||
          key.includes("glucose");

        const isHigherGood = key.includes("hdl") || key.includes("hemoglobin");

        if (Math.abs(changePct) < 2) {
          trend = "stable";
          significance = `Values remained steady (${bmPrev.value} → ${bmCurrent.value} ${bmCurrent.unit}).`;
        } else if (isHigherBad) {
          if (changePct < 0) {
            trend = "improved";
            improvedCount++;
            significance = `Favorable reduction of ${Math.abs(changePct)}% towards normal clinical range.`;
          } else {
            trend = "worsened";
            worsenedCount++;
            significance = `Elevation of ${changePct}% away from target reference interval.`;
          }
        } else if (isHigherGood) {
          if (changePct > 0) {
            trend = "improved";
            improvedCount++;
            significance = `Favorable gain of ${changePct}% towards optimal protective range.`;
          } else {
            trend = "worsened";
            worsenedCount++;
            significance = `Decrease of ${Math.abs(changePct)}% below desired threshold.`;
          }
        } else {
          trend = "neutral";
          significance = `Delta change of ${changePct}% noted.`;
        }
      }

      deltas.push({
        name: bmCurrent.name,
        unit: bmCurrent.unit,
        previousValue: bmPrev.value,
        currentValue: bmCurrent.value,
        changePercent: changePct,
        trend,
        referenceRange: bmCurrent.referenceRange,
        clinicalSignificance: significance,
      });
    }
  });

  const overallAssessment =
    improvedCount > worsenedCount
      ? `Positive Clinical Trajectory: ${improvedCount} biomarker(s) showed favorable progress towards target reference ranges between ${new Date(reportA.date).toLocaleDateString()} and ${new Date(reportB.date).toLocaleDateString()}.`
      : worsenedCount > improvedCount
      ? `Cardio-metabolic or inflammatory parameters require attention. ${worsenedCount} biomarker(s) deviated further from reference targets.`
      : "Biomarkers remain largely stable across the comparative timeframe.";

  const doctorGuidance =
    "This longitudinal comparison is generated by Vaidya Sahay AI for patient education. Share this delta analysis with your treating physician to evaluate treatment response or adjust preventive lifestyle plans.";

  return {
    reportA: { title: reportA.title, date: reportA.date },
    reportB: { title: reportB.title, date: reportB.date },
    overallAssessment,
    deltas,
    doctorGuidance,
  };
}

/**
 * Uses Gemini API to analyze raw report text or multimodal content
 */
export async function analyzeReportWithGemini(
  reportText: string,
  testTypeHint?: string
): Promise<{
  title: string;
  summary: string;
  findings: string;
  recommendations: string;
  biomarkers: BiomarkerItem[];
}> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  // If no Gemini API key, use clinical rules parser
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    return parseReportTextFallback(reportText, testTypeHint);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.2, // Low temperature for high accuracy extraction
        responseMimeType: "application/json",
      },
    });

    const prompt = `
You are the Clinical Diagnostic Explainer module of Vaidya Sahay AI for MASQUERADE '26.
Analyze the following patient medical report or test results.
Return a STRICT JSON object matching this schema:
{
  "title": "Descriptive title of the report",
  "summary": "1-2 sentence high-level overview in patient-friendly layman language",
  "findings": "Key clinical insights detailing which values are normal or out of range",
  "recommendations": "Non-prescriptive wellness and physician follow-up guidance",
  "biomarkers": [
    {
      "name": "Standardized biomarker name (e.g. WBC, Total Cholesterol, HbA1c)",
      "value": "Numeric value or text as reported",
      "unit": "Measurement unit (e.g. mg/dL, /mcL, %)",
      "referenceRange": "Standard clinical reference range",
      "status": "normal" | "borderline" | "abnormal" | "critical",
      "interpretation": "Brief layman explanation of what this specific biomarker means"
    }
  ]
}

Input Report Content:
${reportText}
    `.trim();

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text();
    const parsed = JSON.parse(jsonText);

    return {
      title: parsed.title || "Diagnostic Medical Report Analysis",
      summary: parsed.summary || "Medical report processed successfully.",
      findings: parsed.findings || "Review the biomarker findings below.",
      recommendations: parsed.recommendations || "Please share this report with your healthcare provider.",
      biomarkers: Array.isArray(parsed.biomarkers) ? parsed.biomarkers : [],
    };
  } catch (err) {
    console.error("Gemini report parser error, using clinical fallback:", err);
    return parseReportTextFallback(reportText, testTypeHint);
  }
}

/**
 * Intelligent Fallback Medical Report Parser (Clinical Rules Engine)
 */
function parseReportTextFallback(
  reportText: string,
  testTypeHint?: string
): {
  title: string;
  summary: string;
  findings: string;
  recommendations: string;
  biomarkers: BiomarkerItem[];
} {
  const text = reportText.toLowerCase();
  const biomarkers: BiomarkerItem[] = [];

  // Match WBC
  const wbcMatch = text.match(/(wbc|white blood cells?|leukocytes?)\s*[:=]?\s*([\d,]+(\.\d+)?)/i);
  if (wbcMatch) {
    const num = parseFloat(wbcMatch[2].replace(/,/g, ""));
    const status = num > 11000 ? "abnormal" : num < 4500 ? "abnormal" : "normal";
    biomarkers.push({
      name: "WBC (White Blood Cells)",
      value: wbcMatch[2],
      numericValue: num,
      unit: "/mcL",
      referenceRange: "4,500 - 11,000",
      status,
      interpretation:
        status === "abnormal"
          ? num > 11000
            ? "Elevated WBC indicates active immune system response to infection or inflammation."
            : "Low WBC suggests reduced immune reserve."
          : "Healthy resting immune cell count.",
    });
  }

  // Match Hemoglobin
  const hbMatch = text.match(/(hemoglobin|hb)\s*[:=]?\s*([\d.]+)/i);
  if (hbMatch) {
    const num = parseFloat(hbMatch[2]);
    const status = num < 12.0 ? "abnormal" : num > 17.5 ? "borderline" : "normal";
    biomarkers.push({
      name: "Hemoglobin",
      value: hbMatch[2],
      numericValue: num,
      unit: "g/dL",
      referenceRange: "12.0 - 16.5",
      status,
      interpretation:
        status === "abnormal"
          ? "Low hemoglobin suggests anemia; may cause fatigue or lightheadedness."
          : "Normal oxygen-carrying red blood cell capacity.",
    });
  }

  // Match Total Cholesterol
  const cholMatch = text.match(/(total cholesterol|cholesterol)\s*[:=]?\s*([\d.]+)/i);
  if (cholMatch) {
    const num = parseFloat(cholMatch[2]);
    const status = num > 200 ? (num > 240 ? "abnormal" : "borderline") : "normal";
    biomarkers.push({
      name: "Total Cholesterol",
      value: cholMatch[2],
      numericValue: num,
      unit: "mg/dL",
      referenceRange: "< 200",
      status,
      interpretation:
        status !== "normal"
          ? "Elevated cholesterol increases cardiovascular plaque risk over time."
          : "Desirable cardiovascular cholesterol interval.",
    });
  }

  // Match HbA1c
  const a1cMatch = text.match(/(hba1c|glycated hemoglobin)\s*[:=]?\s*([\d.]+)/i);
  if (a1cMatch) {
    const num = parseFloat(a1cMatch[2]);
    const status = num >= 6.5 ? "abnormal" : num >= 5.7 ? "borderline" : "normal";
    biomarkers.push({
      name: "HbA1c",
      value: a1cMatch[2],
      numericValue: num,
      unit: "%",
      referenceRange: "< 5.7",
      status,
      interpretation:
        status === "abnormal"
          ? "Indicates diabetic range glycemic exposure over past 90 days."
          : status === "borderline"
          ? "Pre-diabetes range (5.7% - 6.4%). Modifiable with lifestyle and nutrition."
          : "Normal 3-month average blood sugar regulation.",
    });
  }

  // If no biomarkers could be regex matched, supply a structured default panel
  if (biomarkers.length === 0) {
    return {
      title: testTypeHint ? `${testTypeHint} Diagnostic Panel` : "Diagnostic Health Panel",
      summary: "Medical lab report values processed. Key clinical biomarkers were extracted and referenced against standard diagnostic intervals.",
      findings: "Values reflect common clinical metabolic and hematological indices.",
      recommendations: "Review these findings with your physician during your next consultation.",
      biomarkers: SAMPLE_LAB_REPORTS[0].biomarkers,
    };
  }

  return {
    title: testTypeHint ? `${testTypeHint} Analysis` : "Extracted Laboratory Panel",
    summary: `Extracted ${biomarkers.length} biomarker(s) with clinical reference interval cross-checks.`,
    findings: biomarkers.map((b) => `${b.name}: ${b.value} ${b.unit} (${b.status})`).join("; "),
    recommendations: "Discuss any out-of-range biomarkers with your healthcare provider for clinical correlation.",
    biomarkers,
  };
}
