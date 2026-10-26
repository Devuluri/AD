"use client";

import React, { useState } from "react";
import { AIRobotAvatar, UserAvatar, DoubleCheckIcon } from "./Icons";
import { ChatMessage } from "@/lib/types";
import { Volume2, VolumeX, Copy, Check, Bookmark, BookmarkCheck } from "lucide-react";

interface MessageBubbleProps {
  message: ChatMessage;
  onToggleSave?: (id: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onToggleSave,
}) => {
  const isAI = message.role === "assistant";
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown before speaking
    const cleanText = message.content
      .replace(/[#*•_`~]/g, "")
      .replace(/\n+/g, ". ");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Format timestamp e.g. "10:30 AM"
  const formattedTime = (() => {
    try {
      const d = new Date(message.createdAt);
      if (isNaN(d.getTime())) return "Just now";
      return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    } catch {
      return "10:30 AM";
    }
  })();

  // Render markdown text lines with bold & bullet styling
  const renderFormattedContent = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      // Emergency alert banner in message
      if (line.includes("🚨") || line.includes("URGENT MEDICAL ALERT")) {
        return (
          <div
            key={idx}
            className="my-1.5 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 font-semibold text-xs flex items-center gap-2"
          >
            <span>{line}</span>
          </div>
        );
      }

      // Bullet points
      if (line.trim().startsWith("•") || line.trim().startsWith("-") || line.trim().startsWith("* ")) {
        const bulletText = line.replace(/^[•\-*]\s*/, "");
        return (
          <div key={idx} className="flex items-start gap-2 my-1 pl-1">
            <span className="text-emerald-600 font-bold text-sm leading-none mt-1">•</span>
            <span className="flex-1 text-xs text-gray-800 leading-relaxed font-normal">
              {parseBold(bulletText)}
            </span>
          </div>
        );
      }

      // Empty lines
      if (line.trim() === "") {
        return <div key={idx} className="h-2" />;
      }

      // Normal paragraph
      return (
        <p key={idx} className="text-xs text-gray-800 leading-relaxed font-normal mb-1">
          {parseBold(line)}
        </p>
      );
    });
  };

  // Simple helper to parse **bold text**
  const parseBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-semibold text-gray-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  if (isAI) {
    return (
      <div className="flex items-start gap-3 my-4 group max-w-3xl">
        {/* Robot Avatar */}
        <div className="flex-shrink-0 mt-0.5">
          <AIRobotAvatar className="w-10 h-10 shadow-xs" />
        </div>

        {/* Message Container */}
        <div className="flex flex-col items-start max-w-[85%] sm:max-w-[78%]">
          <div className="relative bg-white border border-gray-100/90 shadow-xs rounded-2xl rounded-tl-sm p-4 text-xs transition-shadow hover:shadow-sm">
            {renderFormattedContent(message.content)}

            {/* Quick Actions Bar (Copy / TTS / Save) */}
            <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleCopy}
                title="Copy message"
                className="p-1 rounded-md text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={handleSpeak}
                title={isSpeaking ? "Stop speaking" : "Read aloud"}
                className="p-1 rounded-md text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
              >
                {isSpeaking ? (
                  <VolumeX className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
              </button>
              {onToggleSave && (
                <button
                  onClick={() => onToggleSave(message.id)}
                  title={message.isSaved ? "Saved" : "Save advice"}
                  className="p-1 rounded-md text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                >
                  {message.isSaved ? (
                    <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Bookmark className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Timestamp */}
          <span className="text-[11px] text-gray-400 mt-1.5 ml-1">
            {formattedTime}
          </span>
        </div>
      </div>
    );
  }

  // User Message
  return (
    <div className="flex items-start justify-end gap-3 my-4 group">
      {/* Message Container */}
      <div className="flex flex-col items-end max-w-[85%] sm:max-w-[75%]">
        <div className="bg-[#e8f5e9] text-gray-900 rounded-2xl rounded-tr-sm p-3.5 px-4 text-xs shadow-xs border border-emerald-100/60 leading-relaxed font-normal">
          {message.content}
        </div>

        {/* Timestamp & Double Checkmarks */}
        <div className="flex items-center gap-1 mt-1.5 mr-1 text-[11px] text-gray-400">
          <span>{formattedTime}</span>
          <DoubleCheckIcon className="w-3.5 h-3.5 text-emerald-600" />
        </div>
      </div>

      {/* Human Avatar */}
      <div className="flex-shrink-0 mt-0.5">
        <UserAvatar className="w-10 h-10 shadow-xs" />
      </div>
    </div>
  );
};
