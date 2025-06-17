
import React from "react";

export default function BuddhaAnimation() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="relative">
        {/* Buddha silhouette with breathing animation */}
        <div className="w-32 h-32 bg-gradient-to-b from-sky-100 to-blue-100 rounded-full animate-pulse shadow-inner">
          <svg
            className="w-full h-full text-sky-600/80 opacity-90"
            fill="currentColor"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Simple Buddha silhouette */}
            <circle cx="50" cy="30" r="12" />
            <ellipse cx="50" cy="55" rx="18" ry="25" />
            <circle cx="45" cy="28" r="1.5" />
            <circle cx="55" cy="28" r="1.5" />
            <path d="M 45 32 Q 50 35 55 32" stroke="currentColor" strokeWidth="1" fill="none" />
          </svg>
        </div>
        
        {/* Floating particles around Buddha */}
        <div className="absolute -top-2 -left-2 w-2 h-2 bg-sky-300/60 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="absolute -top-1 -right-3 w-1.5 h-1.5 bg-blue-300/60 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-2 -left-3 w-1 h-1 bg-sky-200/60 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-1 -right-2 w-2 h-2 bg-blue-200/60 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
      </div>
    </div>
  );
}
