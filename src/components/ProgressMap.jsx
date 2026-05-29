import React from 'react';

const phases = [
  { id: 'intro', label: 'Intro' },
  { id: 'wonder', label: 'Wonder' },
  { id: 'story', label: 'Story' },
  { id: 'simulate', label: 'Simulate' },
  { id: 'play', label: 'Play' },
  { id: 'reflect', label: 'Reflect' },
];

export function ProgressMap({ currentPhase }) {
  const currentIndex = phases.findIndex(p => p.id === currentPhase);

  return (
    <div className="w-full fixed top-0 left-0 right-0 h-14 bg-bgPrimary/90 backdrop-blur-md border-b border-borderSubtle z-40 flex items-center justify-center px-4">
      <div className="flex items-center gap-4 sm:gap-8 max-w-3xl w-full justify-between">
        {phases.map((phase, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isUpcoming = idx > currentIndex;

          let dotClass = "w-4 h-4 rounded-full transition-all duration-300";
          if (isCompleted) dotClass += " bg-colorSuccess";
          if (isCurrent) dotClass += " bg-accentPrimary animate-[pulseBorder_2s_infinite] scale-125";
          if (isUpcoming) dotClass += " bg-slate-600";

          return (
            <div key={phase.id} className="flex flex-col items-center flex-1 relative group" aria-label={`Phase ${idx + 1}: ${phase.label}`}>
              {/* Connection Line */}
              {idx < phases.length - 1 && (
                <div 
                  className={`absolute top-2 left-[50%] right-[-50%] h-[2px] -z-10 ${isCompleted ? 'bg-colorSuccess' : 'bg-slate-700'}`}
                  style={{ width: '100%' }}
                />
              )}
              <div className={dotClass} />
              <div className="hidden sm:block absolute top-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-white transition-colors">
                {phase.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
