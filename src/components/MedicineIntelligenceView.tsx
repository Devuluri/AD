"use client";

import React, { useState, useEffect } from "react";
import {
  Pill,
  Search,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Info,
} from "lucide-react";
import { MedicineInfo } from "@/lib/types";

interface MedicineIntelligenceViewProps {
  onAskInChat: (text: string) => void;
}

export const MedicineIntelligenceView: React.FC<MedicineIntelligenceViewProps> = ({
  onAskInChat,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [medicines, setMedicines] = useState<MedicineInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMed, setSelectedMed] = useState<MedicineInfo | null>(null);

  useEffect(() => {
    fetchMedicines();
  }, [searchTerm]);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const url = searchTerm ? `/api/medicines?q=${encodeURIComponent(searchTerm)}` : "/api/medicines";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setMedicines(data.medicines || []);
        if (data.medicines && data.medicines.length > 0 && !selectedMed) {
          setSelectedMed(data.medicines[0]);
        }
      }
    } catch (err) {
      console.error("Error loading medicines:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white lg:rounded-2xl border border-gray-100/90 shadow-xs overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-white z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center justify-center">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-gray-800">
                Medicine Intelligence &amp; Pharmacological Safety
              </h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                DRUG SAFETY RADAR
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Verified clinical indications, contraindications, food interactions, and overdose boundaries
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by brand or generic name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-gray-800 focus:outline-emerald-600"
          />
        </div>
      </header>

      {/* Main Grid: Left List + Right Detail Canvas */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left List */}
        <div className="w-full md:w-80 border-r border-gray-100 overflow-y-auto p-4 space-y-2 bg-gray-50/40">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
            Clinical Catalog ({medicines.length})
          </span>

          {loading ? (
            <div className="text-center py-8 text-xs text-gray-400">Loading medicines...</div>
          ) : medicines.length === 0 ? (
            <div className="text-center py-8 text-xs text-gray-400">No matching medicines found.</div>
          ) : (
            medicines.map((med) => {
              const isSelected = selectedMed?.id === med.id;
              return (
                <button
                  key={med.id}
                  onClick={() => setSelectedMed(med)}
                  className={`w-full p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-white border-emerald-500 shadow-xs ring-1 ring-emerald-500"
                      : "bg-white/80 border-gray-200/80 hover:bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-xs font-bold text-gray-900 leading-tight">
                      {med.brandName}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                        med.isPrescriptionOnly ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {med.isPrescriptionOnly ? "Rx" : "OTC"}
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium block mt-0.5">
                    {med.genericName}
                  </span>
                  <span className="text-[10px] text-gray-400 line-clamp-1 mt-1">
                    {med.drugClass}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Right Detail View */}
        <div className="flex-1 overflow-y-auto p-6 bg-white space-y-5">
          {selectedMed ? (
            <div className="space-y-5 max-w-4xl">
              {/* Title & Classification Banner */}
              <div className="border-b border-gray-100 pb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-900">{selectedMed.brandName}</h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        selectedMed.isPrescriptionOnly
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      }`}
                    >
                      {selectedMed.isPrescriptionOnly ? "Prescription Only (Rx)" : "Available Over-The-Counter"}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                    Generic: {selectedMed.genericName} • Class: {selectedMed.drugClass}
                  </p>
                </div>

                <button
                  onClick={() =>
                    onAskInChat(
                      `I want to know more about ${selectedMed.brandName} (${selectedMed.genericName}). What are the key safety precautions and dosage rules?`
                    )
                  }
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 px-3.5 rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <span>Ask AI About This Medicine</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Purpose & How to Take */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-gray-100 bg-slate-50/60 space-y-1.5">
                  <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-emerald-600" />
                    Primary Medical Purpose
                  </span>
                  <p className="text-xs text-gray-600 leading-relaxed">{selectedMed.purpose}</p>
                </div>

                <div className="p-4 rounded-xl border border-gray-100 bg-slate-50/60 space-y-1.5">
                  <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Standard Usage &amp; Administration
                  </span>
                  <p className="text-xs text-gray-600 leading-relaxed">{selectedMed.howToTake}</p>
                  <p className="text-[11px] text-gray-400 font-medium pt-1">
                    Typical Dosage: {selectedMed.commonDosage}
                  </p>
                </div>
              </div>

              {/* Critical Warnings Card */}
              <div className="p-4 rounded-xl border border-red-200 bg-red-50/60 space-y-2">
                <span className="text-xs font-bold text-red-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  Critical Pharmacological Warnings &amp; Overdose Precautions
                </span>
                <ul className="space-y-1 text-xs text-red-950">
                  {selectedMed.criticalWarnings.map((w, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="font-bold">•</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Food & Drug Interactions + Side Effects */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/50 space-y-2">
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                    Food &amp; Substance Interactions
                  </span>
                  <ul className="space-y-1 text-xs text-amber-950">
                    {selectedMed.foodInteractions.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="font-bold">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/60 space-y-2">
                  <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-gray-500" />
                    Common Side Effects
                  </span>
                  <ul className="space-y-1 text-xs text-gray-700">
                    {selectedMed.commonSideEffects.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Missed Dose Guidance */}
              <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/40 text-xs text-emerald-950">
                <strong>Missed Dose Advice:</strong> {selectedMed.missedDoseGuidance}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400 text-xs">
              Select a medicine from the left catalog to inspect pharmacological intelligence.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
