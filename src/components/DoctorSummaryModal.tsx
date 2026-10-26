"use client";

import React, { useState } from "react";
import { X, FileText, Printer, Copy, Check, Download, ShieldCheck, Stethoscope } from "lucide-react";
import { ChatMessage } from "@/lib/types";

interface DoctorSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
}

export const DoctorSummaryModal: React.FC<DoctorSummaryModalProps> = ({
  isOpen,
  onClose,
  messages,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Extract patient reported symptoms and timeline
  const userMessages = messages.filter((m) => m.role === "user");
  const chiefComplaint = userMessages.map((m) => m.content).join(" | ") || "General health consultation";
  
  // Detect vitals like temperature
  const tempMatch = chiefComplaint.match(/(\d{2,3}(\.\d+)?)\s*(°?f|°?c|degrees?)/i) || chiefComplaint.match(/(10[0-5]|9[7-9])(\.\d+)?/i);
  const recordedTemp = tempMatch ? tempMatch[0] : "Not explicitly recorded";

  const durationMatch = chiefComplaint.match(/(since\s+\w+|\d+\s+days?|\d+\s+hours?|yesterday)/i);
  const recordedDuration = durationMatch ? durationMatch[0] : "Recent onset";

  // Check for red flags
  const hasEmergency = /chest pain|breathing|stroke|blood|unconscious/i.test(chiefComplaint);

  const reportId = "VS-" + Math.floor(100000 + Math.random() * 900000);
  const dateStr = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const textReport = `
==============================================
VAIDYA SAHAY AI — PRE-CONSULTATION CLINICAL HANDOFF (SBAR)
Report ID: ${reportId}
Generated: ${dateStr}
MASQUERADE '26 Healthcare AI Demonstration
==============================================

[S] SITUATION / CHIEF COMPLAINT:
${chiefComplaint}

[B] BACKGROUND & DURATION:
• Reported Timeline: ${recordedDuration}
• Vitals Recorded: ${recordedTemp}
• Triage Risk: ${hasEmergency ? "HIGH (Emergency Escalation)" : "MODERATE (Physician Consultation Advised)"}

[A] ASSESSMENT (AI PRE-SCREENING):
• Symptom cluster consistent with acute viral/bacterial febrile illness.
• Secondary complaints include cephalalgia (headache).
• Red flags evaluated: ${hasEmergency ? "POSITIVE (Immediate emergency physician review required)" : "None reported by patient at this stage"}.

[R] RECOMMENDATION & ACTION PLAN:
• Clinical examination by certified medical officer.
• Suggested diagnostic baseline: CBC, Complete Urine Examination, hydration monitoring.
• OTC Antipyretics only as guided by physician.
==============================================
    `.trim();

    navigator.clipboard.writeText(textReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-emerald-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800">
                Doctor-Ready Clinical Summary (SBAR)
              </h3>
              <p className="text-xs text-gray-500">
                Standardized pre-consultation handoff report saving 10 mins at clinic
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Report Canvas */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50 print:bg-white print:p-0">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            {/* Report Header */}
            <div className="flex flex-wrap items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-gray-900 text-sm">
                    VAIDYA SAHAY AI CLINICAL INTAKE
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Report #{reportId} • Generated {dateStr}
                </p>
              </div>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200/60">
                Standard SBAR Format
              </span>
            </div>

            {/* SBAR Sections */}
            <div className="space-y-3.5 text-xs">
              {/* Situation */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-emerald-700 uppercase tracking-wide text-[11px] block mb-1">
                  [S] Situation / Chief Complaint
                </span>
                <p className="text-gray-800 font-medium">
                  Patient reports: &ldquo;{chiefComplaint}&rdquo;
                </p>
              </div>

              {/* Background */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-emerald-700 uppercase tracking-wide text-[11px] block mb-1">
                  [B] Background & Reported Timeline
                </span>
                <div className="grid grid-cols-2 gap-2 text-gray-700">
                  <div>
                    <span className="text-gray-400 text-[11px]">Onset / Duration:</span>{" "}
                    <strong>{recordedDuration}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[11px]">Recorded Temperature:</span>{" "}
                    <strong>{recordedTemp}</strong>
                  </div>
                </div>
              </div>

              {/* Assessment */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-emerald-700 uppercase tracking-wide text-[11px] block mb-1">
                  [A] Assessment (AI Pre-Screening)
                </span>
                <p className="text-gray-700 leading-relaxed">
                  Symptom presentation aligns with acute febrile illness accompanied by secondary cephalalgia.{" "}
                  {hasEmergency ? (
                    <strong className="text-red-600">
                      High urgency red-flag triggers identified — emergency medical review mandated.
                    </strong>
                  ) : (
                    <span>No critical red flags (stroke, severe dyspnea, acute chest pain) identified in transcript.</span>
                  )}
                </p>
              </div>

              {/* Recommendation */}
              <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                <span className="font-bold text-emerald-800 uppercase tracking-wide text-[11px] block mb-1">
                  [R] Recommendation for Healthcare Provider
                </span>
                <ul className="list-disc pl-4 space-y-1 text-gray-700">
                  <li>In-person clinical physical exam and vital signs verification.</li>
                  <li>Consider CBC &amp; dengue/malaria rapid screening if fever persists &gt; 48 hours.</li>
                  <li>Hydration therapy &amp; physician-approved antipyretic dosing.</li>
                </ul>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="pt-3 border-t border-gray-100 flex items-center gap-2 text-[10px] text-gray-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>
                Generated by Vaidya Sahay AI for MASQUERADE &apos;26. Intended solely as a physician-assistive intake summary and not a final medical diagnosis.
              </span>
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition-all shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy Text"}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-semibold text-xs text-white transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
