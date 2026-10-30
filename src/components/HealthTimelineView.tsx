"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Plus,
  AlertCircle,
  FileText,
  Activity,
  Pill,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Filter,
} from "lucide-react";
import { HealthTimelineEvent, FamilyProfile } from "@/lib/types";

interface HealthTimelineViewProps {
  activeProfile: FamilyProfile | null;
  onAskTimelineInChat: (text: string) => void;
}

export const HealthTimelineView: React.FC<HealthTimelineViewProps> = ({
  activeProfile,
  onAskTimelineInChat,
}) => {
  const [events, setEvents] = useState<HealthTimelineEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Modal to add event
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<HealthTimelineEvent["category"]>("symptom");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<HealthTimelineEvent["severity"]>("mild");

  useEffect(() => {
    fetchTimeline();
  }, [activeProfile]);

  const fetchTimeline = async () => {
    try {
      setLoading(true);
      const url = activeProfile?.id ? `/api/timeline?profileId=${activeProfile.id}` : "/api/timeline";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (err) {
      console.error("Error fetching timeline:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    try {
      const res = await fetch("/api/timeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: activeProfile?.id,
          title: title.trim(),
          category,
          description: description.trim(),
          severity,
        }),
      });

      if (res.ok) {
        setIsAdding(false);
        setTitle("");
        setDescription("");
        fetchTimeline();
      }
    } catch (err) {
      console.error("Error adding timeline event:", err);
    }
  };

  const filteredEvents =
    filterCategory === "all" ? events : events.filter((e) => e.category === filterCategory);

  // Helper for category icon
  const renderCategoryIcon = (cat: HealthTimelineEvent["category"]) => {
    switch (cat) {
      case "vital":
        return <Activity className="w-3.5 h-3.5 text-blue-600" />;
      case "medication":
        return <Pill className="w-3.5 h-3.5 text-purple-600" />;
      case "report":
        return <FileText className="w-3.5 h-3.5 text-emerald-600" />;
      case "consultation":
        return <MessageSquare className="w-3.5 h-3.5 text-teal-600" />;
      default:
        return <AlertCircle className="w-3.5 h-3.5 text-amber-600" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white lg:rounded-2xl border border-gray-100/90 shadow-xs overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-white z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-gray-800">Personal AI Health Timeline</h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                CHRONOLOGICAL STREAM
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Aggregated symptoms, vital fluctuations, diagnostic reports, and medical consultations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Category Filter */}
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-2 py-1 text-xs">
            <Filter className="w-3 h-3 text-gray-400 mr-1.5" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-transparent text-gray-700 font-semibold focus:outline-none"
            >
              <option value="all">All Events</option>
              <option value="symptom">Symptoms</option>
              <option value="vital">Vitals</option>
              <option value="report">Reports</option>
              <option value="medication">Medications</option>
              <option value="consultation">Consultations</option>
            </select>
          </div>

          <button
            onClick={() => setIsAdding(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 px-3.5 rounded-xl flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Event</span>
          </button>
        </div>
      </header>

      {/* Content Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Timeline AI Summary Banner */}
        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5 max-w-xl">
            <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Symptom Trajectory &amp; Timeline Intelligence
            </span>
            <p className="text-xs text-gray-600">
              Vaidya Sahay AI automatically chronographs events logged across conversations and vitals.
            </p>
          </div>

          <button
            onClick={() =>
              onAskTimelineInChat(
                "Can you review my recent health timeline and summarize any symptom patterns, improvements, or signs requiring doctor evaluation?"
              )
            }
            className="text-xs font-semibold text-emerald-700 bg-white hover:bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <span>Synthesize Timeline with AI</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Timeline Vertical Stream */}
        {loading ? (
          <div className="text-center py-16 text-xs text-gray-400">Loading health timeline...</div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-xs">
            <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="font-semibold text-gray-600">No events logged yet in this category.</p>
            <p className="text-[11px] mt-1">
              Events will automatically appear here as you log vitals, analyze reports, or add manual events.
            </p>
          </div>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-100">
            {filteredEvents.map((event) => (
              <div key={event.id} className="relative group">
                {/* Node icon */}
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-white border-2 border-emerald-500 shadow-xs flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div>
                </div>

                <div className="p-4 rounded-2xl border border-gray-100 bg-white shadow-xs hover:border-emerald-200 transition-all space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-lg bg-gray-50 border border-gray-100">
                        {renderCategoryIcon(event.category)}
                      </div>
                      <h4 className="text-xs font-bold text-gray-900">{event.title}</h4>
                      <span className="text-[10px] text-gray-400 uppercase font-semibold">
                        ({event.category})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>
                        {new Date(event.eventDate).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {event.severity && (
                        <span
                          className={`font-bold px-1.5 py-0.2 rounded-md ${
                            event.severity === "severe"
                              ? "bg-red-100 text-red-700"
                              : event.severity === "moderate"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {event.severity.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed pl-7">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Custom Event Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-5 border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h4 className="text-sm font-bold text-gray-800">Add Timeline Event</h4>
              <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Event Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as HealthTimelineEvent["category"])}
                  className="w-full border border-gray-200 rounded-xl p-2 bg-white"
                >
                  <option value="symptom">Symptom Onset / Change</option>
                  <option value="medication">Medication Started / Changed</option>
                  <option value="vital">Vitals Fluctuations</option>
                  <option value="report">Diagnostic Lab Report</option>
                  <option value="consultation">Doctor Consultation</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Headache reduced after paracetamol"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-2"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Description / Observations *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide context on duration, pain rating, or doctor recommendations..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-2"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Severity Indicator</label>
                <select
                  value={severity || "mild"}
                  onChange={(e) => setSeverity(e.target.value as HealthTimelineEvent["severity"])}
                  className="w-full border border-gray-200 rounded-xl p-2 bg-white"
                >
                  <option value="mild">Mild / Manageable at Home</option>
                  <option value="moderate">Moderate / Physician Consultation Advised</option>
                  <option value="severe">Severe / Urgent Attention Needed</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  Add to Timeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
