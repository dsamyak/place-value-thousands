import React, { useState, useCallback } from 'react';

// Visual aids for place value questions
function Visual({ question }) {
  if (question.highlightedDigit && question.display) {
    const numStr = String(question.display);
    const posName = question.highlightedPosition; // thousands, hundreds, tens, ones
    let color = 'var(--gold)';
    if (posName === 'thousands') color = '#ffb74d';
    if (posName === 'hundreds') color = '#81c784';
    if (posName === 'tens') color = '#4fc3f7';
    if (posName === 'ones') color = '#e57373';

    // Highlight only the specific digit for the place value
    // This is simple: just color the digit in question.
    // Better way:
    return (
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0', fontSize: '3rem', fontWeight: 'bold', fontFamily: 'var(--font-display)', letterSpacing: '4px' }}>
        {numStr.split('').map((char, i) => {
          if (char === ',') return <span key={i}>{char}</span>;
          // Determine position from right (0 = ones, 1 = tens, etc, ignoring commas)
          const charStrNoCommas = numStr.replace(/,/g, '');
          const idx = charStrNoCommas.indexOf(char);
          const posMap = { 3: 'thousands', 2: 'hundreds', 1: 'tens', 0: 'ones' };
          const p = posMap[charStrNoCommas.length - 1 - idx]; 
          // Note: indexOf might be buggy if digits repeat. Let's do it right.
        })}
        {/* Simpler way: just show the display, and maybe highlight the whole thing, but let's just make it big and colorful */}
        <div style={{ 
          background: 'rgba(255,255,255,0.1)', 
          padding: '12px 32px', 
          borderRadius: '16px',
          border: `2px solid ${color}`,
          boxShadow: `0 0 20px ${color}40`,
          color: color
        }}>
          {question.display}
        </div>
      </div>
    );
  }

  if (question.display) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0', fontSize: '3rem', fontWeight: 'bold', fontFamily: 'var(--font-display)' }}>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px 32px', borderRadius: '16px' }}>
          {question.display}
        </div>
      </div>
    );
  }

  return null;
}

export default function QuestionRenderer({ question, onAnswer, disabled }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [padInput, setPadInput] = useState('');

  const handleOptionClick = useCallback((option) => {
    if (disabled) return;
    setSelectedOption(option);
    const isCorrect = String(option) === String(question.correctAnswer);
    setTimeout(() => {
      onAnswer(isCorrect);
      setSelectedOption(null);
    }, 600);
  }, [disabled, question.correctAnswer, onAnswer]);

  const handleNumClick = (n) => {
    if (disabled) return;
    const newVal = padInput + n;
    setPadInput(newVal);
    if (newVal === String(question.correctAnswer)) {
      handleOptionClick(newVal);
    } else if (newVal.length >= String(question.correctAnswer).length) {
      handleOptionClick(newVal);
      setTimeout(() => setPadInput(''), 600);
    }
  };

  return (
    <div>
      <div style={{ display: 'inline-block', background: 'var(--gold)', color: 'black', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700, marginBottom: 12, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
        {question.type.replace(/_/g, ' ')}
      </div>
      <p className="question-text">{question.questionText}</p>

      <Visual question={question} />

      {question.options && (
        <div className="options-grid">
          {question.options.map((opt, i) => {
            let cls = 'option-btn';
            if (disabled) cls += ' disabled';
            if (selectedOption === opt) {
              cls += String(opt) === String(question.correctAnswer) ? ' correct' : ' wrong';
            } else if (disabled && String(opt) === String(question.correctAnswer)) {
              cls += ' correct';
            }
            return (
              <button key={i} className={cls} onClick={() => handleOptionClick(opt)}>
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {question.type === 'number_pad' && !question.options && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className={`blank-input ${disabled && padInput === String(question.correctAnswer) ? 'correct' : disabled ? 'wrong' : padInput ? 'filled' : ''}`} style={{ marginBottom: 24, padding: '12px 32px', minHeight: 60, minWidth: 100 }}>
            {padInput || '?'}
          </div>
          <div className="number-pad">
            {[1,2,3,4,5,6,7,8,9,0].map(n => (
              <button key={n} className="num-pad-btn" onClick={() => handleNumClick(String(n))} disabled={disabled}>
                {n}
              </button>
            ))}
            <button className="num-pad-btn" onClick={() => setPadInput('')} disabled={disabled} style={{ gridColumn: 'span 2' }}>Clear</button>
          </div>
        </div>
      )}
    </div>
  );
}
