import React, { useReducer, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useAudio } from './hooks/useAudio';
import { ProgressMap } from './components/ProgressMap';
import { IntroScreen } from './components/phases/IntroScreen';
import { WonderPhase } from './components/phases/WonderPhase';
import { StoryPhase } from './components/phases/StoryPhase';
import { SimulatePhase } from './components/phases/SimulatePhase';
import { PlayPhase } from './components/phases/PlayPhase';
import { ReflectPhase } from './components/phases/ReflectPhase';
import { generateQuestionSet } from './utils/questionGenerator';
import { checkBadges } from './utils/badgeEngine';

const generateSessionId = () => Math.random().toString(36).substr(2, 9);

const initialState = {
  phase: 'intro',
  storyPanel: 0,
  currentSimStation: 0,
  simStationsComplete: [false, false, false],
  simRound: 0,
  
  questionSet: [],
  currentQuestion: 0,
  currentWorld: 0,
  worldScores: Array(10).fill(null),
  answerHistory: [], 
  
  totalXP: 0,
  streak: 0,
  maxStreak: 0,
  badgesEarned: [],
  newBadge: null,
  
  audioEnabled: true,
  sessionId: generateSessionId(),
  startedAt: Date.now(),
  lastActiveAt: Date.now(),
};

function reducer(state, action) {
  let newState = { ...state, lastActiveAt: Date.now() };

  switch (action.type) {
    case 'RESTORE_STATE':
      return { ...action.payload, lastActiveAt: Date.now() };
    case 'SET_PHASE':
      newState.phase = action.payload;
      if (action.payload === 'play' && state.questionSet.length === 0) {
        newState.questionSet = generateQuestionSet();
      }
      break;
    case 'NEXT_STORY_PANEL':
      if (state.storyPanel < 5) newState.storyPanel += 1;
      else newState.phase = 'simulate';
      break;
    case 'COMPLETE_SIM_STATION':
      const newSim = [...state.simStationsComplete];
      newSim[action.payload] = true;
      newState.simStationsComplete = newSim;
      
      const nextIdx = newSim.findIndex(v => !v);
      if (nextIdx !== -1) {
        newState.currentSimStation = nextIdx;
      }
      break;
    case 'SET_SIM_STATION':
      newState.currentSimStation = action.payload;
      break;
    case 'ANSWER_QUESTION':
      const { correct, timeMs, xpEarned, hasZero, worldIndex } = action.payload;
      newState.totalXP += xpEarned;
      if (correct) {
        newState.streak += 1;
        if (newState.streak > newState.maxStreak) newState.maxStreak = newState.streak;
      } else {
        newState.streak = 0;
      }
      newState.answerHistory = [...state.answerHistory, { correct, timeMs, hasZero, worldIndex }];
      
      const newBadges = checkBadges(newState);
      if (newBadges.length > 0) {
        newState.badgesEarned = [...newState.badgesEarned, ...newBadges];
        newState.newBadge = newBadges[0]; // Just show first new badge
      }
      break;
    case 'NEXT_QUESTION':
      newState.currentQuestion += 1;
      newState.currentWorld = Math.floor(newState.currentQuestion / 10);
      break;
    case 'COMPLETE_WORLD':
      const { world, score, stars } = action.payload;
      const ws = [...state.worldScores];
      ws[world] = { score, stars };
      newState.worldScores = ws;
      newState.totalXP += 50 + (stars === 3 ? 30 : 0); // World complete bonus
      
      const wb = checkBadges(newState);
      if (wb.length > 0) {
        newState.badgesEarned = [...newState.badgesEarned, ...wb];
        newState.newBadge = wb[0];
      }
      break;
    case 'CLEAR_NEW_BADGE':
      newState.newBadge = null;
      break;
    case 'TOGGLE_AUDIO':
      newState.audioEnabled = !state.audioEnabled;
      break;
    default:
      return state;
  }
  return newState;
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { saveSession, loadSession } = useLocalStorage();

  useEffect(() => {
    const saved = loadSession();
    if (saved) {
      dispatch({ type: 'RESTORE_STATE', payload: saved });
    }
  }, []);

  useEffect(() => {
    // Save on state change
    if (state.phase !== 'intro') {
      saveSession(state);
    }
  }, [state]);

  const renderPhase = () => {
    switch (state.phase) {
      case 'intro': return <IntroScreen dispatch={dispatch} />;
      case 'wonder': return <WonderPhase dispatch={dispatch} state={state} />;
      case 'story': return <StoryPhase dispatch={dispatch} state={state} />;
      case 'simulate': return <SimulatePhase dispatch={dispatch} state={state} />;
      case 'play': return <PlayPhase dispatch={dispatch} state={state} />;
      case 'reflect': return <ReflectPhase dispatch={dispatch} state={state} />;
      default: return <IntroScreen dispatch={dispatch} />;
    }
  };

  return (
    <div className="min-h-screen text-white font-body overflow-x-hidden pt-14 pb-10">
      <ProgressMap currentPhase={state.phase} />
      
      <main className="container mx-auto px-4 max-w-4xl relative">
        <div className="absolute top-4 right-4 z-50">
          <button 
            onClick={() => dispatch({ type: 'TOGGLE_AUDIO' })}
            className="p-2 bg-bgCard rounded-full border border-borderSubtle hover:bg-bgCardHover"
            aria-label="Toggle Audio"
          >
            {state.audioEnabled ? '🔊' : '🔇'}
          </button>
        </div>
        
        {renderPhase()}
      </main>

      {state.newBadge && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-bounce z-50">
          <span className="text-2xl">🏆</span>
          <span className="font-bold">New Badge Unlocked!</span>
          <button onClick={() => dispatch({ type: 'CLEAR_NEW_BADGE' })} className="ml-2 opacity-60 hover:opacity-100">✕</button>
        </div>
      )}
    </div>
  );
}

export default App;
