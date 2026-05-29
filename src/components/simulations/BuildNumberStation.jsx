import React, { useState, useEffect } from 'react';
import { PlaceValueColumn } from '../shared/PlaceValueColumn';
import { BaseTenBlockTray } from '../shared/BaseTenBlockTray';
import { randomFourDigit, getDigitAt, toWordForm } from '../../utils/placeValueMath';
import { useAudio } from '../../hooks/useAudio';
import { Mascot } from '../shared/Mascot';
import { FeedbackOverlay } from '../shared/FeedbackOverlay';

export function BuildNumberStation({ dispatch, state }) {
  const [targetNumber, setTargetNumber] = useState(null);
  const [columns, setColumns] = useState({ thousands: 0, hundreds: 0, tens: 0, ones: 0 });
  const [round, setRound] = useState(0);
  const [feedback, setFeedback] = useState(null); // { isCorrect: bool, message: string }
  const { speak } = useAudio(state.audioEnabled);

  useEffect(() => {
    // Generate target based on round
    let minZ = 0, maxZ = 0, min = 1000, max = 2999;
    if (round === 1) { min = 3000; max = 5999; }
    else if (round === 2) { minZ = 1; maxZ = 1; min = 1000; max = 9999; }
    else if (round >= 3) { minZ = 2; maxZ = 2; min = 1000; max = 9999; }

    const num = randomFourDigit({ minZeros: minZ, maxZeros: maxZ, min, max });
    setTargetNumber(num);
    setColumns({ thousands: 0, hundreds: 0, tens: 0, ones: 0 });
    
    if (round === 0) {
      speak("Welcome to the Build the Number station! Use base-ten blocks to build the number shown.");
    } else {
      speak(`Build the number ${num}`);
    }
  }, [round]);

  const handleDrop = (itemData, zone) => {
    if (itemData.type === zone) {
      setColumns(prev => {
        if (prev[zone] < 9) {
          return { ...prev, [zone]: prev[zone] + 1 };
        }
        return prev;
      });
    }
  };

  const handleCheck = () => {
    const isCorrect = 
      columns.thousands === getDigitAt(targetNumber, 'thousands') &&
      columns.hundreds === getDigitAt(targetNumber, 'hundreds') &&
      columns.tens === getDigitAt(targetNumber, 'tens') &&
      columns.ones === getDigitAt(targetNumber, 'ones');

    if (isCorrect) {
      speak("Amazing! You built it perfectly!");
      setFeedback({ isCorrect: true, message: `You built ${targetNumber}!` });
    } else {
      speak("That's not quite right. Let's try again!");
      setFeedback({ isCorrect: false, message: "Check the number of blocks in each column." });
    }
  };

  const handleFeedbackComplete = () => {
    const wasCorrect = feedback?.isCorrect;
    setFeedback(null);
    if (wasCorrect) {
      if (round < 3) {
        setRound(r => r + 1);
      } else {
        dispatch({ type: 'COMPLETE_SIM_STATION', payload: 0 });
      }
    }
  };

  if (!targetNumber) return null;

  return (
    <div className="w-full flex flex-col items-center animate-[digitFlyIn_0.3s_ease-out]">
      
      {feedback && (
        <FeedbackOverlay 
          isCorrect={feedback.isCorrect} 
          message={feedback.message} 
          onComplete={handleFeedbackComplete} 
        />
      )}

      <div className="flex items-center gap-4 mb-6">
        <Mascot mood="idle" className="w-16 h-16" />
        <div className="bg-bgCard border-2 border-accentPrimary px-6 py-3 rounded-2xl shadow-lg relative">
          <div className="absolute -left-3 top-6 w-3 h-3 bg-bgCard border-l-2 border-b-2 border-accentPrimary rotate-45"></div>
          <span className="text-slate-300 text-lg">Build: </span>
          <span className="text-3xl font-mono font-bold text-white ml-2">{targetNumber.toLocaleString()}</span>
        </div>
      </div>

      {/* Place Value Mat */}
      <div className="flex w-full max-w-3xl bg-bgCard rounded-xl border border-borderSubtle overflow-hidden shadow-xl mb-4 h-[300px]">
        <PlaceValueColumn 
          type="thousands" label="THOUSANDS" 
          count={columns.thousands} target={getDigitAt(targetNumber, 'thousands')}
          colorClass="pv-column-thousands"
        />
        <div className="w-px bg-borderSubtle h-full" />
        <PlaceValueColumn 
          type="hundreds" label="HUNDREDS" 
          count={columns.hundreds} target={getDigitAt(targetNumber, 'hundreds')}
          colorClass="pv-column-hundreds"
        />
        <div className="w-px bg-borderSubtle h-full" />
        <PlaceValueColumn 
          type="tens" label="TENS" 
          count={columns.tens} target={getDigitAt(targetNumber, 'tens')}
          colorClass="pv-column-tens"
        />
        <div className="w-px bg-borderSubtle h-full" />
        <PlaceValueColumn 
          type="ones" label="ONES" 
          count={columns.ones} target={getDigitAt(targetNumber, 'ones')}
          colorClass="pv-column-ones"
        />
      </div>

      <div className="flex gap-4 mb-2">
        <button 
          onClick={() => setColumns({ thousands: 0, hundreds: 0, tens: 0, ones: 0 })}
          className="px-6 py-2 rounded-full border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors"
        >
          Clear Board
        </button>
        <button 
          onClick={handleCheck}
          className="px-8 py-2 rounded-full bg-accentPrimary hover:bg-accentHover text-white font-bold shadow-lg transition-all active:scale-95"
        >
          Check!
        </button>
      </div>

      {/* The tray automatically connects to our useDragDrop hook via handlePointerDown */}
      <BaseTenBlockTray />
      
      {/* Global drop handler receiver (hidden overlay approach or just handled at document level) */}
      <DropHandlerReceiver onDrop={handleDrop} />
    </div>
  );
}

// Invisible receiver for drag-drop events
import { useDragDrop } from '../../hooks/useDragDrop';
function DropHandlerReceiver({ onDrop }) {
  // We call useDragDrop here to get the onDrop attached to the window listeners properly in this context
  useDragDrop({ onDrop });
  return null;
}
