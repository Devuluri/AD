"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ShieldCheck,
  Trash2,
  Mic,
  MicOff,
  Send,
  Menu,
  FileText,
  Languages,
} from "lucide-react";
import { ChatMessage, SupportedLanguage } from "@/lib/types";
import { MessageBubble } from "./MessageBubble";
import { AIRobotAvatar } from "./Icons";

// Browser SpeechRecognition typing interface
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionResultItem {
  transcript: string;
}

interface SpeechRecognitionResultList {
  [index: number]: {
    [index: number]: SpeechRecognitionResultItem;
  };
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

interface ExtendedWindow extends Window {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

interface MainChatProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  onClearChat: () => void;
  onOpenMobileMenu?: () => void;
  onToggleSaveMessage?: (id: string) => void;
  onOpenDoctorSummary?: () => void;
  selectedLanguage: SupportedLanguage;
  onChangeLanguage: (lang: SupportedLanguage) => void;
}

export const MainChat: React.FC<MainChatProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onClearChat,
  onOpenMobileMenu,
  onToggleSaveMessage,
  onOpenDoctorSummary,
  selectedLanguage,
  onChangeLanguage,
}) => {
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // Auto-scroll to bottom whenever messages update or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Compute live triage severity level from messages
  const triageAssessment = (() => {
    const fullConversation = messages.map((m) => m.content.toLowerCase()).join(" ");
    if (
      fullConversation.includes("chest pain") ||
      fullConversation.includes("breathing") ||
      fullConversation.includes("stroke") ||
      fullConversation.includes("unconscious")
    ) {
      return {
        label: "Emergency Risk",
        badge: "bg-red-50 text-red-700 border-red-200",
        dot: "bg-red-500",
      };
    }
    if (
      fullConversation.includes("102") ||
      fullConversation.includes("fever") ||
      fullConversation.includes("headache") ||
      fullConversation.includes("yesterday") ||
      fullConversation.includes("cough")
    ) {
      return {
        label: "Moderate (Physician Advised)",
        badge: "bg-amber-50 text-amber-800 border-amber-200",
        dot: "bg-amber-500",
      };
    }
    return {
      label: "Mild (Self-Care)",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500",
    };
  })();

  // Handle Form Submission
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || isLoading) return;

    onSendMessage(trimmed);
    setInputText("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Setup Web Speech API Voice Recognition
  const toggleSpeechRecognition = () => {
    if (typeof window === "undefined") return;

    const extWindow = window as unknown as ExtendedWindow;
    const SpeechRecognitionClass =
      extWindow.SpeechRecognition || extWindow.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang =
        selectedLanguage === "hi"
          ? "hi-IN"
          : selectedLanguage === "te"
          ? "te-IN"
          : "en-US";

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
    } catch {
      setIsListening(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white lg:rounded-2xl border border-gray-100/90 shadow-xs overflow-hidden">
      {/* Top Header Bar */}
      <header className="px-5 py-3.5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-white z-10">
        <div className="flex items-center gap-3">
          {onOpenMobileMenu && (
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200/60 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-gray-800 leading-tight">
                AI Healthcare Assistant
              </h2>
              {/* Live Triage Risk Indicator */}
              <span
                className={`hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-semibold ${triageAssessment.badge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${triageAssessment.dot}`}></span>
                <span>{triageAssessment.label}</span>
              </span>
            </div>
            <p className="text-[10px] text-gray-400">
              Vaidya Sahay Clinical Assessment Engine • MASQUERADE &apos;26
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Vernacular Language Selector */}
          <div className="flex items-center bg-gray-50 border border-gray-200/80 rounded-xl p-0.5 text-xs">
            <Languages className="w-3.5 h-3.5 text-gray-400 ml-1.5 mr-1" />
            <button
              onClick={() => onChangeLanguage("en")}
              className={`px-2 py-1 rounded-lg font-medium transition-all ${
                selectedLanguage === "en"
                  ? "bg-white text-emerald-800 shadow-xs font-bold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onChangeLanguage("hi")}
              className={`px-2 py-1 rounded-lg font-medium transition-all ${
                selectedLanguage === "hi"
                  ? "bg-white text-emerald-800 shadow-xs font-bold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => onChangeLanguage("te")}
              className={`px-2 py-1 rounded-lg font-medium transition-all ${
                selectedLanguage === "te"
                  ? "bg-white text-emerald-800 shadow-xs font-bold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              తెలుగు
            </button>
          </div>

          {/* Online Status Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/50 text-[11px] font-semibold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Online</span>
          </div>

          {/* Doctor Summary Button (Competitive Novel Feature) */}
          {onOpenDoctorSummary && (
            <button
              onClick={onOpenDoctorSummary}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50/70 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors shadow-xs active:scale-95"
              title="Generate pre-consultation summary for doctor (SBAR format)"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden md:inline">Doctor Summary</span>
            </button>
          )}

          {/* Clear Chat Button */}
          <button
            onClick={onClearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors active:scale-95"
            title="Clear current messages"
          >
            <Trash2 className="w-3.5 h-3.5 text-gray-400" />
            <span className="hidden sm:inline">Clear Chat</span>
          </button>
        </div>
      </header>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onToggleSave={onToggleSaveMessage}
          />
        ))}

        {/* Typing / Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3 my-4">
            <div className="flex-shrink-0 mt-0.5">
              <AIRobotAvatar className="w-10 h-10 shadow-xs" />
            </div>
            <div className="bg-white border border-gray-100 shadow-xs rounded-2xl rounded-tl-sm p-4 text-xs flex items-center space-x-1.5">
              <span className="text-[11px] text-gray-500 font-medium mr-1.5">
                Vaidya Sahay is analyzing
              </span>
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Input Area */}
      <div className="px-6 pb-5 pt-2 bg-white">
        {/* Medical disclaimer note */}
        <p className="text-[11px] text-gray-400 text-center mb-2.5 font-normal">
          Vaidya Sahay AI can make mistakes. Please consult a doctor for medical advice.
        </p>

        {/* Input Bar Form */}
        <form
          onSubmit={handleSubmit}
          className="relative flex items-center bg-white border border-gray-200/90 rounded-2xl p-1.5 shadow-xs focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 transition-all"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder={
              selectedLanguage === "hi"
                ? "अपने लक्षण या स्वास्थ्य प्रश्न यहाँ लिखें..."
                : selectedLanguage === "te"
                ? "మీ లక్షణాలు లేదా ఆరోగ్య ప్రశ్నను ఇక్కడ టైప్ చేయండి..."
                : "Type your message..."
            }
            disabled={isLoading}
            className="flex-1 bg-transparent px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
          />

          <div className="flex items-center gap-1.5 pr-1">
            {/* Microphone Voice Input Button */}
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              title={isListening ? "Listening... click to stop" : "Voice input"}
              className={`p-2 rounded-xl transition-all ${
                isListening
                  ? "bg-red-500 text-white animate-pulse"
                  : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              {isListening ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white p-2.5 rounded-xl shadow-xs transition-all transform active:scale-95 flex items-center justify-center"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
