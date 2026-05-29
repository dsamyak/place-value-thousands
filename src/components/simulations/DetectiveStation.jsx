import React, { useState, useEffect } from 'react';
import { Mascot } from '../shared/Mascot';
import { randomFourDigit, getDigitAt, getValueAt } from '../../utils/placeValueMath';
import { useAudio } from '../../hooks/useAudio';

export function DetectiveStation({ dispatch, state }) {
  const [targetNumber, setTargetNumber] = useState(null);
  const [revealed, setRevealed] = useState({ 0: false, 1: false, 2: false, 3: false });
  const [round, setRound] = useState(0);
  const { speak } = useAudio(state.audioEnabled);
  const [activeDigit, setActiveDigit] = useState(null); // index of currently viewed digit

  useEffect(() => {
    let num;
    if (round === 0) num = randomFourDigit({ minZeros: 0, maxZeros: 0 });
    else if (round === 1) num = randomFourDigit({ minZeros: 1, maxZeros: 1 });
    else if (round === 2) num = 1001; // Specific edge case required by PRD
    else num = randomFourDigit({ minZeros: 0, maxZeros: 2 }); // general
    
    setTargetNumber(num);
    setRevealed({ 0: false, 1: false, 2: false, 3: false });
    setActiveDigit(null);

    if (round === 0) {
      speak("You are now a Place Value Detective! Tap each digit to discover its place and value.");
    }
  }, [round]);

  const handleTap = (index) => {
    setRevealed(prev => ({ ...prev, [index]: true }));
    setActiveDigit(index);
    // Determine value to speak
    const pos = ['thousands', 'hundreds', 'tens', 'ones'][index];
    const val = getValueAt(targetNumber, pos);
    speak(`The digit is in the ${pos} place. Its value is ${val}.`);
  };

  const handleNextNumber = () => {
    if (round < 3) {
      setRound(r => r + 1);
    } else {
      speak("Great job completing the Detective station!");
      dispatch({ type: 'COMPLETE_SIM_STATION', payload: 1 });
    }
  };

  if (!targetNumber) return null;

  const digits = String(targetNumber).padStart(4, '0').split('');
  const positions = ['thousands', 'hundreds', 'tens', 'ones'];
  const colors = ['pvThousands', 'pvHundreds', 'pvTens', 'pvOnes'];
  const bgColors = ['pvThousandsBg', 'pvHundredsBg', 'pvTensBg', 'pvOnesBg'];

  const allRevealed = Object.values(revealed).every(v => v);

  return (
    <div className="w-full flex flex-col items-center animate-[digitFlyIn_0.3s_ease-out]">
      <div className="flex flex-col items-center mb-8">
        <Mascot mood="detective" className="w-24 h-24 mb-4" />
        <p className="text-xl text-slate-300 font-bold bg-bgCard px-6 py-2 rounded-full border border-borderSubtle">
          Tap each digit to investigate!
        </p>
      </div>

      <div className="flex gap-4 sm:gap-6 mb-8">
        {digits.map((d, i) => (
          <button
            key={i}
            onClick={() => handleTap(i)}
            className={`
              w-16 h-24 sm:w-24 sm:h-32 flex items-center justify-center rounded-xl border-4 font-mono text-5xl sm:text-6xl font-bold transition-all
              hover:scale-105 active:scale-95 shadow-lg
              ${revealed[i] ? `bg-${bgColors[i]} border-${colors[i]} text-white shadow-${colors[i]}/40` : 'bg-bgCard border-borderSubtle text-slate-400 hover:border-slate-500'}
              ${activeDigit === i ? 'ring-4 ring-white ring-offset-4 ring-offset-bgPrimary' : ''}
            `}
            aria-label={`Digit ${d} at position ${positions[i]}`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Progress Dots */}
      <div className="flex gap-3 mb-8">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`w-3 h-3 rounded-full transition-colors ${revealed[i] ? 'bg-colorSuccess' : 'bg-slate-700'}`} />
        ))}
      </div>

      {/* Answer Panel */}
      <div className="min-h-[120px] w-full max-w-lg flex flex-col items-center justify-center">
        {activeDigit !== null ? (
          <div className="bg-bgCard border-l-4 border-l-accentPrimary w-full p-6 rounded-xl shadow-lg animate-[digitFlyIn_0.2s_ease-out]">
            <p className="text-xl sm:text-2xl mb-2 text-white">
              The digit <span className="font-bold text-accentSecondary">{digits[activeDigit]}</span> is in the <span className="font-bold uppercase" style={{ color: `var(--${colors[activeDigit].replace(/[A-Z]/g, m => "-" + m.toLowerCase())})` }}>{positions[activeDigit]}</span> place.
            </p>
            <p className="text-2xl sm:text-3xl text-white">
              Its VALUE is <span className="font-mono font-bold text-colorSuccess bg-black/30 px-3 py-1 rounded-md">{getValueAt(targetNumber, positions[activeDigit]).toLocaleString()}</span>.
            </p>
          </div>
        ) : (
          <div className="text-slate-500 italic text-lg">Waiting for investigation...</div>
        )}
      </div>

      {allRevealed && (
        <button 
          onClick={handleNextNumber}
          className="mt-8 bg-accentPrimary hover:bg-accentHover text-white font-bold text-xl py-3 px-10 rounded-full shadow-lg transition-all hover:scale-105 animate-bounce"
        >
          {round < 3 ? 'NEXT NUMBER →' : 'FINISH STATION →'}
        </button>
      )}
    </div>
  );
}
