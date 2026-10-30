"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Bookmark,
  Activity,
  Info,
  Plus,
  HeartPulse,
  AlertTriangle,
  PhoneCall,
  Droplets,
  Moon,
  ShieldPlus,
  Sparkles,
  FileText,
  Pill,
  Calendar,
  LayoutDashboard,
  Bot,
} from "lucide-react";
import { BrandLogoIcon } from "./Icons";
import { HEALTH_TIPS } from "@/data/healthTips";

export type NavTabType =
  | "home"
  | "dashboard"
  | "reports"
  | "medicines"
  | "timeline"
  | "history"
  | "saved"
  | "tools"
  | "about";

interface LeftSidebarProps {
  activeTab: NavTabType;
  setActiveTab: (tab: NavTabType) => void;
  onNewChat: () => void;
  onEmergencyClick: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  activeTab,
  setActiveTab,
  onNewChat,
  onEmergencyClick,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Auto-cycle through health tips every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % HEALTH_TIPS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const currentTip = HEALTH_TIPS[currentTipIndex];

  const renderTipIcon = (name: string) => {
    switch (name) {
      case "Droplets":
        return <Droplets className="w-5 h-5 text-emerald-600" />;
      case "Moon":
        return <Moon className="w-5 h-5 text-emerald-600" />;
      case "ShieldPlus":
        return <ShieldPlus className="w-5 h-5 text-emerald-600" />;
      case "Sparkles":
        return <Sparkles className="w-5 h-5 text-emerald-600" />;
      default:
        return <HeartPulse className="w-5 h-5 text-emerald-600" />;
    }
  };

  const navItems = [
    { id: "home", label: "AI Consultation", icon: Bot },
    { id: "dashboard", label: "Health Dashboard", icon: LayoutDashboard, badge: "LIVE" },
    { id: "reports", label: "Medical Reports", icon: FileText, badge: "AI" },
    { id: "medicines", label: "Medicine Safety", icon: Pill },
    { id: "timeline", label: "Health Timeline", icon: Calendar },
    { id: "history", label: "Chat History", icon: MessageSquare },
    { id: "saved", label: "Saved Guidance", icon: Bookmark },
    { id: "tools", label: "Health Tools", icon: Activity },
    { id: "about", label: "About Platform", icon: Info },
  ] as const;

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200/80 p-5 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
        ${isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      <div className="flex flex-col space-y-3.5">
        {/* Logo and Brand Header */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab("home")}>
          <BrandLogoIcon className="w-9 h-9 flex-shrink-0" />
          <div className="flex flex-col">
            <h1 className="font-bold text-gray-900 text-lg leading-tight tracking-tight">
              Vaidya Sahay AI
            </h1>
            <p className="text-xs text-emerald-700 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
              Your Health Companion
            </p>
          </div>
        </div>

        {/* New Chat Button */}
        <button
          onClick={() => {
            setActiveTab("home");
            onNewChat();
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm shadow-emerald-700/20 transition-all transform active:scale-[0.99]"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>New Consultation</span>
        </button>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`
                  w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left
                  ${
                    isActive
                      ? "bg-[#e8f5e9] text-emerald-800 font-bold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-emerald-700 stroke-[2.2]" : "text-gray-500"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {"badge" in item && (
                  <span className="text-[9px] bg-emerald-600 text-white font-extrabold px-1.5 py-0.2 rounded-md">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Health Tips Card */}
        <div className="bg-[#e8f5e9]/70 border border-emerald-100 rounded-2xl p-3 flex flex-col space-y-2 transition-all">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-emerald-800 tracking-wide">
              Health Tips
            </h3>
            <span className="text-[9px] text-emerald-600/70 font-semibold uppercase tracking-wider">
              {currentTip.category}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white shadow-xs border border-emerald-200/50 flex items-center justify-center flex-shrink-0">
              {renderTipIcon(currentTip.iconName)}
            </div>
            <p className="text-[11px] text-gray-700 leading-snug font-normal min-h-[38px] flex items-center">
              {currentTip.description}
            </p>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center space-x-1.5 pt-0.5">
            {HEALTH_TIPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentTipIndex(idx)}
                aria-label={`Go to health tip ${idx + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === currentTipIndex
                    ? "bg-emerald-600 w-3"
                    : "bg-emerald-300/60 hover:bg-emerald-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Emergency Card */}
        <div className="bg-[#fef2f2] border border-red-100/90 rounded-2xl p-3 flex flex-col space-y-1.5">
          <div className="flex items-center gap-1.5 text-red-600">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
            <h3 className="text-xs font-bold tracking-wide">Emergency?</h3>
          </div>
          <p className="text-[10px] text-gray-600 leading-snug">
            Immediate 24/7 care for severe symptoms.
          </p>
          <button
            onClick={onEmergencyClick}
            className="w-full bg-[#ef4444] hover:bg-[#dc2626] text-white text-[11px] font-semibold py-1.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-[0.98]"
          >
            <PhoneCall className="w-3 h-3" />
            <span>Emergency 112 / 108</span>
          </button>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="pt-2 border-t border-gray-100">
        <p className="text-[9px] text-gray-400 leading-tight">
          Disclaimer: Educational &amp; triage assistant. Not a substitute for licensed medical judgment.
        </p>
      </div>
    </aside>
  );
};
