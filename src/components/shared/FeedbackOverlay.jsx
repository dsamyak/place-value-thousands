import React, { useEffect } from 'react';
import { Mascot } from './Mascot';

export function FeedbackOverlay({ isCorrect, message, onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, isCorrect ? 2000 : 2500); // Wait longer for wrong so they read hint
    return () => clearTimeout(timer);
  }, [isCorrect, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm animate-[digitFlyIn_0.2s_ease-out]">
      <div className={`p-8 rounded-2xl flex flex-col items-center max-w-sm text-center shadow-2xl border-4 ${isCorrect ? 'bg-green-900/80 border-colorSuccess' : 'bg-red-900/80 border-colorError'}`}>
        <Mascot mood={isCorrect ? 'celebrate' : 'thinking'} className="w-32 h-32 mb-4" />
        <h2 className={`text-3xl font-display font-bold mb-2 ${isCorrect ? 'text-colorSuccess' : 'text-colorWarning'}`}>
          {isCorrect ? 'Awesome!' : 'Oops!'}
        </h2>
        <p className="text-xl text-white font-body leading-tight">
          {message}
        </p>
      </div>
    </div>
  );
}
