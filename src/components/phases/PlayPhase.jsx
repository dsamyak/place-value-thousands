import React, { useState, useEffect, useRef } from 'react';
import { Mascot } from '../shared/Mascot';
import { NumberPad } from '../shared/NumberPad';
import { calculateXP, calculateStars } from '../../utils/scoring';
import { WORLD_CONFIG } from '../../data/worldConfig';
import { useAudio } from '../../hooks/useAudio';
import { FeedbackOverlay } from '../shared/FeedbackOverlay';
import { BaseTenBlockTray } from '../shared/BaseTenBlockTray';
import { PlaceValueColumn } from '../shared/PlaceValueColumn';
import { useDragDrop } from '../../hooks/useDragDrop';

export function PlayPhase({ dispatch, state }) {
  const { questionSet, currentQuestion, currentWorld, worldScores, audioEnabled } = state;
  const world = WORLD_CONFIG[currentWorld];
  const q = questionSet[currentQuestion];
  
  const [startTime, setStartTime] = useState(Date.now());
  const [hintsUsed, setHintsUsed] = useState(0);
  const [feedback, setFeedback] = useState(null);
  
  // Custom states for specific question types
  const [padValue, setPadValue] = useState('');
  const [columns, setColumns] = useState({ thousands: 0, hundreds: 0, tens: 0, ones: 0 });

  const { speak } = useAudio(audioEnabled);
  
  // Timer for challenge mode
  const [timeLeft, setTimeLeft] = useState(world?.timeLimit || null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!q) return;
    setStartTime(Date.now());
    setHintsUsed(0);
    setFeedback(null);
    setPadValue('');
    setColumns({ thousands: 0, hundreds: 0, tens: 0, ones: 0 });
    
    if (world.timeLimit) {
      setTimeLeft(world.timeLimit);
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            handleTimeUp();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(timerRef.current);
  }, [currentQuestion]);

  const handleTimeUp = () => {
    setFeedback({ isCorrect: false, message: "Time's up!" });
    submitAnswer(false);
  };

  const handleHint = () => {
    setHintsUsed(h => h + 1);
    // basic hint logic, just speak the explanation
    speak(q.explanation);
  };

  const submitAnswer = (isCorrect) => {
    clearInterval(timerRef.current);
    const timeMs = Date.now() - startTime;
    const xpEarned = calculateXP({ correct: isCorrect, hintsUsed, streak: state.streak });
    
    if (isCorrect) {
      speak("Correct!");
      setFeedback({ isCorrect: true, message: `Awesome! +${xpEarned} XP` });
    } else {
      speak(`Not quite. ${q.explanation}`);
      setFeedback({ isCorrect: false, message: q.explanation });
    }

    dispatch({
      type: 'ANSWER_QUESTION',
      payload: { correct: isCorrect, timeMs, xpEarned, hasZero: q.hasZero, worldIndex: currentWorld }
    });
  };

  const handleMCQ = (opt) => submitAnswer(opt === q.answer);
  
  const handlePadSubmit = (val) => submitAnswer(String(val) === String(q.answer));

  const handleBuildCheck = () => {
    const isCorrect = 
      String(columns.thousands) === String(q.answer[0] || '0') &&
      String(columns.hundreds) === String(q.answer[1] || '0') &&
      String(columns.tens) === String(q.answer[2] || '0') &&
      String(columns.ones) === String(q.answer[3] || '0');
    submitAnswer(isCorrect);
  };

  const handleDrop = (itemData, zone) => {
    if (itemData.type === zone) {
      setColumns(prev => {
        if (prev[zone] < 9) return { ...prev, [zone]: prev[zone] + 1 };
        return prev;
      });
    }
  };

  const handleFeedbackComplete = () => {
    setFeedback(null);
    // Check if world is complete
    if ((currentQuestion + 1) % 10 === 0) {
      const worldQuestions = state.answerHistory.slice(-10);
      const score = worldQuestions.filter(a => a.correct).length;
      const stars = calculateStars(score);
      dispatch({ type: 'COMPLETE_WORLD', payload: { world: currentWorld, score, stars } });
      
      if (currentWorld === 9) {
        dispatch({ type: 'SET_PHASE', payload: 'reflect' });
      }
    }
    // Only move next if it's not the end
    if (currentQuestion < 99) {
      dispatch({ type: 'NEXT_QUESTION' });
    }
  };

  // World Complete Screen
  if (currentQuestion > 0 && currentQuestion % 10 === 0 && !feedback && state.worldScores[currentWorld - 1] && currentQuestion === currentWorld * 10) {
    const prevWorld = currentWorld - 1;
    const score = state.worldScores[prevWorld].score;
    const stars = state.worldScores[prevWorld].stars;
    
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] animate-[digitFlyIn_0.5s_ease-out]">
        <h2 className="text-4xl font-display font-bold text-accentSecondary mb-4">World Complete!</h2>
        <div className="flex gap-4 text-6xl mb-8">
          {[1,2,3].map(s => (
            <span key={s} className={`transition-all duration-500 delay-${s*100} ${s <= stars ? 'text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)] scale-125' : 'text-slate-700 opacity-50'}`}>★</span>
          ))}
        </div>
        <div className="glass-card p-6 text-center mb-8">
          <p className="text-2xl font-bold mb-2">Score: {score} / 10</p>
          <p className="text-slate-400">Total XP: {state.totalXP}</p>
        </div>
        <button 
          onClick={() => dispatch({ type: 'NEXT_QUESTION' })} // Proceed to next world's first question
          className="btn-primary"
        >
          NEXT WORLD →
        </button>
      </div>
    );
  }

  if (!q) return null;

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in relative pb-10">
      
      {feedback && <FeedbackOverlay isCorrect={feedback.isCorrect} message={feedback.message} onComplete={handleFeedbackComplete} />}

      {/* Header Info */}
      <div className="flex justify-between items-center glass-card p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{world.name}</div>
          <div className="bg-slate-800 px-3 py-1 rounded-full text-xs font-mono text-accentSecondary border border-slate-700">
            {currentQuestion % 10 + 1} / 10
          </div>
        </div>
        <div className="flex items-center gap-6">
          {world.timeLimit && (
            <div className={`font-mono text-xl font-bold ${timeLeft <= 3 ? 'text-colorError animate-pulse' : 'text-colorWarning'}`}>
              ⏱ {timeLeft}s
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-xl">🔥</span>
            <span className="font-bold text-colorXp text-lg">{state.streak}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">⭐</span>
            <span className="font-bold text-yellow-400 text-lg">{state.totalXP}</span>
          </div>
        </div>
      </div>

      {/* Main Question Area */}
      <div className="glass-card p-6 sm:p-8 flex flex-col items-center min-h-[350px]">
        
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white text-center mb-8 leading-tight">
          {q.question}
        </h2>

        {/* Dynamic Display based on question type */}
        <div className="w-full flex-1 flex flex-col items-center justify-center">
          
          {['which_place', 'whats_worth', 'expanded_form', 'standard_form', 'missing_digit', 'number_in_words', 'words_to_number', 'true_false', 'word_problem'].includes(q.type) && (
            <div className="text-5xl font-mono font-bold text-accentSecondary mb-10 text-center px-4">
              {q.type === 'which_place' ? (
                // Highlight the digit
                String(q.number).padStart(4,'0').split('').map((d, i) => {
                  const pos = ['thousands', 'hundreds', 'tens', 'ones'][i];
                  const isHighlight = pos === q.highlightedPosition;
                  return (
                    <span key={i} className={isHighlight ? 'text-pvThousands bg-white px-2 py-1 rounded-md mx-1' : ''}>
                      {d}
                    </span>
                  );
                })
              ) : q.type === 'missing_digit' ? (
                String(q.number).padStart(4,'0').split('').map((d, i) => {
                  const pos = ['thousands', 'hundreds', 'tens', 'ones'][i];
                  const isMissing = pos === q.missingPosition;
                  return (
                    <span key={i} className={isMissing ? 'text-slate-600 border-b-4 border-slate-600 mx-2' : ''}>
                      {isMissing ? '_' : d}
                    </span>
                  );
                })
              ) : (
                q.display
              )}
            </div>
          )}

          {q.type === 'build_it' && (
            <div className="w-full mb-8">
              <div className="flex w-full bg-slate-800 rounded-xl border border-slate-600 overflow-hidden h-[200px]">
                <PlaceValueColumn type="thousands" label="TH" count={columns.thousands} colorClass="pv-column-thousands" />
                <div className="w-px bg-slate-600 h-full" />
                <PlaceValueColumn type="hundreds" label="H" count={columns.hundreds} colorClass="pv-column-hundreds" />
                <div className="w-px bg-slate-600 h-full" />
                <PlaceValueColumn type="tens" label="T" count={columns.tens} colorClass="pv-column-tens" />
                <div className="w-px bg-slate-600 h-full" />
                <PlaceValueColumn type="ones" label="O" count={columns.ones} colorClass="pv-column-ones" />
              </div>
              <BaseTenBlockTray />
              <DropHandlerReceiver onDrop={handleDrop} />
            </div>
          )}

          {/* Answer Controls */}
          {q.answerType === 'mcq' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
              {q.options.map((opt, i) => (
                <button 
                  key={i} 
                  onClick={() => handleMCQ(opt)}
                  className="bg-slate-800 hover:bg-accentPrimary border border-slate-600 hover:border-accentSecondary text-white text-lg font-bold py-4 px-6 rounded-xl transition-all shadow-md active:scale-95 text-center"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {q.answerType === 'true_false' && (
            <div className="flex gap-6 w-full justify-center">
              <button onClick={() => handleMCQ('True')} className="bg-colorSuccess hover:bg-green-500 text-slate-900 font-bold text-2xl py-6 px-12 rounded-xl transition-all shadow-lg active:scale-95">True</button>
              <button onClick={() => handleMCQ('False')} className="bg-colorError hover:bg-red-500 text-white font-bold text-2xl py-6 px-12 rounded-xl transition-all shadow-lg active:scale-95">False</button>
            </div>
          )}

          {q.answerType === 'number_pad' && (
            <div className="flex flex-col items-center w-full">
              {q.type !== 'build_it' && (
                <NumberPad onUpdate={setPadValue} onSubmit={handlePadSubmit} maxLength={4} />
              )}
              {q.type === 'build_it' && (
                <div className="flex gap-4">
                  <button onClick={() => setColumns({ thousands: 0, hundreds: 0, tens: 0, ones: 0 })} className="px-6 py-3 rounded-full border border-slate-600 text-slate-300 hover:bg-slate-700">Clear</button>
                  <button onClick={handleBuildCheck} className="px-10 py-3 rounded-full bg-accentPrimary hover:bg-accentHover text-white font-bold text-lg shadow-lg">Check Blocks!</button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Footer controls */}
      <div className="flex justify-between items-center mt-6">
        <button 
          onClick={() => dispatch({ type: 'SET_PHASE', payload: 'simulate' })}
          className="text-slate-400 hover:text-white transition-colors"
        >
          ← Back to Sandbox
        </button>
        <button 
          onClick={handleHint}
          disabled={hintsUsed >= 2}
          className="flex items-center gap-2 text-accentSecondary hover:text-white transition-colors disabled:opacity-50 bg-slate-800 px-4 py-2 rounded-full border border-slate-700 hover:bg-slate-700"
        >
          💡 Hint ({2 - hintsUsed} left)
        </button>
      </div>

    </div>
  );
}

function DropHandlerReceiver({ onDrop }) {
  useDragDrop({ onDrop });
  return null;
}
