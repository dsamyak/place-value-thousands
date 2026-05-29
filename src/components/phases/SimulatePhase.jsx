import React, { useEffect, useState } from 'react';
import { BuildNumberStation } from '../simulations/BuildNumberStation';
import { DetectiveStation } from '../simulations/DetectiveStation';
import { ExpandItStation } from '../simulations/ExpandItStation';
import { useAudio } from '../../hooks/useAudio';

export function SimulatePhase({ dispatch, state }) {
  const { currentSimStation, simStationsComplete } = state;
  const { speak } = useAudio(state.audioEnabled);
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    if (simStationsComplete.every(v => v === true)) {
      setShowContinue(true);
      speak("Great job completing all three stations! Now let's play and practice what you've learned!");
    }
  }, [simStationsComplete]);

  const renderStation = () => {
    switch (currentSimStation) {
      case 0: return <BuildNumberStation dispatch={dispatch} state={state} />;
      case 1: return <DetectiveStation dispatch={dispatch} state={state} />;
      case 2: return <ExpandItStation dispatch={dispatch} state={state} />;
      default: return null;
    }
  };

  const tabs = [
    { id: 0, label: 'Build Number' },
    { id: 1, label: 'Detective' },
    { id: 2, label: 'Expand It' },
  ];

  return (
    <div className="flex flex-col items-center min-h-[75vh] phase-enter-active pt-4 pb-20">
      
      {/* Station Tabs */}
      <div className="flex gap-2 sm:gap-4 mb-6 w-full max-w-3xl justify-center">
        {tabs.map(tab => {
          const isComplete = simStationsComplete[tab.id];
          const isActive = currentSimStation === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => dispatch({ type: 'SET_SIM_STATION', payload: tab.id })}
              className={`
                px-4 py-2 sm:px-6 sm:py-3 rounded-t-xl sm:rounded-xl font-bold flex items-center gap-2 transition-all
                ${isActive ? 'bg-accentPrimary text-white shadow-lg shadow-indigo-500/30 -translate-y-1' : 'bg-bgCard text-slate-400 hover:text-white'}
                ${isComplete && !isActive ? 'border-b-4 border-colorSuccess' : ''}
              `}
            >
              {tab.label}
              {isComplete && <span className="text-colorSuccess">✓</span>}
            </button>
          );
        })}
      </div>

      {/* Current Station */}
      <div className="w-full max-w-4xl flex-1 flex flex-col items-center">
        {renderStation()}
      </div>

      {/* Continue to Play Button */}
      {showContinue && (
        <div className="fixed bottom-8 left-0 right-0 flex justify-center z-40 animate-[digitFlyIn_0.5s_ease-out]">
          <button
            onClick={() => dispatch({ type: 'SET_PHASE', payload: 'play' })}
            className="btn-primary flex items-center gap-2"
          >
            CONTINUE TO PLAY <span>🎮</span>
          </button>
        </div>
      )}
    </div>
  );
}
