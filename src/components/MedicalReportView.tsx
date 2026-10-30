"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Upload,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  AlertTriangle,
  GitCompare,
  Sparkles,
  Calendar,
  Layers,
  Search,
} from "lucide-react";
import { MedicalReportData, BiomarkerItem, ReportComparisonResult, FamilyProfile } from "@/lib/types";

interface MedicalReportViewProps {
  activeProfile: FamilyProfile | null;
  onDiscussInChat: (text: string) => void;
}

export const MedicalReportView: React.FC<MedicalReportViewProps> = ({
  activeProfile,
  onDiscussInChat,
}) => {
  const [activeTab, setActiveTab] = useState<"analyze" | "compare" | "saved">("analyze");
  const [inputText, setInputText] = useState("");
  const [testType, setTestType] = useState<string>("CBC");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<{
    title: string;
    summary: string;
    findings: string;
    recommendations: string;
    biomarkers: BiomarkerItem[];
  } | null>(null);

  // Comparison State
  const [sampleReports, setSampleReports] = useState<MedicalReportData[]>([]);
  const [savedReports, setSavedReports] = useState<MedicalReportData[]>([]);
  const [selectedReportAId, setSelectedReportAId] = useState<string>("");
  const [selectedReportBId, setSelectedReportBId] = useState<string>("");
  const [comparisonResult, setComparisonResult] = useState<ReportComparisonResult | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  // Fetch reports on mount
  useEffect(() => {
    fetchReports();
  }, [activeProfile]);

  const fetchReports = async () => {
    try {
      const url = activeProfile?.id ? `/api/reports?profileId=${activeProfile.id}` : "/api/reports";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setSavedReports(data.savedReports || []);
        if (data.sampleReports) {
          setSampleReports(data.sampleReports);
          if (data.sampleReports.length >= 2) {
            setSelectedReportAId(data.sampleReports[1].id);
            setSelectedReportBId(data.sampleReports[0].id);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  const handleRunAnalysis = async (customText?: string, type?: string) => {
    const textToAnalyze = customText || inputText;
    if (!textToAnalyze.trim()) return;

    try {
      setIsAnalyzing(true);
      const res = await fetch("/api/reports/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportText: textToAnalyze,
          testType: type || testType,
          profileId: activeProfile?.id,
          saveToDatabase: true,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentAnalysis(data.analysis);
        fetchReports();
      }
    } catch (err) {
      console.error("Analysis failed:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRunComparison = async () => {
    const allReports = [...sampleReports, ...savedReports];
    const repA = allReports.find((r) => r.id === selectedReportAId);
    const repB = allReports.find((r) => r.id === selectedReportBId);

    if (!repA || !repB) return;

    try {
      setIsComparing(true);
      const res = await fetch("/api/reports/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportA: { title: repA.title, date: repA.testDate, biomarkers: repA.biomarkers },
          reportB: { title: repB.title, date: repB.testDate, biomarkers: repB.biomarkers },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setComparisonResult(data.comparison);
      }
    } catch (err) {
      console.error("Comparison error:", err);
    } finally {
      setIsComparing(false);
    }
  };

  // Helper for status badge
  const renderStatusBadge = (status: BiomarkerItem["status"]) => {
    switch (status) {
      case "normal":
        return (
          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
            Normal
          </span>
        );
      case "borderline":
        return (
          <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
            Borderline
          </span>
        );
      case "abnormal":
        return (
          <span className="bg-orange-50 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-orange-200">
            Attention Needed
          </span>
        );
      case "critical":
        return (
          <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200">
            Critical Red-Flag
          </span>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white lg:rounded-2xl border border-gray-100/90 shadow-xs overflow-hidden">
      {/* View Header */}
      <header className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-white z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-gray-800">
                AI Medical Report Explainer &amp; Comparison
              </h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                SIGNATURE ENGINE
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Biomarker extraction, clinical reference intervals, and longitudinal progress tracking
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("analyze")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === "analyze" ? "bg-white text-emerald-800 shadow-xs font-bold" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Analyze Report</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("compare");
              if (!comparisonResult) handleRunComparison();
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === "compare" ? "bg-white text-emerald-800 shadow-xs font-bold" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Compare 2 Reports</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeTab === "analyze" ? (
          <div className="space-y-6 max-w-5xl mx-auto">
            {/* Quick Sample Selector */}
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 space-y-2.5">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Quick Clinical Samples (Click to analyze instantly):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  onClick={() =>
                    handleRunAnalysis(
                      "PATIENT REPORT: Complete Blood Count\nWBC: 13,200 /mcL\nNeutrophils: 78%\nHemoglobin: 13.8 g/dL\nPlatelets: 195,000 /mcL",
                      "CBC"
                    )
                  }
                  className="bg-white hover:bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-2.5 text-left text-xs transition-all shadow-xs"
                >
                  <span className="font-bold text-gray-800 block">🩸 Acute Infection (CBC)</span>
                  <span className="text-[11px] text-gray-500">WBC 13.2k, Neutrophils 78%</span>
                </button>

                <button
                  onClick={() =>
                    handleRunAnalysis(
                      "LIPID PROFILE REPORT:\nTotal Cholesterol: 235 mg/dL\nLDL: 148 mg/dL\nHDL: 42 mg/dL\nTriglycerides: 192 mg/dL",
                      "Lipid Profile"
                    )
                  }
                  className="bg-white hover:bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-2.5 text-left text-xs transition-all shadow-xs"
                >
                  <span className="font-bold text-gray-800 block">🫀 High Lipid Panel</span>
                  <span className="text-[11px] text-gray-500">Cholesterol 235, LDL 148</span>
                </button>

                <button
                  onClick={() =>
                    handleRunAnalysis(
                      "GLYCEMIC LAB RESULTS:\nHbA1c: 6.2%\nFasting Plasma Glucose: 114 mg/dL\nPost-Prandial Glucose: 152 mg/dL",
                      "Diabetes / HbA1c"
                    )
                  }
                  className="bg-white hover:bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-2.5 text-left text-xs transition-all shadow-xs"
                >
                  <span className="font-bold text-gray-800 block">📊 Pre-Diabetes HbA1c</span>
                  <span className="text-[11px] text-gray-500">HbA1c 6.2%, Glucose 114</span>
                </button>
              </div>
            </div>

            {/* Custom Input / Paste Form */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs font-bold text-gray-800">
                  Or Paste Diagnostic Report Text / Lab Findings:
                </label>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-400">Panel Type:</span>
                  <select
                    value={testType}
                    onChange={(e) => setTestType(e.target.value)}
                    className="border border-gray-200 rounded-lg px-2.5 py-1 text-xs bg-white text-gray-800"
                  >
                    <option value="CBC">Complete Blood Count (CBC)</option>
                    <option value="Lipid Profile">Lipid Profile</option>
                    <option value="Diabetes / HbA1c">Diabetes / HbA1c</option>
                    <option value="Thyroid">Thyroid Panel</option>
                    <option value="General">Other / General</option>
                  </select>
                </div>
              </div>

              <textarea
                rows={4}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste lab parameters, e.g.:&#10;Total Cholesterol: 210 mg/dL&#10;Fasting Blood Sugar: 105 mg/dL&#10;Platelets: 220,000 /mcL..."
                className="w-full border border-gray-200 rounded-xl p-3 text-xs text-gray-800 focus:outline-emerald-600 font-mono"
              />

              <div className="flex justify-end">
                <button
                  onClick={() => handleRunAnalysis()}
                  disabled={isAnalyzing || !inputText.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-semibold text-xs py-2 px-4 rounded-xl flex items-center gap-2 shadow-xs transition-all"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Analyzing with Gemini...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Extract &amp; Explain Biomarkers</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Analysis Output Section */}
            {currentAnalysis && (
              <div className="bg-white border border-emerald-200 rounded-2xl p-6 shadow-xs space-y-5 animate-in fade-in duration-200">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{currentAnalysis.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{currentAnalysis.summary}</p>
                  </div>
                  <button
                    onClick={() =>
                      onDiscussInChat(
                        `I have a question about my ${currentAnalysis.title}: ${currentAnalysis.summary}. The findings are: ${currentAnalysis.findings}. What should I keep in mind?`
                      )
                    }
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/70 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>Discuss in AI Chat</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Biomarkers Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border border-gray-100 rounded-xl overflow-hidden">
                    <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Biomarker</th>
                        <th className="p-3">Measured Value</th>
                        <th className="p-3">Reference Interval</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Clinical Layman Meaning</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {currentAnalysis.biomarkers.map((bm, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                          <td className="p-3 font-bold text-gray-800">{bm.name}</td>
                          <td className="p-3 font-semibold text-gray-900">
                            {bm.value} <span className="text-gray-500 text-[10px]">{bm.unit}</span>
                          </td>
                          <td className="p-3 text-gray-500">{bm.referenceRange}</td>
                          <td className="p-3">{renderStatusBadge(bm.status)}</td>
                          <td className="p-3 text-gray-600 max-w-xs">{bm.interpretation || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Recommendations Banner */}
                <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-100 text-xs text-emerald-950 space-y-1">
                  <span className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    Care &amp; Follow-up Recommendations:
                  </span>
                  <p className="text-[11px] text-emerald-900 leading-relaxed">
                    {currentAnalysis.recommendations}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* COMPARISON TAB */
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-white shadow-xs text-emerald-700 flex items-center justify-center flex-shrink-0">
                <GitCompare className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-900">
                  Longitudinal Health Report Comparison Engine
                </h4>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Select two diagnostic reports from different dates to visualize how your biomarkers have evolved.
                  Calculates exact percentage changes, evaluates positive vs negative trends, and synthesizes clinical guidance.
                </p>
              </div>
            </div>

            {/* Select Reports to Compare */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-2 shadow-xs">
                <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  Report A (Baseline / Older)
                </span>
                <select
                  value={selectedReportAId}
                  onChange={(e) => setSelectedReportAId(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-2 text-xs bg-white text-gray-800"
                >
                  {[...sampleReports, ...savedReports].map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({new Date(r.testDate).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-2 shadow-xs">
                <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  Report B (Recent / Follow-up)
                </span>
                <select
                  value={selectedReportBId}
                  onChange={(e) => setSelectedReportBId(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-2 text-xs bg-white text-gray-800"
                >
                  {[...sampleReports, ...savedReports].map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({new Date(r.testDate).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleRunComparison}
                disabled={isComparing || selectedReportAId === selectedReportBId}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-semibold text-xs py-2 px-6 rounded-xl flex items-center gap-2 shadow-xs transition-all"
              >
                {isComparing ? "Computing Deltas..." : "Run Longitudinal Delta Comparison"}
              </button>
            </div>

            {/* Comparison Results Canvas */}
            {comparisonResult && (
              <div className="bg-white border border-emerald-200 rounded-2xl p-6 shadow-xs space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-gray-100 pb-3">
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Comparative Delta Trajectory
                  </span>
                  <h3 className="text-sm font-bold text-gray-900 mt-2">
                    {comparisonResult.reportA.title} ➔ {comparisonResult.reportB.title}
                  </h3>
                  <p className="text-xs text-emerald-800 font-medium mt-1">
                    {comparisonResult.overallAssessment}
                  </p>
                </div>

                {/* Delta Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border border-gray-100 rounded-xl overflow-hidden">
                    <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Biomarker</th>
                        <th className="p-3">Previous</th>
                        <th className="p-3">Current</th>
                        <th className="p-3">Delta Change</th>
                        <th className="p-3">Trend</th>
                        <th className="p-3">Clinical Significance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {comparisonResult.deltas.map((d, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                          <td className="p-3 font-bold text-gray-800">{d.name}</td>
                          <td className="p-3 text-gray-500 font-medium">
                            {d.previousValue} {d.unit}
                          </td>
                          <td className="p-3 text-gray-900 font-bold">
                            {d.currentValue} {d.unit}
                          </td>
                          <td className="p-3 font-semibold">
                            {d.changePercent !== undefined ? (
                              <span
                                className={
                                  d.changePercent > 0
                                    ? "text-blue-600"
                                    : d.changePercent < 0
                                    ? "text-purple-600"
                                    : "text-gray-500"
                                }
                              >
                                {d.changePercent > 0 ? `+${d.changePercent}%` : `${d.changePercent}%`}
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="p-3">
                            {d.trend === "improved" ? (
                              <span className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full w-fit">
                                <TrendingUp className="w-3.5 h-3.5" /> Improved
                              </span>
                            ) : d.trend === "worsened" ? (
                              <span className="flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full w-fit">
                                <TrendingDown className="w-3.5 h-3.5" /> Attention
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-gray-600 font-bold bg-gray-100 px-2 py-0.5 rounded-full w-fit">
                                <Minus className="w-3.5 h-3.5" /> Stable
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-gray-600 max-w-xs">{d.clinicalSignificance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-gray-700 leading-relaxed">
                  <strong>Doctor Collaboration Note:</strong> {comparisonResult.doctorGuidance}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
