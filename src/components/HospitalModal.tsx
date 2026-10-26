"use client";

import React, { useState } from "react";
import { X, MapPin, Phone, AlertCircle, Search, ShieldCheck } from "lucide-react";
import { MOCK_HOSPITALS, EMERGENCY_HOTLINES } from "@/data/mockHospitals";

interface HospitalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HospitalModal: React.FC<HospitalModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  const filteredHospitals = MOCK_HOSPITALS.filter(
    (h) =>
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800">
                Find Hospitals & Emergency Centers
              </h3>
              <p className="text-xs text-gray-500">
                Verified 24/7 emergency facilities near you
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

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by hospital name, specialty, or area..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs text-gray-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Emergency Hotlines Strip */}
          <div className="bg-red-50/80 border border-red-100 rounded-xl p-3.5">
            <h4 className="text-xs font-bold text-red-700 flex items-center gap-1.5 mb-2">
              <AlertCircle className="w-4 h-4" />
              National Emergency Hotlines
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {EMERGENCY_HOTLINES.slice(0, 3).map((hotline, idx) => (
                <a
                  key={idx}
                  href={`tel:${hotline.number}`}
                  className="bg-white/90 hover:bg-white border border-red-200/70 rounded-lg p-2 flex flex-col transition-all text-left"
                >
                  <span className="text-[10px] text-gray-500 font-medium">
                    {hotline.name}
                  </span>
                  <span className="text-sm font-bold text-red-600 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {hotline.number}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Hospitals List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Nearby Hospitals ({filteredHospitals.length})
            </h4>

            {filteredHospitals.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-6">
                No hospitals found matching your search.
              </p>
            ) : (
              filteredHospitals.map((hosp) => (
                <div
                  key={hosp.id}
                  className="border border-gray-100 rounded-xl p-3.5 hover:border-emerald-200 hover:shadow-xs transition-all bg-white"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs font-bold text-gray-800">
                          {hosp.name}
                        </h5>
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-100">
                          {hosp.distance}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {hosp.address}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                      ★ {hosp.rating}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 mt-2 border-t border-gray-50">
                    <div className="flex items-center gap-2 text-[10px] text-emerald-700 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{hosp.type}</span>
                      {hosp.open247 && (
                        <span className="text-gray-400">• 24/7 Emergency</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${hosp.phone}`}
                        className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <Phone className="w-3 h-3" />
                        Call
                      </a>
                      <a
                        href={`tel:${hosp.emergencyPhone}`}
                        className="text-xs font-semibold text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg flex items-center gap-1 transition-colors"
                      >
                        Emergency: {hosp.emergencyPhone}
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
          <span>In critical life-threatening emergencies, dial 112 immediately.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-gray-200 hover:bg-gray-300 font-medium text-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
