"use client";

import React, { useState } from "react";
import { Users, Plus, Check, Shield, User, Heart } from "lucide-react";
import { FamilyProfile } from "@/lib/types";

interface FamilyProfileSelectorProps {
  profiles: FamilyProfile[];
  activeProfile: FamilyProfile | null;
  onSelectProfile: (profile: FamilyProfile) => void;
  onRefreshProfiles: () => void;
}

export const FamilyProfileSelector: React.FC<FamilyProfileSelectorProps> = ({
  profiles,
  activeProfile,
  onSelectProfile,
  onRefreshProfiles,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState<FamilyProfile["relationship"]>("Father");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<FamilyProfile["gender"]>("Male");
  const [bloodGroup, setBloodGroup] = useState("B+");
  const [chronicConditions, setChronicConditions] = useState("");
  const [allergies, setAllergies] = useState("");
  const [consentGranted, setConsentGranted] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setLoading(true);
      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          relationship,
          age: age ? parseInt(age, 10) : null,
          gender,
          bloodGroup,
          chronicConditions: chronicConditions.trim() || null,
          allergies: allergies.trim() || null,
          consentGranted,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        onRefreshProfiles();
        if (data.profile) {
          onSelectProfile(data.profile);
        }
        setIsAdding(false);
        setIsOpen(false);
        setName("");
        setAge("");
        setChronicConditions("");
        setAllergies("");
      }
    } catch (err) {
      console.error("Error creating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Profile Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50/80 hover:bg-emerald-100 text-xs font-semibold text-emerald-800 transition-all shadow-xs"
        title="Switch family member health profile"
      >
        <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
          {activeProfile?.name ? activeProfile.name.charAt(0).toUpperCase() : "U"}
        </div>
        <div className="flex flex-col text-left leading-none">
          <span className="text-[11px] font-bold text-gray-800 max-w-[90px] truncate">
            {activeProfile?.name || "Self"}
          </span>
          <span className="text-[9px] text-emerald-600 font-medium">
            {activeProfile?.relationship || "Primary Profile"}
          </span>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 p-3 space-y-2.5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              Family Health Vault
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
              Consent Protected
            </span>
          </div>

          {/* List of profiles */}
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {profiles.map((p) => {
              const isSelected = activeProfile?.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelectProfile(p);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                    isSelected ? "bg-emerald-50 text-emerald-900 font-bold" : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="leading-tight">{p.name}</div>
                      <div className="text-[10px] text-gray-400 font-normal">
                        {p.relationship} {p.age ? `• ${p.age} yrs` : ""} {p.bloodGroup ? `• ${p.bloodGroup}` : ""}
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                </button>
              );
            })}
          </div>

          {/* Add Member CTA */}
          <button
            onClick={() => setIsAdding(true)}
            className="w-full bg-gray-50 hover:bg-emerald-50/70 border border-dashed border-gray-200 hover:border-emerald-300 text-gray-700 hover:text-emerald-800 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Family Member</span>
          </button>
        </div>
      )}

      {/* Add Member Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5 border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-emerald-600" />
                Add Family Health Profile
              </h4>
              <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProfile} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Relationship</label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value as FamilyProfile["relationship"])}
                    className="w-full border border-gray-200 rounded-xl px-2.5 py-2 text-xs bg-white"
                  >
                    <option value="Self">Self</option>
                    <option value="Father">Father (Elderly)</option>
                    <option value="Mother">Mother (Elderly)</option>
                    <option value="Child">Child (Pediatric)</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Age (Years)</label>
                  <input
                    type="number"
                    placeholder="e.g. 58"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Gender</label>
                  <select
                    value={gender || "Male"}
                    onChange={(e) => setGender(e.target.value as FamilyProfile["gender"])}
                    className="w-full border border-gray-200 rounded-xl px-2.5 py-2 text-xs bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-2.5 py-2 text-xs bg-white"
                  >
                    <option value="O+">O+</option>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                    <option value="O-">O-</option>
                    <option value="A-">A-</option>
                    <option value="B-">B-</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">
                  Chronic Health Conditions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Type 2 Diabetes, Hypertension"
                  value={chronicConditions}
                  onChange={(e) => setChronicConditions(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Known Allergies (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Penicillin, Peanuts"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              {/* Consent Notice */}
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-2 text-[11px] text-emerald-900">
                <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <label className="cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentGranted}
                    onChange={(e) => setConsentGranted(e.target.checked)}
                    className="mr-1.5 accent-emerald-600"
                  />
                  I confirm consent to record and manage health guidance for this family member securely.
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !consentGranted}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Create Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
