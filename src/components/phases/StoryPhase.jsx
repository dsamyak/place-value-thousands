import React, { useEffect, useState } from 'react';
import { storyPanels } from '../../data/storyContent';
import { PlaceValueChart } from '../shared/PlaceValueChart';
import { useAudio } from '../../hooks/useAudio';

export function StoryPhase({ dispatch, state }) {
  const panelIndex = state.storyPanel;
  const panel = storyPanels[panelIndex];
  const { speak } = useAudio(state.audioEnabled);
  const [audioPlaying, setAudioPlaying] = useState(false);

  useEffect(() => {
    let unmounted = false;
    setAudioPlaying(true);
    
    // Slight delay for animation entry before speaking
    const timer = setTimeout(() => {
      speak(panel.narrationScript).then(() => {
        if (!unmounted) setAudioPlaying(false);
      });
    }, 500);
    
    // Safety fallback
    const fallback = setTimeout(() => {
      if (!unmounted) setAudioPlaying(false);
    }, 4000);

    return () => { 
      unmounted = true; 
      clearTimeout(timer);
      clearTimeout(fallback);
    };
  }, [panelIndex]);

  const handleNext = () => {
    dispatch({ type: 'NEXT_STORY_PANEL' });
  };

  const createMarkup = (html) => ({ __html: html });

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] phase-enter-active pb-20">
      <div className="glass-card w-full max-w-3xl p-6 sm:p-8 relative overflow-hidden">
        
        {/* Progress indicator */}
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
          <div 
            className="h-full bg-accentSecondary transition-all duration-500" 
            style={{ width: `${((panelIndex + 1) / storyPanels.length) * 100}%` }}
          />
        </div>

        <h2 className="text-2xl sm:text-3xl font-display font-bold text-accentPrimary mb-6 mt-2">
          {panel.title}
        </h2>

        {/* Visual Section */}
        <div className="bg-bgPrimary rounded-xl p-6 flex items-center justify-center min-h-[220px] mb-8 border border-borderSubtle overflow-hidden relative">
          
          {panel.index === 0 && (
            <div className="text-center animate-[digitFlyIn_0.5s_ease-out]">
              <div className="text-6xl font-mono text-yellow-300 drop-shadow-[0_0_20px_rgba(253,224,71,0.5)] font-bold">3,472</div>
              <div className="mt-4 text-slate-400 text-sm tracking-widest uppercase">The Number Museum</div>
            </div>
          )}

          {panel.index > 0 && (
            <div className="w-full flex justify-center animate-[digitFlyIn_0.5s_ease-out]">
              <PlaceValueChart 
                th={panel.pvChartState.th} 
                h={panel.pvChartState.h} 
                t={panel.pvChartState.t} 
                o={panel.pvChartState.o} 
              />
            </div>
          )}

          {panel.index === 5 && (
            <div className="absolute top-4 right-4 text-4xl animate-bounce">🎉</div>
          )}
        </div>

        {/* Text Section */}
        <div className="text-lg sm:text-xl text-slate-200 font-body leading-relaxed min-h-[120px]">
          <p dangerouslySetInnerHTML={createMarkup(panel.screenText)} />
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button 
            onClick={() => {
              if (panelIndex > 0) dispatch({ type: 'RESTORE_STATE', payload: { ...state, storyPanel: panelIndex - 1 } });
            }}
            className={`px-6 py-3 rounded-full text-slate-400 hover:text-white font-bold transition-colors ${panelIndex === 0 ? 'invisible' : ''}`}
          >
            ← Back
          </button>
          
          <button 
            onClick={handleNext}
            disabled={audioPlaying}
            className={`btn-primary ${
              audioPlaying 
                ? 'opacity-50 cursor-not-allowed grayscale' 
                : ''
            }`}
          >
            {panelIndex === storyPanels.length - 1 ? 'GO TO SIMULATION →' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}
