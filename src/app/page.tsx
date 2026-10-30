"use client";

import React, { useState, useEffect } from "react";
import { LeftSidebar, NavTabType } from "@/components/LeftSidebar";
import { MainChat } from "@/components/MainChat";
import { RightSidebar } from "@/components/RightSidebar";
import { HospitalModal } from "@/components/HospitalModal";
import { ChatHistoryModal } from "@/components/ChatHistoryModal";
import { HealthToolsModal } from "@/components/HealthToolsModal";
import { AboutModal } from "@/components/AboutModal";
import { SavedModal } from "@/components/SavedModal";
import { DoctorSummaryModal } from "@/components/DoctorSummaryModal";
import { AskHistoryModal } from "@/components/AskHistoryModal";
import { HealthDashboardView } from "@/components/HealthDashboardView";
import { MedicalReportView } from "@/components/MedicalReportView";
import { MedicineIntelligenceView } from "@/components/MedicineIntelligenceView";
import { HealthTimelineView } from "@/components/HealthTimelineView";
import { ChatMessage, SupportedLanguage, FamilyProfile } from "@/lib/types";

// Initial demo messages matching reference image perfectly
const INITIAL_DEMO_MESSAGES: ChatMessage[] = [
  {
    id: "init-1",
    role: "assistant",
    content:
      "Hello! I'm Vaidya Sahay 👋\nI'm here to help you with your health-related questions and guide you to better health.",
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: "init-2",
    role: "user",
    content: "I have fever and headache.",
    createdAt: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
  },
  {
    id: "init-3",
    role: "assistant",
    content:
      "I'm sorry to hear that you're not feeling well. 🙁\nTo understand better, can you please tell me:\n\n• How long have you had the fever?\n• What is your temperature?\n• Are you experiencing any other symptoms like cough, sore throat, body pain, or vomiting?",
    createdAt: new Date(Date.now() - 1000 * 60 * 13).toISOString(),
  },
  {
    id: "init-4",
    role: "user",
    content: "Since yesterday. My temperature is around 102°F and I have a headache.",
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: "init-5",
    role: "assistant",
    content:
      "A temperature of 102°F (38.9°C) is considered high fever.\nYour headache is important information.\n\nA few more questions:\n• Do you have cough, sore throat, or body pain?\n• Are you having chills or feeling very weak?\n• Do you have any chronic medical conditions?\n\nIf your symptoms worsen or you develop difficulty breathing, please seek medical attention immediately.",
    createdAt: new Date(Date.now() - 1000 * 60 * 11).toISOString(),
  },
];

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_DEMO_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>("en");

  // Multi-Profile State
  const [profiles, setProfiles] = useState<FamilyProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<FamilyProfile | null>(null);

  // Tab & View Navigation State
  const [activeTab, setActiveTab] = useState<NavTabType>("home");

  // Modals State
  const [isHospitalModalOpen, setIsHospitalModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isToolsModalOpen, setIsToolsModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isDoctorSummaryOpen, setIsDoctorSummaryOpen] = useState(false);
  const [isAskHistoryOpen, setIsAskHistoryOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load family profiles on mount
  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const res = await fetch("/api/profiles");
      if (res.ok) {
        const data = await res.json();
        setProfiles(data.profiles || []);
        if (data.profiles && data.profiles.length > 0 && !activeProfile) {
          setActiveProfile(data.profiles[0]);
        }
      }
    } catch (err) {
      console.error("Error loading profiles:", err);
    }
  };

  // Handle Left Sidebar tab switches
  const handleTabChange = (tab: NavTabType) => {
    if (tab === "history") {
      setIsHistoryModalOpen(true);
      return;
    }
    if (tab === "saved") {
      setIsSavedModalOpen(true);
      return;
    }
    if (tab === "tools") {
      setIsToolsModalOpen(true);
      return;
    }
    if (tab === "about") {
      setIsAboutModalOpen(true);
      return;
    }
    setActiveTab(tab);
  };

  // Start a fresh consultation session
  const handleNewChat = () => {
    const greetingText =
      selectedLanguage === "hi"
        ? "नमस्ते! मैं वैद्य सहाय हूँ 👋\nमैं आपके स्वास्थ्य सम्बन्धी प्रश्नों और लक्षणों का आकलन करने में आपकी सहायता के लिए यहाँ हूँ।\n\nआज आप कैसा महसूस कर रहे हैं?"
        : selectedLanguage === "te"
        ? "నమస్కారం! నేను వైద్య సహాయ్ 👋\nమీ ఆరోగ్య సంబంధిత ప్రశ్నలకు సమాధానాలు ఇవ్వడానికి నేను సిద్ధంగా ఉన్నాను.\n\nఈరోజు మీరు ఎలా భావిస్తున్నారు?"
        : "Hello! I'm Vaidya Sahay 👋\nI'm here to help you with your health-related questions, symptom assessment, and guide you to better health.\n\nHow can I help you today?";

    const greeting: ChatMessage = {
      id: "fresh-" + Date.now(),
      role: "assistant",
      content: greetingText,
      createdAt: new Date().toISOString(),
    };
    setMessages([greeting]);
    setActiveConversationId(null);
  };

  // Clear current chat
  const handleClearChat = () => {
    if (confirm("Are you sure you want to clear the current conversation?")) {
      handleNewChat();
    }
  };

  // Send message to Gemini API via POST /api/chat
  const handleSendMessage = async (text: string) => {
    const userMessage: ChatMessage = {
      id: "user-" + Date.now(),
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          conversationId: activeConversationId || undefined,
          language: selectedLanguage,
          profileId: activeProfile?.id,
        }),
      });

      if (!res.ok) {
        throw new Error("Chat response failed with status " + res.status);
      }

      const data = await res.json();

      const aiMessage: ChatMessage = {
        id: "assistant-" + Date.now(),
        role: "assistant",
        content: data.response,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (data.conversationId) {
        setActiveConversationId(data.conversationId);
      }
    } catch (error) {
      console.error("Error communicating with AI service:", error);
      const errorMessage: ChatMessage = {
        id: "err-" + Date.now(),
        role: "assistant",
        content:
          "I apologize, but I encountered a momentary connection glitch. Please feel free to re-enter your question or seek immediate care if you have critical symptoms.",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick action from other views (Reports / Vitals / Timeline) to discuss in live chat
  const handleCrossViewDiscuss = (promptText: string) => {
    setActiveTab("home");
    handleSendMessage(promptText);
  };

  // Load a conversation from history
  const handleSelectConversation = async (id: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/conversations/${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages);
          setActiveConversationId(id);
          setActiveTab("home");
        }
      }
    } catch (err) {
      console.error("Failed to load conversation details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle save/bookmark message
  const handleToggleSave = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isSaved: !msg.isSaved } : msg
      )
    );
  };

  const savedMessages = messages.filter((m) => m.isSaved);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between selection:bg-emerald-100">
      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Main App Container */}
      <div className="flex-1 max-w-[1680px] w-full mx-auto p-2 sm:p-4 lg:p-6 flex flex-col h-[calc(100vh-42px)]">
        <div className="flex-1 flex gap-4 overflow-hidden rounded-2xl bg-transparent">
          {/* Left Navigation Sidebar */}
          <LeftSidebar
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            onNewChat={handleNewChat}
            onEmergencyClick={() => setIsHospitalModalOpen(true)}
            isMobileOpen={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
          />

          {/* Dynamic Central Canvas View */}
          <main className="flex-1 flex flex-col min-w-0 h-full">
            {activeTab === "home" && (
              <MainChat
                messages={messages}
                isLoading={isLoading}
                onSendMessage={handleSendMessage}
                onClearChat={handleClearChat}
                onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
                onToggleSaveMessage={handleToggleSave}
                onOpenDoctorSummary={() => setIsDoctorSummaryOpen(true)}
                selectedLanguage={selectedLanguage}
                onChangeLanguage={(lang) => setSelectedLanguage(lang)}
                profiles={profiles}
                activeProfile={activeProfile}
                onSelectProfile={(p) => setActiveProfile(p)}
                onRefreshProfiles={fetchProfiles}
              />
            )}

            {activeTab === "dashboard" && (
              <HealthDashboardView
                activeProfile={activeProfile}
                onAskAboutVitals={handleCrossViewDiscuss}
              />
            )}

            {activeTab === "reports" && (
              <MedicalReportView
                activeProfile={activeProfile}
                onDiscussInChat={handleCrossViewDiscuss}
              />
            )}

            {activeTab === "medicines" && (
              <MedicineIntelligenceView onAskInChat={handleCrossViewDiscuss} />
            )}

            {activeTab === "timeline" && (
              <HealthTimelineView
                activeProfile={activeProfile}
                onAskTimelineInChat={handleCrossViewDiscuss}
              />
            )}
          </main>

          {/* Right Sidebar (only shown on Home chat view on large screens) */}
          {activeTab === "home" && (
            <RightSidebar
              onSelectQuestion={handleSendMessage}
              onOpenHospitalModal={() => setIsHospitalModalOpen(true)}
              onOpenAskHistory={() => setIsAskHistoryOpen(true)}
              className="hidden xl:flex"
            />
          )}
        </div>
      </div>

      {/* Bottom Global Footer */}
      <footer className="w-full text-center py-2.5 bg-transparent border-t border-gray-100/80">
        <p className="text-[11px] text-gray-400 font-normal">
          © 2024 Vaidya Sahay AI • Built for MASQUERADE &apos;26 • Next-Gen AI Healthcare Platform • All rights reserved
        </p>
      </footer>

      {/* Interactive Modals */}
      <HospitalModal
        isOpen={isHospitalModalOpen}
        onClose={() => setIsHospitalModalOpen(false)}
      />

      <ChatHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
      />

      <HealthToolsModal
        isOpen={isToolsModalOpen}
        onClose={() => setIsToolsModalOpen(false)}
      />

      <DoctorSummaryModal
        isOpen={isDoctorSummaryOpen}
        onClose={() => setIsDoctorSummaryOpen(false)}
        messages={messages}
      />

      <AskHistoryModal
        isOpen={isAskHistoryOpen}
        onClose={() => setIsAskHistoryOpen(false)}
        activeProfile={activeProfile}
        onInjectIntoChat={handleSendMessage}
      />

      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

      <SavedModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedMessages={savedMessages}
        onRemoveSaved={handleToggleSave}
      />
    </div>
  );
}
