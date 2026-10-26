"use client";

import React, { useState, useEffect } from "react";
import { X, MessageSquare, Trash2, Calendar, ChevronRight, Plus } from "lucide-react";
import { ConversationSummary } from "@/lib/types";

interface ChatHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
}

export const ChatHistoryModal: React.FC<ChatHistoryModalProps> = ({
  isOpen,
  onClose,
  onSelectConversation,
  onNewChat,
}) => {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
      }
    } catch (err) {
      console.error("Error loading chat history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchConversations();
    }
  }, [isOpen]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this conversation?")) return;

    try {
      const res = await fetch(`/api/conversations/${id}`, { method: "DELETE" });
      if (res.ok) {
        setConversations((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error("Error deleting conversation:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-emerald-50/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800">Chat History</h3>
              <p className="text-xs text-gray-500">
                Your past health consultations & assessments
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

        {/* Action Button */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Start a Fresh Consultation</span>
          </button>
        </div>

        {/* List of Conversations */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="text-center py-8 text-xs text-gray-400">
              Loading past consultations...
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-gray-700">No past chats yet</p>
              <p className="text-xs text-gray-400 mt-1">
                Your future conversations with Vaidya Sahay AI will automatically appear here.
              </p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => {
                  onSelectConversation(conv.id);
                  onClose();
                }}
                className="group p-3 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/40 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex-1 min-w-0 pr-3">
                  <h4 className="text-xs font-semibold text-gray-800 truncate group-hover:text-emerald-800">
                    {conv.title}
                  </h4>
                  {conv.lastMessage && (
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">
                      {conv.lastMessage}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(conv.updatedAt).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span>• {conv.messageCount || 0} messages</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleDelete(e, conv.id)}
                    className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete conversation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))
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
