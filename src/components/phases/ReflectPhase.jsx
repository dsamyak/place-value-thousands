import React, { useEffect, useState } from 'react';
import { Mascot } from '../shared/Mascot';
import { useAudio } from '../../hooks/useAudio';
import { BADGE_DEFINITIONS } from '../../utils/badgeEngine';

export function ReflectPhase({ state }) {
  const { totalXP, maxStreak, badgesEarned, worldScores, audioEnabled } = state;
  const { speak } = useAudio(audioEnabled);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    speak("Wonderful work today, Explorer! You have mastered place value! Let's look at your achievements.");
    const timer = setTimeout(() => setShowSummary(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const totalStars = worldScores.reduce((sum, w) => sum + (w?.stars || 0), 0);
  const totalCorrect = state.answerHistory.filter(a => a.correct).length;
  const accuracy = state.answerHistory.length > 0 
    ? Math.round((totalCorrect / state.answerHistory.length) * 100) 
    : 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] pb-20 phase-enter-active">
      <Mascot mood="celebrate" className="w-32 h-32 mb-6" />
      
      <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-2 text-center drop-shadow-md">
        Module Complete!
      </h1>
      <p className="text-xl text-accentSecondary mb-10 font-body">
        You are now a Master of Place Value!
      </p>

      {showSummary && (
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          
          {/* Stats Panel */}
          <div className="glass-card p-6 sm:p-8 flex flex-col items-center">
            <h3 className="text-2xl font-bold text-white mb-6 uppercase tracking-widest border-b border-slate-700 pb-4 w-full text-center">Your Stats</h3>
            
            <div className="grid grid-cols-2 gap-4 w-full">
              <StatBox label="Total XP" value={totalXP} icon="⭐" color="text-yellow-400" />
              <StatBox label="Stars" value={`${totalStars}/30`} icon="🌟" color="text-yellow-400" />
              <StatBox label="Best Streak" value={maxStreak} icon="🔥" color="text-colorXp" />
              <StatBox label="Accuracy" value={`${accuracy}%`} icon="🎯" color="text-colorSuccess" />
            </div>
          </div>

          {/* Badges Panel */}
          <div className="glass-card p-6 sm:p-8 flex flex-col items-center">
            <h3 className="text-2xl font-bold text-white mb-6 uppercase tracking-widest border-b border-slate-700 pb-4 w-full text-center">Badges Earned</h3>
            
            {badgesEarned.length === 0 ? (
              <div className="text-slate-500 italic text-center flex-1 flex items-center justify-center">
                Keep practicing to earn badges!
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4 w-full max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {badgesEarned.map(id => {
                  const badge = BADGE_DEFINITIONS.find(b => b.id === id);
                  if (!badge) return null;
                  return (
                    <div key={id} className="flex flex-col items-center p-3 bg-slate-800 rounded-xl border border-slate-700 text-center group relative cursor-help">
                      <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{badge.icon}</div>
                      <div className="text-xs font-bold text-slate-300 leading-tight">{badge.name}</div>
                      {/* Tooltip */}
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 bg-black text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        {badge.description}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {showSummary && (
        <button 
          onClick={() => window.location.reload()}
          className="btn-primary mt-12"
        >
          Restart Module
        </button>
      )}
    </div>
  );
}

function StatBox({ label, value, icon, color }) {
  return (
    <div className="bg-slate-800 p-4 rounded-xl flex flex-col items-center justify-center border border-slate-700">
      <div className="text-2xl mb-1">{icon}</div>
      <div className={`text-2xl font-mono font-bold ${color}`}>{value}</div>
      <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}
