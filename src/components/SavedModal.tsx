"use client";

import React from "react";
import { X, Bookmark, Trash2 } from "lucide-react";
import { ChatMessage } from "@/lib/types";

interface SavedModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedMessages: ChatMessage[];
  onRemoveSaved: (id: string) => void;
}

export const SavedModal: React.FC<SavedModalProps> = ({
  isOpen,
  onClose,
  savedMessages,
  onRemoveSaved,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800">
                Saved Health Guidance
              </h3>
              <p className="text-xs text-gray-500">
                Bookmarked recommendations and instructions
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
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {savedMessages.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
                <Bookmark className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-gray-700">No saved advice yet</p>
              <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                Hover over any assistant message in the chat and click the bookmark icon to save key advice here.
              </p>
            </div>
          ) : (
            savedMessages.map((msg) => (
              <div
                key={msg.id}
                className="p-3.5 rounded-xl border border-gray-100 hover:border-emerald-200 bg-white shadow-xs space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md">
                    Clinical Guidance
                  </span>
                  <button
                    onClick={() => onRemoveSaved(msg.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </p>
                <div className="text-[10px] text-gray-400 pt-1 border-t border-gray-50">
                  Saved on {new Date(msg.createdAt).toLocaleDateString()}
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
