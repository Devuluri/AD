export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  isSaved?: boolean;
}

export interface ConversationSummary {
  id: string;
  title: string;
  profileId?: string | null;
  createdAt: string;
  updatedAt: string;
  isSaved: boolean;
  messageCount?: number;
  lastMessage?: string;
}

export interface HealthTip {
  id: number;
  title: string;
  description: string;
  category: "nutrition" | "lifestyle" | "mental" | "hygiene" | "fitness";
  iconName: string;
}

export interface HospitalInfo {
  id: string;
  name: string;
  type: "General" | "Emergency" | "Super Specialty" | "Pediatric";
  distance: string;
  phone: string;
  emergencyPhone: string;
  rating: number;
  open247: boolean;
  address: string;
}

export type SupportedLanguage = "en" | "hi" | "te";

// Family Profile
export interface FamilyProfile {
  id: string;
  name: string;
  relationship: "Self" | "Father" | "Mother" | "Child" | "Spouse" | "Other";
  age?: number | null;
  gender?: "Male" | "Female" | "Other" | null;
  bloodGroup?: string | null;
  allergies?: string | null;
  chronicConditions?: string | null;
  consentGranted: boolean;
  createdAt: string;
}

// Vitals
export interface VitalRecordData {
  id: string;
  profileId?: string | null;
  type: "blood_pressure" | "heart_rate" | "glucose" | "spo2" | "temperature" | "weight";
  value: string;
  unit: string;
  status: "normal" | "warning" | "critical";
  notes?: string | null;
  recordedAt: string;
  createdAt: string;
}

// Biomarker
export interface BiomarkerItem {
  id?: string;
  name: string;
  value: string;
  numericValue?: number;
  unit: string;
  referenceRange: string;
  status: "normal" | "borderline" | "abnormal" | "critical";
  interpretation?: string;
}

// Medical Report
export interface MedicalReportData {
  id: string;
  profileId?: string | null;
  title: string;
  testType: "CBC" | "Lipid Profile" | "Thyroid" | "Diabetes / HbA1c" | "General";
  testDate: string;
  summary: string;
  findings?: string | null;
  recommendations?: string | null;
  rawContent?: string | null;
  createdAt: string;
  biomarkers: BiomarkerItem[];
}

// Report Comparison Delta Item
export interface BiomarkerDelta {
  name: string;
  unit: string;
  previousValue: string;
  currentValue: string;
  changePercent?: number;
  trend: "improved" | "worsened" | "stable" | "neutral";
  referenceRange: string;
  clinicalSignificance: string;
}

export interface ReportComparisonResult {
  reportA: { title: string; date: string };
  reportB: { title: string; date: string };
  overallAssessment: string;
  deltas: BiomarkerDelta[];
  doctorGuidance: string;
}

// Medicine Intelligence
export interface MedicineInfo {
  id: string;
  brandName: string;
  genericName: string;
  drugClass: string;
  purpose: string;
  commonDosage: string;
  howToTake: string;
  commonSideEffects: string[];
  criticalWarnings: string[];
  foodInteractions: string[];
  missedDoseGuidance: string;
  isPrescriptionOnly: boolean;
  otcAvailability: boolean;
}

// Timeline Event
export interface HealthTimelineEvent {
  id: string;
  profileId?: string | null;
  title: string;
  category: "symptom" | "medication" | "vital" | "report" | "consultation";
  eventDate: string;
  description: string;
  severity?: "mild" | "moderate" | "severe" | null;
  createdAt: string;
}
