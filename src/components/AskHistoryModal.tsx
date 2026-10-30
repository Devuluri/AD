"use client";

import React, { useState } from "react";
import {
  X,
  Search,
  History,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { FamilyProfile } from "@/lib/types";

interface AskHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProfile: FamilyProfile | null;
  onInjectIntoChat?: (text: string) => void;
}

export const AskHistoryModal: React.FC<AskHistoryModalProps> = ({
  isOpen,
  onClose,
  activeProfile,
  onInjectIntoChat,
}) => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [stats, setStats] = useState<{ matchedSessions: number; totalMessagesExamined: number } | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (customQuery?: string) => {
    const q = customQuery || query;
    if (!q.trim()) return;

    try {
      setIsSearching(true);
      setAnswer(null);
      const res = await fetch("/api/chat/history-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q.trim(),
          profileId: activeProfile?.id,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAnswer(data.answer);
        setStats({
          matchedSessions: data.matchedSessions || 0,
          totalMessagesExamined: data.totalMessagesExamined || 0,
        });
      }
    } catch (err) {
      console.error("Error querying history:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const sampleQueries = [
    "What symptoms did I report about my fever?",
    "What was my recorded temperature reading?",
    "Did I mention having a cough or headache?",
    "Summarize my reported complaints from previous chats",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800">
                Ask Your Past Health Conversations
              </h3>
              <p className="text-xs text-gray-500">
                Query symptoms and vitals you reported in previous sessions
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
        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
          {/* Quick suggestions */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Suggested Questions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {sampleQueries.map((sq, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setQuery(sq);
                    handleSearch(sq);
                  }}
                  className="bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 rounded-xl px-2.5 py-1 text-[11px] text-gray-700 hover:text-emerald-800 transition-colors"
                >
                  {sq}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input Box */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. When did my fever start or what symptoms did I report?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-emerald-600"
            />
            <button
              onClick={() => handleSearch()}
              disabled={isSearching || !query.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs"
            >
              {isSearching ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Search className="w-3.5 h-3.5" />
              )}
              <span>Query</span>
            </button>
          </div>

          {/* Answer Area */}
          {answer && (
            <div className="p-4 rounded-xl border border-emerald-200 bg-white shadow-xs space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <span className="font-bold text-gray-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Conversation Memory Synthesis:
                </span>
                {stats && (
                  <span className="text-[10px] text-gray-400">
                    Examined {stats.totalMessagesExamined} messages across {stats.matchedSessions} session(s)
                  </span>
                )}
              </div>

              <div className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">
                {answer}
              </div>

              {onInjectIntoChat && (
                <button
                  onClick={() => {
                    onInjectIntoChat(
                      `In my previous conversations, I noted: "${answer.substring(0, 150)}...". Based on this history, what should my next health step be?`
                    );
                    onClose();
                  }}
                  className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 border border-emerald-200 transition-colors"
                >
                  <span>Continue in Live AI Chat</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Safety Disclaimer */}
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-2 text-[10px] text-gray-400">
            <ShieldCheck className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
            <span>
              This feature searches your self-reported chat logs stored locally in SQLite. It does not replace a doctor&apos;s certified medical records.
            </span>
          </div>
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
