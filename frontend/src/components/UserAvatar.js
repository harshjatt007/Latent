import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config/api";

const UserAvatar = ({ user, name: propName, size = "h-10 w-10", textClass = "text-xs" }) => {
  const name = propName || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.email || "User";
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Fallback initials and color
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const colorMap = {
    blue: "#3b82f6",
    purple: "#a855f7",
    indigo: "#6366f1",
    rose: "#f43f5e",
    emerald: "#10b981",
    amber: "#f59e0b",
    sky: "#0ea5e9",
    violet: "#8b5cf6",
  };
  const colorKeys = Object.keys(colorMap);
  const charCodeSum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const bgColorValue = colorMap[colorKeys[charCodeSum % colorKeys.length]];

  const hasAvatar = user?.avatar && user.avatar.trim() !== "";

  return (
    <div className={`${size} relative rounded-full overflow-hidden border-2 border-white dark:border-gray-800 shadow-sm transition-transform cursor-pointer group`}>
      {/* Layer 1: Initials (Always visible instantly) */}
      <div 
        className={`absolute inset-0 w-full h-full flex items-center justify-center text-white font-black ${textClass} tracking-tighter`}
        style={{ backgroundColor: bgColorValue }}
      >
        {initials}
      </div>

      {/* Layer 2: Profile Picture (Loads on top) */}
      {hasAvatar && !imgError && (
        <img
          src={user.avatar.startsWith("http") ? user.avatar : `${API_BASE_URL}/${user.avatar}`}
          alt={name}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
        />
      )}
      
      {/* Decorative Border for Images */}
      {hasAvatar && imgLoaded && (
        <div className="absolute inset-0 border-2 border-blue-500 rounded-full pointer-events-none" />
      )}
    </div>
  );
};

export default UserAvatar;
