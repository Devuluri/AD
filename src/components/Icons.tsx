import React from "react";

// Vaidya Sahay Logo Icon: Green heart with ECG cardiogram waveform
export const BrandLogoIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="40" height="40" rx="10" fill="#059669" />
    <path
      d="M20 32C20 32 8 24.5 8 16C8 12.5 10.5 10 14 10C16.5 10 18.7 11.3 20 13C21.3 11.3 23.5 10 26 10C29.5 10 32 12.5 32 16C32 24.5 20 32 20 32Z"
      fill="white"
      fillOpacity="0.18"
    />
    <path
      d="M10 20.5H15L17.5 14L21.5 27L24 18.5L26 22.5L27.5 20.5H30"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Cute Green AI Robot Avatar matching reference image
export const AIRobotAvatar: React.FC<{ className?: string }> = ({ className = "w-9 h-9" }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Circle Container */}
    <circle cx="24" cy="24" r="24" fill="#e6f4ea" />
    {/* Robot Head */}
    <rect x="11" y="15" width="26" height="21" rx="8" fill="#10b981" />
    <rect x="13" y="17" width="22" height="17" rx="6" fill="#059669" />
    {/* Antenna */}
    <rect x="23" y="9" width="2" height="6" fill="#047857" />
    <circle cx="24" cy="8" r="3" fill="#34d399" />
    {/* Ears / Headset */}
    <rect x="8" y="21" width="3" height="9" rx="1.5" fill="#047857" />
    <rect x="37" y="21" width="3" height="9" rx="1.5" fill="#047857" />
    {/* Screen / Visor */}
    <rect x="15" y="19" width="18" height="11" rx="4" fill="#022c22" />
    {/* Glowing Eyes */}
    <circle cx="19" cy="24.5" r="2.2" fill="#34d399" />
    <circle cx="29" cy="24.5" r="2.2" fill="#34d399" />
    {/* Subtle Eye Highlights */}
    <circle cx="18.5" cy="23.8" r="0.7" fill="white" />
    <circle cx="28.5" cy="23.8" r="0.7" fill="white" />
    {/* Friendly Smile */}
    <path
      d="M21 27.5C22 28.5 26 28.5 27 27.5"
      stroke="#34d399"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    {/* Stethoscope emblem on chest base */}
    <circle cx="24" cy="38" r="2.5" fill="#059669" />
  </svg>
);

// Friendly User Avatar (matching reference image)
export const UserAvatar: React.FC<{ className?: string }> = ({ className = "w-9 h-9" }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Circle Container with soft mint background */}
    <circle cx="24" cy="24" r="24" fill="#d1fae5" />
    {/* Shirt / Shoulders */}
    <path
      d="M10 44C10 36.5 16 34 24 34C32 34 38 36.5 38 44"
      fill="#10b981"
    />
    <path
      d="M21 34L24 37L27 34"
      stroke="#047857"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Neck */}
    <rect x="21" y="27" width="6" height="8" rx="2" fill="#fcd34d" />
    {/* Face */}
    <circle cx="24" cy="20" r="9" fill="#fcd34d" />
    {/* Hair */}
    <path
      d="M15 19C15 14 18.5 11 24 11C29.5 11 33 14 33 19C33 16 31 13 24 13C17 13 15 16 15 19Z"
      fill="#475569"
    />
    <path
      d="M15 18C16 15 19 13 24 13C27 13 31 14 33 17"
      stroke="#334155"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Eyes */}
    <circle cx="21" cy="20" r="1.2" fill="#334155" />
    <circle cx="27" cy="20" r="1.2" fill="#334155" />
    {/* Smile */}
    <path
      d="M22 23.5C23 24.5 25 24.5 26 23.5"
      stroke="#b45309"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

// Green Double Checkmarks for read/delivered status
export const DoubleCheckIcon: React.FC<{ className?: string }> = ({ className = "w-3.5 h-3.5 text-emerald-600" }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M1.5 8.5L4.5 11.5L10.5 4.5"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.5 8.5L9 11.5L15 4.5"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
