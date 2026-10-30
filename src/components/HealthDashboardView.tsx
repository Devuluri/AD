"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  Heart,
  Droplets,
  Thermometer,
  Wind,
  Scale,
  Plus,
  ShieldCheck,
  AlertCircle,
  TrendingUp,
  Moon,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { VitalRecordData, FamilyProfile } from "@/lib/types";

interface HealthDashboardViewProps {
  activeProfile: FamilyProfile | null;
  onAskAboutVitals: (text: string) => void;
}

export const HealthDashboardView: React.FC<HealthDashboardViewProps> = ({
  activeProfile,
  onAskAboutVitals,
}) => {
  const [vitals, setVitals] = useState<VitalRecordData[]>([]);
  const [loading, setLoading] = useState(false);

  // Quick vital entry form
  const [isLogging, setIsLogging] = useState(false);
  const [vitalType, setVitalType] = useState<VitalRecordData["type"]>("blood_pressure");
  const [vitalValue, setVitalValue] = useState("");
  const [vitalUnit, setVitalUnit] = useState("mmHg");
  const [vitalNotes, setVitalNotes] = useState("");

  // Habit Tracker states
  const [waterGlasses, setWaterGlasses] = useState(6);
  const [sleepHours, setSleepHours] = useState(7.5);
  const [activeMins, setActiveMins] = useState(35);

  useEffect(() => {
    fetchVitals();
  }, [activeProfile]);

  const fetchVitals = async () => {
    try {
      setLoading(true);
      const url = activeProfile?.id ? `/api/vitals?profileId=${activeProfile.id}` : "/api/vitals";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setVitals(data.vitals || []);
      }
    } catch (err) {
      console.error("Error fetching vitals:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogVital = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vitalValue.trim()) return;

    try {
      const res = await fetch("/api/vitals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: activeProfile?.id,
          type: vitalType,
          value: vitalValue.trim(),
          unit: vitalUnit,
          notes: vitalNotes.trim() || undefined,
        }),
      });

      if (res.ok) {
        setIsLogging(false);
        setVitalValue("");
        setVitalNotes("");
        fetchVitals();
      }
    } catch (err) {
      console.error("Error logging vital:", err);
    }
  };

  // Helper to extract most recent measurement by type
  const getLatestVital = (type: VitalRecordData["type"], defaultVal: string, defaultUnit: string) => {
    const found = vitals.find((v) => v.type === type);
    if (found) {
      return {
        value: found.value,
        unit: found.unit,
        status: found.status,
        date: new Date(found.recordedAt).toLocaleDateString([], { month: "short", day: "numeric" }),
      };
    }
    return {
      value: defaultVal,
      unit: defaultUnit,
      status: "normal" as const,
      date: "Baseline",
    };
  };

  const bp = getLatestVital("blood_pressure", "120/80", "mmHg");
  const hr = getLatestVital("heart_rate", "72", "bpm");
  const glucose = getLatestVital("glucose", "95", "mg/dL");
  const spo2 = getLatestVital("spo2", "99", "%");
  const temp = getLatestVital("temperature", "98.6", "°F");
  const weight = getLatestVital("weight", "68", "kg");

  return (
    <div className="flex-1 flex flex-col h-full bg-white lg:rounded-2xl border border-gray-100/90 shadow-xs overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-white z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-gray-800">
                Personal Health Risk &amp; Vitals Dashboard
              </h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                BIOMARKER RADAR
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Active profile: <strong>{activeProfile?.name || "Self"}</strong> ({activeProfile?.relationship || "Primary"})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLogging(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 px-3.5 rounded-xl flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Vital</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Vitals Grid Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* BP */}
          <div className="p-3.5 rounded-2xl border border-gray-100 bg-slate-50/60 space-y-1 hover:shadow-xs transition-all">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-[11px] font-semibold">Blood Pressure</span>
              <Heart className="w-3.5 h-3.5 text-rose-500" />
            </div>
            <div className="text-lg font-bold text-gray-900 leading-tight">
              {bp.value} <span className="text-[10px] text-gray-400 font-normal">{bp.unit}</span>
            </div>
            <div className="flex items-center justify-between text-[10px] pt-1">
              <span
                className={`font-bold px-1.5 py-0.2 rounded-md ${
                  bp.status === "critical"
                    ? "text-red-700 bg-red-100"
                    : bp.status === "warning"
                    ? "text-amber-700 bg-amber-100"
                    : "text-emerald-700 bg-emerald-100"
                }`}
              >
                {bp.status.toUpperCase()}
              </span>
              <span className="text-gray-400">{bp.date}</span>
            </div>
          </div>

          {/* Heart Rate */}
          <div className="p-3.5 rounded-2xl border border-gray-100 bg-slate-50/60 space-y-1 hover:shadow-xs transition-all">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-[11px] font-semibold">Heart Rate</span>
              <Activity className="w-3.5 h-3.5 text-red-500" />
            </div>
            <div className="text-lg font-bold text-gray-900 leading-tight">
              {hr.value} <span className="text-[10px] text-gray-400 font-normal">{hr.unit}</span>
            </div>
            <div className="flex items-center justify-between text-[10px] pt-1">
              <span className="font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-md">
                {hr.status.toUpperCase()}
              </span>
              <span className="text-gray-400">{hr.date}</span>
            </div>
          </div>

          {/* Blood Sugar */}
          <div className="p-3.5 rounded-2xl border border-gray-100 bg-slate-50/60 space-y-1 hover:shadow-xs transition-all">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-[11px] font-semibold">Fasting Sugar</span>
              <Droplets className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <div className="text-lg font-bold text-gray-900 leading-tight">
              {glucose.value} <span className="text-[10px] text-gray-400 font-normal">{glucose.unit}</span>
            </div>
            <div className="flex items-center justify-between text-[10px] pt-1">
              <span className="font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-md">
                NORMAL
              </span>
              <span className="text-gray-400">{glucose.date}</span>
            </div>
          </div>

          {/* SpO2 */}
          <div className="p-3.5 rounded-2xl border border-gray-100 bg-slate-50/60 space-y-1 hover:shadow-xs transition-all">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-[11px] font-semibold">Oxygen (SpO2)</span>
              <Wind className="w-3.5 h-3.5 text-sky-500" />
            </div>
            <div className="text-lg font-bold text-gray-900 leading-tight">
              {spo2.value} <span className="text-[10px] text-gray-400 font-normal">{spo2.unit}</span>
            </div>
            <div className="flex items-center justify-between text-[10px] pt-1">
              <span className="font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-md">
                OPTIMAL
              </span>
              <span className="text-gray-400">{spo2.date}</span>
            </div>
          </div>

          {/* Temperature */}
          <div className="p-3.5 rounded-2xl border border-gray-100 bg-slate-50/60 space-y-1 hover:shadow-xs transition-all">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-[11px] font-semibold">Temperature</span>
              <Thermometer className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="text-lg font-bold text-gray-900 leading-tight">
              {temp.value} <span className="text-[10px] text-gray-400 font-normal">{temp.unit}</span>
            </div>
            <div className="flex items-center justify-between text-[10px] pt-1">
              <span className="font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-md">
                NORMAL
              </span>
              <span className="text-gray-400">{temp.date}</span>
            </div>
          </div>

          {/* Weight */}
          <div className="p-3.5 rounded-2xl border border-gray-100 bg-slate-50/60 space-y-1 hover:shadow-xs transition-all">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-[11px] font-semibold">Weight</span>
              <Scale className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-lg font-bold text-gray-900 leading-tight">
              {weight.value} <span className="text-[10px] text-gray-400 font-normal">{weight.unit}</span>
            </div>
            <div className="flex items-center justify-between text-[10px] pt-1">
              <span className="font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-md">
                STABLE
              </span>
              <span className="text-gray-400">{weight.date}</span>
            </div>
          </div>
        </div>

        {/* AI Health Risk Radar Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-100 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                Preventive Health Risk Evaluation
              </span>
            </div>
            <h4 className="text-sm font-bold text-gray-900">
              Overall Cardio-Metabolic Status: Low to Moderate Risk Profile
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Your recent blood pressure ({bp.value} mmHg) and resting heart rate ({hr.value} bpm) demonstrate healthy cardiovascular compensation. Keep maintaining your daily hydration and moderate aerobic activity.
            </p>
          </div>

          <button
            onClick={() =>
              onAskAboutVitals(
                `Here are my current vitals: Blood Pressure ${bp.value} mmHg, Heart Rate ${hr.value} bpm, Fasting Sugar ${glucose.value} mg/dL, SpO2 ${spo2.value}%. Can you give me a personalized preventive health breakdown?`
              )
            }
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-xs transition-all"
          >
            <span>Consult AI on Vitals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Habit Intelligence & Lifestyle Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Hydration Tracker */}
          <div className="p-4 rounded-2xl border border-sky-100 bg-sky-50/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-sky-600" />
                Daily Hydration
              </span>
              <span className="text-xs font-bold text-sky-700">{waterGlasses} / 8 Glasses</span>
            </div>
            <div className="w-full bg-sky-200/60 rounded-full h-2 overflow-hidden">
              <div
                className="bg-sky-500 h-full rounded-full transition-all"
                style={{ width: `${Math.min((waterGlasses / 8) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <button
                onClick={() => setWaterGlasses((prev) => Math.max(0, prev - 1))}
                className="w-7 h-7 rounded-lg bg-white border border-sky-200 text-sky-700 font-bold"
              >
                -
              </button>
              <span className="text-[11px] text-gray-500">{(waterGlasses * 0.25).toFixed(1)} L Consumed</span>
              <button
                onClick={() => setWaterGlasses((prev) => prev + 1)}
                className="w-7 h-7 rounded-lg bg-sky-600 text-white font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Sleep Tracker */}
          <div className="p-4 rounded-2xl border border-indigo-100 bg-indigo-50/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                <Moon className="w-4 h-4 text-indigo-600" />
                Sleep Architecture
              </span>
              <span className="text-xs font-bold text-indigo-700">{sleepHours} Hours</span>
            </div>
            <div className="w-full bg-indigo-200/60 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all"
                style={{ width: `${Math.min((sleepHours / 8) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <button
                onClick={() => setSleepHours((prev) => Math.max(0, prev - 0.5))}
                className="w-7 h-7 rounded-lg bg-white border border-indigo-200 text-indigo-700 font-bold"
              >
                -
              </button>
              <span className="text-[11px] text-gray-500">Target: 7-8 hrs Sound Sleep</span>
              <button
                onClick={() => setSleepHours((prev) => prev + 0.5)}
                className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Physical Activity */}
          <div className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Physical Activity
              </span>
              <span className="text-xs font-bold text-emerald-700">{activeMins} / 30 Mins</span>
            </div>
            <div className="w-full bg-emerald-200/60 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all"
                style={{ width: `${Math.min((activeMins / 30) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <button
                onClick={() => setActiveMins((prev) => Math.max(0, prev - 5))}
                className="w-7 h-7 rounded-lg bg-white border border-emerald-200 text-emerald-700 font-bold"
              >
                -
              </button>
              <span className="text-[11px] text-gray-500">Goal: 150 mins / week</span>
              <button
                onClick={() => setActiveMins((prev) => prev + 5)}
                className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Record Vital Modal */}
      {isLogging && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-5 border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h4 className="text-sm font-bold text-gray-800">Record Health Measurement</h4>
              <button onClick={() => setIsLogging(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleLogVital} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Measurement Type</label>
                <select
                  value={vitalType}
                  onChange={(e) => {
                    const t = e.target.value as VitalRecordData["type"];
                    setVitalType(t);
                    if (t === "blood_pressure") setVitalUnit("mmHg");
                    else if (t === "heart_rate") setVitalUnit("bpm");
                    else if (t === "glucose") setVitalUnit("mg/dL");
                    else if (t === "spo2") setVitalUnit("%");
                    else if (t === "temperature") setVitalUnit("°F");
                    else if (t === "weight") setVitalUnit("kg");
                  }}
                  className="w-full border border-gray-200 rounded-xl p-2 bg-white"
                >
                  <option value="blood_pressure">Blood Pressure (mmHg)</option>
                  <option value="heart_rate">Heart Rate (bpm)</option>
                  <option value="glucose">Blood Glucose (mg/dL)</option>
                  <option value="spo2">Oxygen Saturation - SpO2 (%)</option>
                  <option value="temperature">Body Temperature (°F)</option>
                  <option value="weight">Body Weight (kg)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Value *</label>
                <input
                  type="text"
                  required
                  placeholder={vitalType === "blood_pressure" ? "e.g. 120/80" : "e.g. 72"}
                  value={vitalValue}
                  onChange={(e) => setVitalValue(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-2"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Context Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Measured before morning meal"
                  value={vitalNotes}
                  onChange={(e) => setVitalNotes(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsLogging(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  Save Measurement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
