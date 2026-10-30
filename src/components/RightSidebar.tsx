"use client";

import React from "react";
import { Lightbulb, Info, PhoneCall, ChevronRight, History, Sparkles, FileText } from "lucide-react";

interface RightSidebarProps {
  onSelectQuestion: (question: string) => void;
  onOpenHospitalModal: () => void;
  onOpenAskHistory?: () => void;
  onOpenReports?: () => void;
  className?: string;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  onSelectQuestion,
  onOpenHospitalModal,
  onOpenAskHistory,
  onOpenReports,
  className = "",
}) => {
  const suggestedQuestions = [
    { label: "I have a fever", emoji: "🤒", text: "I have a fever" },
    { label: "I have a cough", emoji: "😷", text: "I have a cough" },
    { label: "I have a headache", emoji: "🤕", text: "I have a headache" },
    { label: "Medicine information", emoji: "💊", text: "Can you provide general guidance on over-the-counter medicine safety?" },
    { label: "Find a hospital", emoji: "🏥", action: "modal" },
  ];

  return (
    <aside className={`w-80 flex flex-col space-y-3.5 p-5 overflow-y-auto ${className}`}>
      {/* Ask Past Health Conversations Card (Novel Feature) */}
      {onOpenAskHistory && (
        <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-2xl p-3.5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
              Memory Intelligence
            </span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
          </div>
          <div>
            <h3 className="text-xs font-bold leading-tight">
              Ask Your Past Health Records
            </h3>
            <p className="text-[11px] text-emerald-100/90 mt-0.5">
              &ldquo;What did I report about my fever?&rdquo;
            </p>
          </div>
          <button
            onClick={onOpenAskHistory}
            className="w-full bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-bold py-1.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs"
          >
            <History className="w-3.5 h-3.5" />
            <span>Search Past Consultations</span>
          </button>
        </div>
      )}

      {/* Suggested Questions Card */}
      <div className="bg-white border border-gray-100/90 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-500" />
          <h2 className="text-xs font-bold text-gray-800 tracking-wide">
            Suggested Questions
          </h2>
        </div>

        <div className="space-y-2">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (q.action === "modal") {
                  onOpenHospitalModal();
                } else if (q.text) {
                  onSelectQuestion(q.text);
                }
              }}
              className="w-full bg-white hover:bg-emerald-50/60 border border-gray-200/70 hover:border-emerald-300 rounded-xl px-3 py-2.5 text-xs text-gray-700 font-medium transition-all flex items-center justify-between text-left group shadow-xs active:scale-[0.99]"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base leading-none">{q.emoji}</span>
                <span className="group-hover:text-emerald-800">{q.label}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
            </button>
          ))}
        </div>
      </div>

      {/* Important Note Card */}
      <div className="bg-sky-50/60 border border-sky-100 rounded-2xl p-4">
        <div className="flex items-center gap-2 text-sky-800 mb-1.5">
          <Info className="w-4 h-4 text-sky-600 flex-shrink-0" />
          <h3 className="text-xs font-bold">Important Note</h3>
        </div>
        <p className="text-[11px] text-gray-600 leading-relaxed">
          I provide general health information and guidance only. I am not a replacement for professional medical advice, diagnosis or treatment.
        </p>
      </div>

      {/* Need Help Now Card */}
      <div className="bg-[#e8f5e9]/50 border border-emerald-100/80 rounded-2xl p-4 flex flex-col space-y-2">
        <div className="flex items-center gap-2 text-emerald-800">
          <PhoneCall className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-bold">Need Help Now?</h3>
        </div>
        <p className="text-[11px] text-gray-600">
          Talk to a healthcare professional
        </p>
        <button
          onClick={onOpenHospitalModal}
          className="w-full mt-1 border border-emerald-600 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-xl py-2 px-3 text-xs font-semibold transition-all text-center"
        >
          Find Hospitals Near You
        </button>
      </div>
    </aside>
  );
};
