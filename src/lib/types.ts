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
