import React from 'react';

// A simple blocky robot mascot SVG
export function Mascot({ mood = 'idle', className = '' }) {
  // moods: idle, happy, thinking, celebrate, detective
  
  let eyeColor = "#f1f5f9";
  let mouthPath = "M 35 60 Q 50 65 65 60";
  let animationClass = "animate-[mascotIdle_3s_ease-in-out_infinite]";
  let extraElements = null;

  switch (mood) {
    case 'happy':
    case 'celebrate':
      eyeColor = "#4ade80";
      mouthPath = "M 35 60 Q 50 75 65 60";
      if (mood === 'celebrate') {
        animationClass = "animate-bounce";
      }
      break;
    case 'thinking':
      eyeColor = "#fbbf24";
      mouthPath = "M 35 65 Q 50 65 65 65";
      extraElements = <text x="75" y="25" fontSize="20" fill="#fbbf24">?</text>;
      break;
    case 'detective':
      eyeColor = "#22d3ee";
      mouthPath = "M 35 65 Q 50 60 65 65";
      extraElements = (
        <path d="M 10 10 C 50 -10, 90 10, 90 20 L 10 20 Z" fill="#334155" />
      );
      break;
    default:
      break;
  }

  return (
    <svg viewBox="0 0 100 100" className={`w-24 h-24 ${animationClass} ${className}`} aria-label={`Mascot ${mood}`}>
      {/* Body */}
      <rect x="20" y="20" width="60" height="70" rx="15" fill="#6366f1" />
      {/* Screen */}
      <rect x="25" y="30" width="50" height="40" rx="5" fill="#0f172a" />
      {/* Eyes */}
      <circle cx="35" cy="45" r="5" fill={eyeColor} />
      <circle cx="65" cy="45" r="5" fill={eyeColor} />
      {/* Mouth */}
      <path d={mouthPath} stroke={eyeColor} strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Antenna */}
      <line x1="50" y1="20" x2="50" y2="5" stroke="#94a3b8" strokeWidth="4" />
      <circle cx="50" cy="5" r="5" fill="#f87171" />
      {extraElements}
    </svg>
  );
}
