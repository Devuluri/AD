"use client";

import React, { useState } from "react";
import { X, Activity, Calculator, Droplets, Thermometer, Pill, AlertTriangle, CheckCircle2 } from "lucide-react";

interface HealthToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HealthToolsModal: React.FC<HealthToolsModalProps> = ({ isOpen, onClose }) => {
  const [activeTool, setActiveTool] = useState<"bmi" | "water" | "temp" | "drugs">("drugs");

  // BMI State
  const [heightCm, setHeightCm] = useState<number>(170);
  const [weightKg, setWeightKg] = useState<number>(65);

  // Water State
  const [weightWater, setWeightWater] = useState<number>(65);
  const [activityMins, setActivityMins] = useState<number>(30);

  // Temperature State
  const [inputTemp, setInputTemp] = useState<number>(102);
  const [unit, setUnit] = useState<"F" | "C">("F");

  // Drug Interaction Checker State
  const [drug1, setDrug1] = useState<string>("Paracetamol");
  const [drug2, setDrug2] = useState<string>("Cold Syrup (Acetaminophen)");

  if (!isOpen) return null;

  // Calculate BMI
  const heightM = heightCm / 100;
  const bmi = heightM > 0 ? (weightKg / (heightM * heightM)).toFixed(1) : "0";
  const bmiNum = parseFloat(bmi);
  let bmiCategory = "Normal Weight";
  let bmiColor = "text-emerald-600 bg-emerald-50 border-emerald-200";

  if (bmiNum < 18.5) {
    bmiCategory = "Underweight";
    bmiColor = "text-amber-600 bg-amber-50 border-amber-200";
  } else if (bmiNum >= 18.5 && bmiNum < 25) {
    bmiCategory = "Healthy / Normal Weight";
    bmiColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
  } else if (bmiNum >= 25 && bmiNum < 30) {
    bmiCategory = "Overweight";
    bmiColor = "text-orange-600 bg-orange-50 border-orange-200";
  } else {
    bmiCategory = "Obese Range";
    bmiColor = "text-red-600 bg-red-50 border-red-200";
  }

  // Calculate Water Target
  const dailyWaterLiters = ((weightWater * 35 + (activityMins / 30) * 350) / 1000).toFixed(1);
  const glassesOfWater = Math.round(parseFloat(dailyWaterLiters) * 4);

  // Calculate Temperature Conversion & Severity
  const convertedTemp =
    unit === "F"
      ? (((inputTemp - 32) * 5) / 9).toFixed(1) + " °C"
      : ((inputTemp * 9) / 5 + 32).toFixed(1) + " °F";

  const tempF = unit === "F" ? inputTemp : (inputTemp * 9) / 5 + 32;
  let tempSeverity = "Normal Body Temperature";
  let tempColor = "text-emerald-700 bg-emerald-50";

  if (tempF > 103) {
    tempSeverity = "High Fever — Seek medical advice promptly";
    tempColor = "text-red-700 bg-red-50 border-red-200";
  } else if (tempF >= 100.4) {
    tempSeverity = "Fever detected — Rest and hydrate";
    tempColor = "text-amber-700 bg-amber-50 border-amber-200";
  } else if (tempF < 95) {
    tempSeverity = "Hypothermia warning — Seek warm environment";
    tempColor = "text-blue-700 bg-blue-50 border-blue-200";
  }

