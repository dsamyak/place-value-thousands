import { useState, useEffect, useCallback, useRef } from 'react';
import { narrate, stopNarration } from '../utils/audio';
import { wonderNarration, wonderDiscoverNarration } from '../utils/narration';

const WONDER_QUESTIONS = [
  {
    question: "What makes the number 9,999 so special?",
    subtext: "What happens if you add just 1 more to it?",
    emoji: "🤔",
    bgEmojis: ["9", "9", "9", "9", "✨", "🔢"],
  },
  {
    question: "How much is a thousand, really?",
    subtext: "If you had 1,000 cookies, how long would it take to eat them all?",
    emoji: "🍪",
    bgEmojis: ["🍪", "🥛", "1000", "😋", "🔢"],
  },
  {
    question: "Why do we use commas in big numbers like 1,000?",
    subtext: "Does the comma change the value of the number?",
    emoji: "🏷️",
    bgEmojis: [",", "1000", "🏷️", "👀", "🔢"],
  },
  {
    question: "If a house costs $200,000, what happens to the zeros?",
    subtext: "Do zeros mean 'nothing', or are they super important?",
    emoji: "🏠",
    bgEmojis: ["0", "0", "0", "🏠", "💲"],
  },
];

export default function WonderPhase({ onComplete, audioEnabled }) {
  const [wonder] = useState(() => WONDER_QUESTIONS[Math.floor(Math.random() * WONDER_QUESTIONS.length)]);
  const [stage, setStage] = useState(0);
  const [particles, setParticles] = useState([]);
  const narrationRef = useRef(null);

  useEffect(() => {
    const p = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: wonder.bgEmojis[i % wonder.bgEmojis.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 12,
      size: 1.2 + Math.random() * 1.5,
    }));
    setParticles(p);
  }, [wonder]);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 300);
    const t2 = setTimeout(() => setStage(2), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (stage === 1 && audioEnabled) {
      narrationRef.current = narrate(
        wonderNarration(wonder.question, wonder.subtext),
        true
      );
    }
    return () => {
      narrationRef.current?.cancel();
    };
  }, [stage, wonder.question, wonder.subtext, audioEnabled]);

  const handleDiscover = useCallback(() => {
    narrationRef.current?.cancel();
    stopNarration();
    if (audioEnabled) {
      const n = narrate(wonderDiscoverNarration(), true);
      n.promise.then(() => onComplete());
      setTimeout(() => onComplete(), 3000);
    } else {
      setTimeout(() => onComplete(), 600);
    }
  }, [onComplete, audioEnabled]);

  return (
    <div className="wonder-phase">
      <div className="wonder-particles">
        {particles.map(p => (
          <span key={p.id} className="wonder-particle" style={{
            left: `${p.x}%`, top: `${p.y}%`,
            animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`,
            fontSize: `${p.size}rem`,
          }}>{p.emoji}</span>
        ))}
      </div>
      <div className="wonder-content">
        <div className={`wonder-qmark ${stage >= 1 ? 'revealed' : ''}`}>
          <span className="wonder-qmark-icon">?</span>
          <div className="wonder-qmark-glow" />
        </div>
        <div className={`wonder-mascot ${stage >= 1 ? 'visible' : ''}`}>
          <div className="mascot thinking">🤖</div>
          <div className="speech-bubble wonder-bubble">Hmm... I wonder... 🤔</div>
        </div>
        <div className={`wonder-question-card ${stage >= 1 ? 'visible' : ''}`}>
          <div className="wonder-emoji">{wonder.emoji}</div>
          <h2 className="wonder-question-text">{wonder.question}</h2>
          <p className="wonder-subtext">{wonder.subtext}</p>
        </div>
        <button className={`btn btn-wonder ${stage >= 2 ? 'visible' : ''}`} onClick={handleDiscover} id="discover-btn">
          <span className="wonder-btn-sparkle">✨</span>
          Let's Discover!
          <span className="wonder-btn-sparkle">✨</span>
        </button>
      </div>
    </div>
  );
}
