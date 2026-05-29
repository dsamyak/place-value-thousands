import React, { useState, useEffect } from 'react';
import { Mascot } from '../shared/Mascot';
import { ValueCard } from '../shared/ValueCard';
import { NumberPad } from '../shared/NumberPad';
import { FeedbackOverlay } from '../shared/FeedbackOverlay';
import { randomFourDigit, toExpandedForm, toExpandedString } from '../../utils/placeValueMath';
import { shuffle } from '../../utils/shuffle';
import { useAudio } from '../../hooks/useAudio';
import { useDragDrop } from '../../hooks/useDragDrop';

export function ExpandItStation({ dispatch, state }) {
  const [targetNumber, setTargetNumber] = useState(null);
  const [mode, setMode] = useState('forward'); // forward | reverse
  const [round, setRound] = useState(0);
  
  // Forward state
  const [slots, setSlots] = useState(['', '', '', '']); // TH, H, T, O values
  const [cardBank, setCardBank] = useState([]);
  
  // Reverse state
  const [padValue, setPadValue] = useState('');
  
  const [feedback, setFeedback] = useState(null);
  const { speak } = useAudio(state.audioEnabled);

  useEffect(() => {
    // 60% forward, 40% reverse roughly over 4 rounds. Let's strictly interleave.
    const isForward = round % 2 === 0;
    setMode(isForward ? 'forward' : 'reverse');
    
    // Round 2 guarantee zero
    const hasZero = round === 2;
    const num = randomFourDigit({ minZeros: hasZero ? 1 : 0, maxZeros: hasZero ? 2 : 0 });
    setTargetNumber(num);
    
    if (isForward) {
      setSlots(['', '', '', '']);
      const correctParts = toExpandedForm(num);
      // add 4 distractors
      const distractors = [correctParts[0]-1000>0?correctParts[0]-1000:9000, correctParts[1]+100, correctParts[2]===0?10:0, correctParts[3]===5?6:5];
      setCardBank(shuffle([...correctParts, ...distractors].map(String)));
    } else {
      setPadValue('');
    }

    if (round === 0) {
      speak("Time to Expand It! Drag the value cards to build the expanded form of the number.");
    }
  }, [round]);

  const handleDrop = (itemData, zone) => {
    if (!itemData.value) return;
    const idx = parseInt(zone, 10);
    setSlots(prev => {
      const newSlots = [...prev];
      newSlots[idx] = itemData.value;
      return newSlots;
    });
  };

  const handleCheckForward = () => {
    const correctParts = toExpandedForm(targetNumber).map(String);
    const isCorrect = slots.every((v, i) => String(v) === correctParts[i]);
    
    if (isCorrect) {
      speak("Excellent! That is the correct value!");
      setFeedback({ isCorrect: true, message: `Perfect! ${toExpandedString(targetNumber)} = ${targetNumber}` });
    } else {
      speak("Almost there! Remember to check the place carefully.");
      setFeedback({ isCorrect: false, message: "Make sure each card is in the right place." });
    }
  };

  const handleCheckReverse = (val) => {
    if (String(val) === String(targetNumber)) {
      speak("Excellent! That is the correct value!");
      setFeedback({ isCorrect: true, message: "You got it!" });
    } else {
      speak("Almost there! Remember to check the place carefully.");
      setFeedback({ isCorrect: false, message: "Try again!" });
    }
  };

  const handleFeedbackComplete = () => {
    const wasCorrect = feedback?.isCorrect;
    setFeedback(null);
    if (wasCorrect) {
      if (round < 3) {
        setRound(r => r + 1);
      } else {
        dispatch({ type: 'COMPLETE_SIM_STATION', payload: 2 });
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
      
      <Mascot mood="idle" className="w-20 h-20 mb-4" />

      {mode === 'forward' ? (
        <div className="w-full max-w-4xl flex flex-col items-center">
          <div className="text-5xl font-mono font-bold text-white mb-10 drop-shadow-lg">
            {targetNumber.toLocaleString()}
          </div>
          
          {/* Slots */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            {[0,1,2,3].map(i => (
              <React.Fragment key={i}>
                <div 
                  className={`w-28 h-16 rounded-xl border-2 flex items-center justify-center text-xl font-mono font-bold transition-colors ${slots[i] ? 'bg-bgCard border-accentPrimary text-white' : 'border-dashed border-slate-600 bg-bgPrimary text-slate-500'}`}
                  data-dropzone={i}
                >
                  {slots[i] ? Number(slots[i]).toLocaleString() : '____'}
                </div>
                {i < 3 && <div className="text-3xl font-bold text-slate-400">+</div>}
              </React.Fragment>
            ))}
          </div>

          <button 
            onClick={handleCheckForward}
            className="mb-8 px-8 py-3 rounded-full bg-accentPrimary hover:bg-accentHover text-white font-bold shadow-lg transition-all active:scale-95 text-lg"
          >
            Confirm
          </button>

          {/* Card Bank */}
          <div className="bg-bgCard border border-borderSubtle rounded-xl p-6 w-full">
            <h3 className="text-slate-400 font-bold mb-4 uppercase text-sm tracking-wider">Value Cards</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {cardBank.map((val, i) => (
                <ValueCard key={i} value={val} isDraggable={true} />
              ))}
            </div>
          </div>
          
          <DropHandlerReceiver onDrop={handleDrop} />
        </div>
      ) : (
        <div className="w-full max-w-3xl flex flex-col items-center">
          <div className="bg-bgCard p-6 rounded-2xl border-2 border-accentSecondary mb-8 text-center w-full">
            <h3 className="text-slate-400 font-bold mb-2 uppercase text-sm tracking-wider">What number is this?</h3>
            <div className="text-3xl sm:text-4xl font-mono font-bold text-white tracking-widest break-words">
              {toExpandedString(targetNumber)}
            </div>
          </div>
          
          <NumberPad 
            onUpdate={setPadValue} 
            onSubmit={handleCheckReverse}
            maxLength={4}
          />
        </div>
      )}
    </div>
  );
}

// Invisible receiver for drag-drop events
function DropHandlerReceiver({ onDrop }) {
  useDragDrop({ onDrop });
  return null;
}