  // Drug Interaction Evaluation Logic
  const evaluateDrugInteraction = () => {
    const d1 = drug1.toLowerCase();
    const d2 = drug2.toLowerCase();

    if (
      (d1.includes("paracetamol") && d2.includes("cold")) ||
      (d1.includes("cold") && d2.includes("paracetamol")) ||
      (d1.includes("paracetamol") && d2.includes("crocin")) ||
      (d1.includes("crocin") && d2.includes("paracetamol"))
    ) {
      return {
        severity: "CRITICAL OVERDOSE HAZARD",
        color: "bg-red-50 border-red-300 text-red-800",
        icon: AlertTriangle,
        message:
          "Both medications contain Acetaminophen (Paracetamol). Taking them concurrently can exceed the safe adult limit (4,000 mg/day) and cause acute liver injury (hepatotoxicity).",
        action: "Avoid taking together. Check ingredient labels carefully.",
      };
    }

    if (
      (d1.includes("ibuprofen") && d2.includes("aspirin")) ||
      (d1.includes("aspirin") && d2.includes("ibuprofen"))
    ) {
      return {
        severity: "HIGH BLEEDING RISK",
        color: "bg-amber-50 border-amber-300 text-amber-900",
        icon: AlertTriangle,
        message:
          "Both are NSAIDs. Combining them significantly increases the risk of gastric ulcers, stomach lining irritation, and internal bleeding. Ibuprofen also blunts the cardioprotective effect of low-dose Aspirin.",
        action: "Do not combine without direct cardiologist/physician supervision.",
      };
    }

    if (
      (d1.includes("ciprofloxacin") && d2.includes("dairy")) ||
      (d1.includes("dairy") && d2.includes("ciprofloxacin"))
    ) {
      return {
        severity: "ABSORPTION IMPAIRMENT",
        color: "bg-orange-50 border-orange-300 text-orange-900",
        icon: AlertTriangle,
        message:
          "Calcium in milk/dairy products binds with Ciprofloxacin, reducing antibiotic absorption in the bloodstream by up to 50%.",
        action: "Take ciprofloxacin at least 2 hours before or 4 hours after dairy products.",
      };
    }

    if (
      (d1.includes("amoxicillin") && d2.includes("probiotic")) ||
      (d1.includes("probiotic") && d2.includes("amoxicillin"))
    ) {
      return {
        severity: "MODERATE TIMING CAUTION",
        color: "bg-sky-50 border-sky-300 text-sky-900",
        icon: CheckCircle2,
        message:
          "Amoxicillin can destroy the beneficial live cultures in probiotics if ingested simultaneously.",
        action: "Space them at least 2 to 3 hours apart for maximum gut health benefit.",
      };
    }

    return {
      severity: "COMPATIBLE / LOW CONFLICT DETECTED",
      color: "bg-emerald-50 border-emerald-300 text-emerald-900",
      icon: CheckCircle2,
      message:
        "No common severe negative interaction found in standard OTC pharmacology databases.",
      action: "Always follow dosage instructions on the prescription label.",
    };
  };

  const drugResult = evaluateDrugInteraction();
  const DrugIcon = drugResult.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800">
                Interactive Health Tools
              </h3>
              <p className="text-xs text-gray-500">
                Calculators &amp; Pharmacological Safety Monitors
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

