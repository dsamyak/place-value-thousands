import React from 'react';

export function BaseTenBlock({ type, className = '', ...props }) {
  const getBlock = () => {
    switch (type) {
      case 'thousands':
        return (
          <svg viewBox="0 0 50 50" className={`w-12 h-12 ${className}`} {...props}>
            <rect x="5" y="10" width="35" height="35" fill="var(--pv-thousands)" stroke="#3b0764" strokeWidth="1" />
            <polygon points="5,10 15,2 50,2 40,10" fill="#c084fc" stroke="#3b0764" strokeWidth="1" />
            <polygon points="40,10 50,2 50,37 40,45" fill="#7e22ce" stroke="#3b0764" strokeWidth="1" />
            <text x="22" y="32" fontSize="10" fill="#fff" textAnchor="middle" fontWeight="bold">1000</text>
          </svg>
        );
      case 'hundreds':
        return (
          <svg viewBox="0 0 50 50" className={`w-12 h-12 ${className}`} {...props}>
            <rect x="2" y="2" width="46" height="46" fill="var(--pv-hundreds)" stroke="#1e3a8a" strokeWidth="1" />
            {/* simple grid lines */}
            <path d="M12 2v46 M22 2v46 M32 2v46 M42 2v46" stroke="#60a5fa" strokeWidth="0.5" />
            <path d="M2 12h46 M2 22h46 M2 32h46 M2 42h46" stroke="#60a5fa" strokeWidth="0.5" />
            <text x="25" y="28" fontSize="12" fill="#fff" textAnchor="middle" fontWeight="bold" className="drop-shadow-md">100</text>
          </svg>
        );
      case 'tens':
        return (
          <svg viewBox="0 0 15 50" className={`w-4 h-12 ${className}`} {...props}>
            <rect x="1" y="1" width="13" height="48" fill="var(--pv-tens)" stroke="#14532d" strokeWidth="1" />
            <path d="M1 10h13 M1 20h13 M1 30h13 M1 40h13" stroke="#4ade80" strokeWidth="0.5" />
            <text x="7.5" y="28" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="bold" transform="rotate(-90 7.5 28)">10</text>
          </svg>
        );
      case 'ones':
        return (
          <svg viewBox="0 0 15 15" className={`w-4 h-4 ${className}`} {...props}>
            <rect x="1" y="1" width="13" height="13" fill="var(--pv-ones)" stroke="#431407" strokeWidth="1" />
            <text x="7.5" y="10" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="bold">1</text>
          </svg>
        );
      default:
        return null;
    }
  };

  return getBlock();
}
