"use client";

import React, { useState } from "react";
import { LeftSidebar } from "@/components/LeftSidebar";
import { MainChat } from "@/components/MainChat";
import { RightSidebar } from "@/components/RightSidebar";
import { HospitalModal } from "@/components/HospitalModal";
import { ChatHistoryModal } from "@/components/ChatHistoryModal";
import { HealthToolsModal } from "@/components/HealthToolsModal";
import { AboutModal } from "@/components/AboutModal";
import { SavedModal } from "@/components/SavedModal";
import { DoctorSummaryModal } from "@/components/DoctorSummaryModal";
import { ChatMessage, SupportedLanguage } from "@/lib/types";

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

  // Tab & Modal State
  const [activeTab, setActiveTab] = useState<"home" | "history" | "saved" | "tools" | "about">("home");
  const [isHospitalModalOpen, setIsHospitalModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isToolsModalOpen, setIsToolsModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isDoctorSummaryOpen, setIsDoctorSummaryOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle Left Sidebar tab switches
  const handleTabChange = (tab: "home" | "history" | "saved" | "tools" | "about") => {
    setActiveTab(tab);
    if (tab === "history") setIsHistoryModalOpen(true);
    if (tab === "saved") setIsSavedModalOpen(true);
    if (tab === "tools") setIsToolsModalOpen(true);
    if (tab === "about") setIsAboutModalOpen(true);
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
      // Send conversation payload to server-side API with language hint
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
      <div className="flex-1 max-w-[1600px] w-full mx-auto p-2 sm:p-4 lg:p-6 flex flex-col h-[calc(100vh-42px)]">
        <div className="flex-1 flex gap-4 overflow-hidden rounded-2xl bg-transparent">
          {/* Left Sidebar */}
          <LeftSidebar
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            onNewChat={handleNewChat}
            onEmergencyClick={() => setIsHospitalModalOpen(true)}
            isMobileOpen={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
          />

          {/* Main Chat Center Canvas */}
          <main className="flex-1 flex flex-col min-w-0 h-full">
            <MainChat
              messages={messages}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              onClearChat={handleClearChat}
              onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
              onToggleSaveMessage={handleToggleSave}
              onOpenDoctorSummary={() => setIsDoctorSummaryOpen(true)}
              selectedLanguage={selectedLanguage}
              onChangeLanguage={(lang) => {
                setSelectedLanguage(lang);
              }}
            />
          </main>

          {/* Right Sidebar */}
          <RightSidebar
            onSelectQuestion={handleSendMessage}
            onOpenHospitalModal={() => setIsHospitalModalOpen(true)}
            className="hidden xl:flex"
          />
        </div>
      </div>

      {/* Bottom Global Footer */}
      <footer className="w-full text-center py-2.5 bg-transparent border-t border-gray-100/80">
        <p className="text-[11px] text-gray-400 font-normal">
          © 2024 Vaidya Sahay AI • Built for MASQUERADE &apos;26 • All rights reserved
        </p>
      </footer>

      {/* Interactive Modals */}
      <HospitalModal
        isOpen={isHospitalModalOpen}
        onClose={() => setIsHospitalModalOpen(false)}
      />

      <ChatHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => {
          setIsHistoryModalOpen(false);
          setActiveTab("home");
        }}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
      />

      <HealthToolsModal
        isOpen={isToolsModalOpen}
        onClose={() => {
          setIsToolsModalOpen(false);
          setActiveTab("home");
        }}
      />

      <DoctorSummaryModal
        isOpen={isDoctorSummaryOpen}
        onClose={() => setIsDoctorSummaryOpen(false)}
        messages={messages}
      />

      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => {
          setIsAboutModalOpen(false);
          setActiveTab("home");
        }}
      />

      <SavedModal
        isOpen={isSavedModalOpen}
        onClose={() => {
          setIsSavedModalOpen(false);
          setActiveTab("home");
        }}
        savedMessages={savedMessages}
        onRemoveSaved={handleToggleSave}
      />
    </div>
  );
}
