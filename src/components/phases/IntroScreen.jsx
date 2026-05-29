import React, { useEffect } from 'react';
import { Mascot } from '../shared/Mascot';
import { useAudio } from '../../hooks/useAudio';

export function IntroScreen({ dispatch, state }) {
  const { speak } = useAudio(state?.audioEnabled ?? true);

  useEffect(() => {
    // Attempt to auto-play welcome audio
    speak("Hello Explorer! Today we'll unlock the secret of big numbers!")
      .then(() => speak("Get ready to discover thousands, hundreds, tens, and ones!"))
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center phase-enter-active">
      <div className="glass-card p-8 max-w-2xl w-full relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accentPrimary rounded-full blur-[100px] opacity-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accentSecondary rounded-full blur-[100px] opacity-10 pointer-events-none" />

        <Mascot mood="happy" className="mx-auto mb-6 w-32 h-32" />
        
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-4 drop-shadow-md">
          Place Value: <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pvThousands via-pvHundreds to-pvTens">
            Thousands, Hundreds, Tens, Ones
          </span>
        </h1>
        
        <p className="text-xl text-slate-300 mb-10 max-w-lg mx-auto leading-relaxed font-body">
          Hello Explorer! Today we'll unlock the secret of BIG numbers!
        </p>

        <button 
          onClick={() => dispatch({ type: 'SET_PHASE', payload: 'wonder' })}
          className="btn-primary mt-4"
        >
          START EXPLORING →
        </button>
      </div>
    </div>
  );
}