        {/* Tool Selector Tabs */}
        <div className="grid grid-cols-4 border-b border-gray-100 p-2 bg-gray-50/60 gap-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTool("drugs")}
            className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition-all ${
              activeTool === "drugs"
                ? "bg-white text-emerald-700 shadow-xs font-bold"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            <span className="truncate">Drug Safety</span>
          </button>
          <button
            onClick={() => setActiveTool("bmi")}
            className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition-all ${
              activeTool === "bmi"
                ? "bg-white text-emerald-700 shadow-xs font-bold"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span className="truncate">BMI Index</span>
          </button>
          <button
            onClick={() => setActiveTool("water")}
            className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition-all ${
              activeTool === "water"
                ? "bg-white text-emerald-700 shadow-xs font-bold"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span className="truncate">Hydration</span>
          </button>
          <button
            onClick={() => setActiveTool("temp")}
            className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition-all ${
              activeTool === "temp"
                ? "bg-white text-emerald-700 shadow-xs font-bold"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span className="truncate">Fever Gauge</span>
          </button>
        </div>

        {/* Tool Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          {activeTool === "drugs" && (
            <div className="space-y-4">
              <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-[11px] text-emerald-800 leading-snug">
                <strong>Pharmacological Conflict Engine:</strong> Check if two medications have potential negative interactions, liver toxicity warnings, or absorption clashes before taking them.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    First Medicine
                  </label>
                  <select
                    value={drug1}
                    onChange={(e) => setDrug1(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 bg-white"
                  >
                    <option value="Paracetamol">Paracetamol (500mg)</option>
                    <option value="Ibuprofen">Ibuprofen (Brufen 400mg)</option>
                    <option value="Amoxicillin">Amoxicillin (Antibiotic)</option>
                    <option value="Ciprofloxacin">Ciprofloxacin</option>
                    <option value="Crocin">Crocin Pain Relief</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Second Medicine / Substance
                  </label>
                  <select
                    value={drug2}
                    onChange={(e) => setDrug2(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 bg-white"
                  >
                    <option value="Cold Syrup (Acetaminophen)">Cold Syrup (Acetaminophen)</option>
                    <option value="Aspirin">Aspirin (Ecosprin)</option>
                    <option value="Dairy / Milk">Dairy Products / Milk</option>
                    <option value="Probiotic">Probiotic Capsule</option>
                    <option value="Antacid">Antacid (Gelusil / Digene)</option>
                  </select>
                </div>
              </div>

              {/* Interaction Result Card */}
              <div className={`p-4 rounded-xl border ${drugResult.color} space-y-2`}>
                <div className="flex items-center gap-2">
                  <DrugIcon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-xs font-bold tracking-wide uppercase">
                    {drugResult.severity}
                  </span>
                </div>
                <p className="text-xs leading-relaxed">{drugResult.message}</p>
                <div className="pt-2 border-t border-black/10 text-[11px] font-semibold">
                  Action: {drugResult.action}
                </div>
              </div>
            </div>
          )}

          {activeTool === "bmi" && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 flex justify-between mb-1.5">
                  <span>Height (cm)</span>
                  <span className="text-emerald-700 font-bold">{heightCm} cm</span>
                </label>
                <input
                  type="range"
                  min="120"
                  max="220"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 flex justify-between mb-1.5">
                  <span>Weight (kg)</span>
                  <span className="text-emerald-700 font-bold">{weightKg} kg</span>
                </label>
                <input
                  type="range"
                  min="30"
                  max="150"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              {/* BMI Output Card */}
              <div className={`p-4 rounded-xl border ${bmiColor} text-center space-y-1`}>
                <span className="text-xs font-medium uppercase tracking-wider">Your Body Mass Index</span>
                <div className="text-3xl font-extrabold">{bmi}</div>
                <div className="text-xs font-bold">{bmiCategory}</div>
              </div>
            </div>
          )}

          {activeTool === "water" && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 flex justify-between mb-1.5">
                  <span>Your Weight (kg)</span>
                  <span className="text-emerald-700 font-bold">{weightWater} kg</span>
                </label>
                <input
                  type="range"
                  min="30"
                  max="140"
                  value={weightWater}
                  onChange={(e) => setWeightWater(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 flex justify-between mb-1.5">
                  <span>Daily Exercise / Physical Activity</span>
                  <span className="text-emerald-700 font-bold">{activityMins} minutes</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="120"
                  step="15"
                  value={activityMins}
                  onChange={(e) => setActivityMins(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              {/* Hydration Output */}
              <div className="p-4 rounded-xl border border-sky-200 bg-sky-50 text-sky-900 text-center space-y-1">
                <span className="text-xs font-medium uppercase tracking-wider">Target Fluid Intake</span>
                <div className="text-3xl font-extrabold text-sky-700">{dailyWaterLiters} L / day</div>
                <div className="text-xs text-sky-800">
                  Equivalent to approximately <strong>{glassesOfWater} glasses</strong> (250ml each)
                </div>
              </div>
            </div>
          )}

          {activeTool === "temp" && (
            <div className="space-y-4">
              <div className="flex gap-2 justify-center mb-2">
                <button
                  onClick={() => setUnit("F")}
                  className={`px-3 py-1 text-xs font-bold rounded-lg ${
                    unit === "F" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  Fahrenheit (°F)
                </button>
                <button
                  onClick={() => setUnit("C")}
                  className={`px-3 py-1 text-xs font-bold rounded-lg ${
                    unit === "C" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  Celsius (°C)
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 flex justify-between mb-1.5">
                  <span>Recorded Temperature</span>
                  <span className="text-emerald-700 font-bold">
                    {inputTemp} °{unit}
                  </span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inputTemp}
                  onChange={(e) => setInputTemp(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-emerald-600"
                />
              </div>

              {/* Temperature Evaluation Card */}
              <div className={`p-4 rounded-xl border ${tempColor} text-center space-y-1`}>
                <span className="text-xs font-medium uppercase tracking-wider">
                  Converted: {convertedTemp}
                </span>
                <div className="text-sm font-bold mt-1">{tempSeverity}</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-gray-200 hover:bg-gray-300 font-medium text-xs text-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
