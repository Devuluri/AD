"use client";

import React from "react";
import { X, Award, ShieldAlert, Cpu, Heart, CheckCircle2 } from "lucide-react";
import { BrandLogoIcon } from "./Icons";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-2.5">
            <BrandLogoIcon className="w-8 h-8" />
            <div>
              <h3 className="text-base font-bold text-gray-800">
                About Vaidya Sahay AI
              </h3>
              <p className="text-xs text-emerald-700 font-semibold">
                MASQUERADE &apos;26 AI Chatbot Competition Entry
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-gray-600 leading-relaxed">
          {/* Mission */}
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
            <h4 className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1 text-sm">
              <Heart className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              Our Mission
            </h4>
            <p>
              <strong>Vaidya Sahay AI (वैद्य सहाय)</strong> is designed to bridge the healthcare information gap. By combining compassionate conversational AI with strict medical safety guardrails, it provides patients with immediate, trustworthy symptom triage, wellness tips, and emergency escalation guidance.
            </p>
          </div>

          {/* Key Capabilities */}
          <div>
            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Engineered Capabilities
            </h4>
            <ul className="space-y-1.5 pl-1">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span><strong>Multi-Turn Contextual Memory:</strong> Remembers prior symptoms, timeframes, and references like &quot;it&quot;, &quot;that&quot;, or &quot;since yesterday&quot;.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span><strong>Empathetic Clinical Triage:</strong> Asks structured clarification questions (temperature, duration, pain location, red-flags).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span><strong>Emergency Red-Flag Detection:</strong> Detects acute chest pain, stroke signs, respiratory failure, and prompts immediate 112/108 calling.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span><strong>Voice & Speech Enabled:</strong> Hands-free voice recognition input and read-aloud text-to-speech for accessible patient care.</span>
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-emerald-600" />
              Technology Stack
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {[
                "Next.js 14",
                "TypeScript",
                "Tailwind CSS",
                "Google Gemini API",
                "Prisma ORM",
                "SQLite",
                "Web Speech API",
              ].map((tech, idx) => (
                <span
                  key={idx}
                  className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg font-medium text-[11px]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Medical Safety & Compliance */}
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80">
            <h4 className="font-bold text-amber-900 flex items-center gap-1.5 mb-1 text-xs">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Clinical Safety Notice
            </h4>
            <p className="text-[11px] text-amber-950">
              Vaidya Sahay AI is an educational and triage guidance system and does NOT replace the diagnostic judgment of a licensed medical practitioner. In any medical emergency, please visit the nearest hospital or contact emergency services immediately.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1 font-medium">
            <Award className="w-4 h-4 text-emerald-600" />
            MASQUERADE &apos;26 Submission
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-gray-200 hover:bg-gray-300 font-medium text-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
