"use client";

import React, { useState } from "react";
import {
  X,
  Sparkles,
  FileSearch,
  Leaf,
  Brain,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Upload,
  Cpu,
  Layers,
  HeartPulse,
} from "lucide-react";

interface ProposedSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInjectPrescriptionToChat?: (text: string) => void;
}

export const ProposedSystemModal: React.FC<ProposedSystemModalProps> = ({
  isOpen,
  onClose,
  onInjectPrescriptionToChat,
}) => {
  const [activeTab, setActiveTab] = useState<"vision" | "ayush" | "mental" | "abha" | "architecture">("vision");

  // State for Lab/Prescription OCR Demo
  const [selectedSample, setSelectedSample] = useState<string>("cbc");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<{
    title: string;
    highlights: string[];
    explanation: string;
    action: string;
  } | null>(null);

  // Mental Health PHQ Screener state
  const [phqScore, setPhqScore] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleRunSampleScan = (sampleType: string) => {
    setSelectedSample(sampleType);
    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
      setIsScanning(false);
      if (sampleType === "cbc") {
        setScanResult({
          title: "Complete Blood Count (CBC) Laboratory Analysis",
          highlights: [
            "WBC (White Blood Cells): 13,200 /mcL (HIGH — Normal 4,500-11,000)",
            "Platelets: 185,000 /mcL (NORMAL — Adequate clotting reserve)",
            "Hemoglobin (Hb): 13.8 g/dL (NORMAL)",
            "Neutrophils: 78% (MILD ELEVATION — Bacterial infection response)",
          ],
          explanation:
            "The elevated White Blood Cell count and Neutrophil shift suggest your body's immune system is actively fighting an acute bacterial or inflammatory infection.",
          action:
            "Recommended follow-up: Show this report to your physician for targeted antibiotic evaluation. Avoid self-medicating.",
        });
      } else if (sampleType === "prescription") {
        setScanResult({
          title: "Doctor's Handwritten Prescription Interpretation",
          highlights: [
            "Rx 1: Tab Paracetamol 650mg — 1 tablet SOS (when fever > 100°F), max 3 times daily after food",
            "Rx 2: Tab Pantoprazole 40mg — 1 tablet daily empty stomach in morning (to protect stomach lining)",
            "Rx 3: Syp Cough Reliever 10ml — Twice daily after meals for 5 days",
          ],
          explanation:
            "Prescription aims to manage febrile symptoms while protecting gastric mucosa. Standard antipyretic dosing observed.",
          action:
            "Take Pantoprazole 30 mins before breakfast. Maintain a minimum 6-hour gap between Paracetamol doses.",
        });
      } else {
        setScanResult({
          title: "Metabolic & Blood Glucose Profile (HbA1c)",
          highlights: [
            "Fasting Plasma Glucose: 114 mg/dL (Pre-diabetic baseline)",
            "HbA1c: 6.2% (Pre-diabetes range 5.7% - 6.4%)",
            "Estimated Average Glucose (eAG): 131 mg/dL",
          ],
          explanation:
            "Your 3-month blood sugar average indicates pre-diabetes. Lifestyle and dietary interventions can effectively reverse this back to healthy levels.",
          action:
            "Adopt low glycemic index foods, 30 mins daily brisk walking, and repeat testing in 90 days.",
        });
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden border border-emerald-100">
        {/* Header Banner */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center shadow-inner">
              <Sparkles className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold tracking-tight">
                  Proposed System Architecture &amp; Novel Updates
                </h3>
                <span className="bg-emerald-400/20 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300/30">
                  MASQUERADE &apos;26 SPECIFICATION
                </span>
              </div>
              <p className="text-xs text-emerald-100/80">
                Next-generation modules differentiating Vaidya Sahay AI from legacy platforms
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 border-b border-gray-100 p-2 bg-gray-50/70 gap-1.5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("vision")}
            className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "vision"
                ? "bg-white text-emerald-800 shadow-xs font-bold border border-emerald-200/60"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FileSearch className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Lab &amp; Rx Vision</span>
          </button>

          <button
            onClick={() => setActiveTab("ayush")}
            className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "ayush"
                ? "bg-white text-emerald-800 shadow-xs font-bold border border-emerald-200/60"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            <span>AYUSH Integrative</span>
          </button>

          <button
            onClick={() => setActiveTab("mental")}
            className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "mental"
                ? "bg-white text-emerald-800 shadow-xs font-bold border border-emerald-200/60"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mental Health (Tele-MANAS)</span>
          </button>

          <button
            onClick={() => setActiveTab("abha")}
            className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "abha"
                ? "bg-white text-emerald-800 shadow-xs font-bold border border-emerald-200/60"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>ABHA Health Locker</span>
          </button>

          <button
            onClick={() => setActiveTab("architecture")}
            className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "architecture"
                ? "bg-white text-emerald-800 shadow-xs font-bold border border-emerald-200/60"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>Proposed vs Existing</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-white">
          {/* TAB 1: AI Prescription & Lab Report Vision OCR */}
          {activeTab === "vision" && (
            <div className="space-y-4">
              <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-white shadow-xs text-emerald-600 flex-shrink-0">
                  <FileSearch className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-900">
                    Proposed Innovation 1: AI Prescription &amp; Diagnostic Lab Report Decoder
                  </h4>
                  <p className="text-[11px] text-emerald-800 leading-relaxed mt-0.5">
                    Patients often leave hospitals confused by complex lab acronyms (CBC, HbA1c, SGPT) and illegible doctor handwriting. This proposed system module automatically extracts values, identifies out-of-range biomarkers, and explains them in simple, reassuring layman language.
                  </p>
                </div>
              </div>

              {/* Sample Chooser */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">
                  Select a Real Clinical Lab Report or Prescription to Test:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    onClick={() => handleRunSampleScan("cbc")}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedSample === "cbc"
                        ? "border-emerald-500 bg-emerald-50/50 shadow-xs"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-xs font-bold text-gray-800 block">🩸 CBC Blood Report</span>
                    <span className="text-[11px] text-gray-500">Infection screening (WBC 13.2k)</span>
                  </button>

                  <button
                    onClick={() => handleRunSampleScan("prescription")}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedSample === "prescription"
                        ? "border-emerald-500 bg-emerald-50/50 shadow-xs"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-xs font-bold text-gray-800 block">📝 Post-Fever Prescription</span>
                    <span className="text-[11px] text-gray-500">Paracetamol + Pantoprazole</span>
                  </button>

                  <button
                    onClick={() => handleRunSampleScan("diabetes")}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedSample === "diabetes"
                        ? "border-emerald-500 bg-emerald-50/50 shadow-xs"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-xs font-bold text-gray-800 block">📊 HbA1c Glycemic Profile</span>
                    <span className="text-[11px] text-gray-500">Pre-diabetes screening (6.2%)</span>
                  </button>
                </div>
              </div>

              {/* Scanning Simulation Canvas */}
              {isScanning ? (
                <div className="p-8 border border-dashed border-emerald-300 rounded-2xl bg-emerald-50/30 text-center space-y-3">
                  <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-xs font-bold text-emerald-800">
                    Extracting Medical Entities via Multi-Modal Vision Model...
                  </p>
                  <p className="text-[11px] text-gray-400">
                    Normalizing units, screening reference intervals, and checking contraindications
                  </p>
                </div>
              ) : scanResult ? (
                <div className="p-5 border border-emerald-200 rounded-2xl bg-white shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                    <span className="text-xs font-bold text-gray-800">
                      {scanResult.title}
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      ✓ AI Analysis Complete
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                      Extracted Findings:
                    </span>
                    {scanResult.highlights.map((hl, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-gray-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-gray-700 leading-relaxed">
                    <strong>Layman Explanation:</strong> {scanResult.explanation}
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-900">
                    <strong>Actionable Recommendation:</strong> {scanResult.action}
                  </div>

                  {onInjectPrescriptionToChat && (
                    <button
                      onClick={() => {
                        onInjectPrescriptionToChat(
                          `Here is my diagnostic lab summary: ${scanResult.title}. Findings: ${scanResult.highlights.join("; ")}. Could you guide me on next steps?`
                        );
                        onClose();
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
                    >
                      <span>Discuss this Report with Vaidya Sahay AI</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-6 border border-gray-200 rounded-2xl bg-gray-50/50 text-center">
                  <p className="text-xs text-gray-500">
                    Click any sample above to simulate instant AI medical document breakdown.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AYUSH Integrative Holistic Wellness */}
          {activeTab === "ayush" && (
            <div className="space-y-4">
              <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-white shadow-xs text-emerald-600 flex-shrink-0">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-900">
                    Proposed Innovation 2: Evidence-Grounded AYUSH &amp; Integrative Wellness
                  </h4>
                  <p className="text-[11px] text-emerald-800 leading-relaxed mt-0.5">
                    India has rich Ayurvedic and natural healing heritage, but patients often mix herbs with allopathy unsafely. Vaidya Sahay AI introduces an <em>Integrative Health Engine</em> pairing modern clinical guidelines with safe, evidence-backed home comfort remedies.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-2">
                  <h5 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <span>☕ Herbal Kadha for Acute Viral Cough</span>
                  </h5>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    Boil Tulsi leaves, crushed ginger, black pepper (Piperine), and clove. Add half a teaspoon of honey once cooled.
                  </p>
                  <div className="text-[10px] text-emerald-700 font-medium bg-emerald-50 p-2 rounded-lg">
                    ✓ <strong>Clinical Benefit:</strong> Reduces pharyngeal irritation and liquefies mucosal secretions.
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-2">
                  <h5 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <span>🥛 Golden Turmeric Milk (Haldi Doodh)</span>
                  </h5>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    Warm milk with pure turmeric (Curcumin) and a pinch of black pepper before bedtime.
                  </p>
                  <div className="text-[10px] text-emerald-700 font-medium bg-emerald-50 p-2 rounded-lg">
                    ✓ <strong>Clinical Benefit:</strong> Natural anti-inflammatory cytokine modulation and muscle relaxation.
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-2">
                  <h5 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <span>💨 Eucalyptus &amp; Mint Steam Inhalation</span>
                  </h5>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    Inhale gentle water steam infused with 2 drops of eucalyptus oil for 5-7 minutes.
                  </p>
                  <div className="text-[10px] text-emerald-700 font-medium bg-emerald-50 p-2 rounded-lg">
                    ✓ <strong>Clinical Benefit:</strong> Relieves nasal turbinate congestion without drying mucous membranes.
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
                  <h5 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <span>⚠️ Safety Cross-Check Rule</span>
                  </h5>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Herbal remedies must <strong>never</strong> replace antibiotics for bacterial strep or emergency antipyretics for fever exceeding 102°F.
                  </p>
                  <div className="text-[10px] text-amber-800 font-semibold">
                    Always inform your treating physician of any ongoing botanical supplements.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Mental Health & Tele-MANAS */}
          {activeTab === "mental" && (
            <div className="space-y-4">
              <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-white shadow-xs text-emerald-600 flex-shrink-0">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-900">
                    Proposed Innovation 3: Rapid Psychological Triage &amp; Tele-MANAS Bridge
                  </h4>
                  <p className="text-[11px] text-emerald-800 leading-relaxed mt-0.5">
                    Physical symptoms like headache and fatigue frequently stem from acute stress or anxiety. Vaidya Sahay integrates standardized PHQ-2 / GAD-2 mental health screening and links directly with India&apos;s National Tele-MANAS network.
                  </p>
                </div>
              </div>

              {/* Interactive 2-Question Screener */}
              <div className="p-4 border border-gray-200 rounded-2xl bg-white space-y-3">
                <h5 className="text-xs font-bold text-gray-800">
                  Quick Wellness &amp; Stress Self-Check (PHQ-2 Screener)
                </h5>
                <p className="text-[11px] text-gray-500">
                  Over the past 2 weeks, how often have you felt little interest or pleasure in doing things, or felt down/hopeless?
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: "Not at all", score: 0 },
                    { label: "Several days", score: 1 },
                    { label: "More than half days", score: 2 },
                    { label: "Nearly every day", score: 3 },
                  ].map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => setPhqScore(opt.score)}
                      className={`p-2.5 rounded-xl text-xs font-medium border transition-all ${
                        phqScore === opt.score
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {phqScore !== null && (
                  <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-900 space-y-1">
                    <span className="font-bold">
                      {phqScore <= 1
                        ? "Score indicates minimal psychological distress."
                        : "Score suggests moderate stress or emotional strain."}
                    </span>
                    <p className="text-[11px] text-sky-800">
                      Recommendation: Practice deep diaphragmatic breathing, ensure 7-8 hours of sound sleep, and talk with someone you trust.
                    </p>
                  </div>
                )}
              </div>

              {/* Tele-MANAS Hotline Card */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/80 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h5 className="text-xs font-bold text-emerald-900">
                    India&apos;s National Mental Health Helpline (Tele-MANAS)
                  </h5>
                  <p className="text-[11px] text-emerald-800">
                    Free, confidential 24x7 psychological counselling support in 20+ regional languages.
                  </p>
                </div>
                <a
                  href="tel:14416"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-xs transition-colors"
                >
                  Dial 14416 (Toll-Free)
                </a>
              </div>
            </div>
          )}

          {/* TAB 4: ABHA (Ayushman Bharat) Digital Health Locker */}
          {activeTab === "abha" && (
            <div className="space-y-4">
              <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-white shadow-xs text-emerald-600 flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-900">
                    Proposed Innovation 4: Ayushman Bharat Digital Mission (ABDM / ABHA) Linkage
                  </h4>
                  <p className="text-[11px] text-emerald-800 leading-relaxed mt-0.5">
                    Aligning with India&apos;s National Health Authority (NHA) ecosystem. Vaidya Sahay AI is engineered to export consultations directly into <strong>FHIR-compliant</strong> (Fast Healthcare Interoperability Resources) digital health lockers linked with a 14-digit ABHA ID.
                  </p>
                </div>
              </div>

              {/* Mock ABHA ID Card */}
              <div className="max-w-md mx-auto p-5 rounded-2xl bg-gradient-to-br from-emerald-800 to-teal-900 text-white shadow-lg space-y-4">
                <div className="flex items-center justify-between border-b border-white/20 pb-2.5">
                  <div className="flex items-center gap-2">
                    <HeartPulse className="w-5 h-5 text-emerald-300" />
                    <span className="font-bold text-xs tracking-wider">AYUSHMAN BHARAT DIGITAL HEALTH</span>
                  </div>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md font-semibold">FHIR v4.0</span>
                </div>

                <div>
                  <span className="text-[10px] text-emerald-200 block">ABHA Number (Digital Health ID)</span>
                  <div className="text-xl font-mono font-bold tracking-widest mt-0.5">
                    91-4528-9012-7364
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs border-t border-white/10 pt-2 text-emerald-100">
                  <div>
                    <span className="text-[10px] text-emerald-300 block">Health Records Linked</span>
                    <span className="font-semibold">3 Active Consultations</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-300 block">Consent Manager</span>
                    <span className="font-semibold">Patient-Controlled</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-gray-700 leading-relaxed">
                <strong>Why this is unique:</strong> Rather than trapping patient health data in a closed corporate silo (like Apollo or Practo), Vaidya Sahay AI operates on open, interoperable national health protocols.
              </div>
            </div>
          )}

          {/* TAB 5: Architectural Comparison */}
          {activeTab === "architecture" && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Existing Architecture vs. Proposed Vaidya Sahay AI Architecture
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-gray-200 rounded-xl overflow-hidden">
                  <thead className="bg-gray-100 text-gray-700 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3 border-b">Evaluation Parameter</th>
                      <th className="p-3 border-b text-gray-500">Legacy Systems (Apollo / Practo)</th>
                      <th className="p-3 border-b text-emerald-700 bg-emerald-50">Proposed Vaidya Sahay AI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="p-3 font-semibold text-gray-800">Conversational Engine</td>
                      <td className="p-3 text-gray-500">Static rule-based decision trees</td>
                      <td className="p-3 font-semibold text-emerald-800 bg-emerald-50/50">Gemini 1.5 Multi-turn Context Memory</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-gray-800">Clinical Handoff</td>
                      <td className="p-3 text-gray-500">None (Patient must re-explain)</td>
                      <td className="p-3 font-semibold text-emerald-800 bg-emerald-50/50">1-Click SBAR Doctor Intake Summary</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-gray-800">Drug Conflict Detection</td>
                      <td className="p-3 text-gray-500">Not supported (commercial sales only)</td>
                      <td className="p-3 font-semibold text-emerald-800 bg-emerald-50/50">Real-time Pharmacological Overdose Checker</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-gray-800">Regional Vernacular</td>
                      <td className="p-3 text-gray-500">Primarily English with limited UI</td>
                      <td className="p-3 font-semibold text-emerald-800 bg-emerald-50/50">Native Voice &amp; Text (Hindi, Telugu, English)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-gray-800">Offline Reliability</td>
                      <td className="p-3 text-gray-500">Fails on server/network drop</td>
                      <td className="p-3 font-semibold text-emerald-800 bg-emerald-50/50">Dual-Engine Fallback (Zero Downtime)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
          <span>Engineered for MASQUERADE &apos;26 AI Chatbot Competition</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-semibold text-white transition-colors"
          >
            Close Showcase
          </button>
        </div>
      </div>
    </div>
  );
};
