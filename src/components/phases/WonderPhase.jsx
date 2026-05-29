import React, { useState, useEffect } from 'react';
import { Mascot } from '../shared/Mascot';
import { useAudio } from '../../hooks/useAudio';

export function WonderPhase({ dispatch, state }) {
  const [stage, setStage] = useState('loading'); // loading -> animating -> complete
  const [displayedScore, setDisplayedScore] = useState(0);
  const targetScore = 6248;
  const { speak } = useAudio(state.audioEnabled);

  useEffect(() => {
    let unmounted = false;
    
    const sequence = async () => {
      // Stage 1
      await speak("John just won a video game championship! His score was six thousand, two hundred and forty-eight points. But what does that number actually mean?");
      if (unmounted) return;
      setStage('animating');
      
      // Stage 2: animate score
      let start = 0;
      const duration = 2000; 
      const startMs = Date.now();
      const step = () => {
        if (unmounted) return;
        const progress = Math.min((Date.now() - startMs) / duration, 1);
        const current = Math.floor(progress * targetScore);
        setDisplayedScore(current);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setDisplayedScore(targetScore);
          setTimeout(() => {
            if (!unmounted) setStage('complete');
          }, 1000);
        }
      };
      requestAnimationFrame(step);
    };

    sequence();
    return () => { unmounted = true; };
  }, []);

  useEffect(() => {
    if (stage === 'complete') {
      speak("What do those four digits really tell us? Let's find out!");
    }
  }, [stage]);

  const digits = String(displayedScore).padStart(4, '0').split('');

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center phase-enter-active">
      <div className="flex flex-col items-center">
        {stage === 'loading' ? (
          <Mascot mood="thinking" className="w-40 h-40 mb-8" />
        ) : (
          <Mascot mood="happy" className="w-40 h-40 mb-8" />
        )}
        
        <div className="glass-card p-8 mb-8 w-full max-w-lg">
          <div className="text-slate-400 font-bold tracking-widest uppercase mb-4 text-sm">John's Final Score</div>
          <div className="flex gap-4 justify-center">
            {digits.map((d, i) => {
              // Only color them when complete
              let color = "bg-slate-800 text-white";
              if (stage === 'complete' && displayedScore === targetScore) {
                if (i === 0) color = "bg-pvThousandsBg text-pvThousands border-pvThousands";
                if (i === 1) color = "bg-pvHundredsBg text-pvHundreds border-pvHundreds";
                if (i === 2) color = "bg-pvTensBg text-pvTens border-pvTens";
                if (i === 3) color = "bg-pvOnesBg text-pvOnes border-pvOnes";
              }
              return (
                <div key={i} className={`w-16 h-20 sm:w-20 sm:h-24 flex items-center justify-center rounded-lg border-2 font-mono text-4xl sm:text-5xl font-bold transition-colors duration-1000 ${color} shadow-inner`}>
                  {d}
                </div>
              );
            })}
          </div>
        </div>

        {stage === 'complete' && (
          <button 
            onClick={() => dispatch({ type: 'SET_PHASE', payload: 'story' })}
            className="mt-4 animate-[digitFlyIn_0.5s_ease-out] btn-primary"
          >
            START THE STORY →
          </button>
        )}
      </div>
    </div>
  );
}
