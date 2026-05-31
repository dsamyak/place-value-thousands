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
    let digitIndex = 0;
    const charStrNoCommas = numStr.replace(/,/g, '');

    return (
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0', fontSize: '3.5rem', fontWeight: 'bold', fontFamily: 'var(--font-display)', letterSpacing: '4px' }}>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', padding: '16px 40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', alignItems: 'center' }}>
          {numStr.split('').map((char, i) => {
            if (char === ',') {
              return <span key={i} style={{ color: 'var(--text-muted)', margin: '0 4px' }}>{char}</span>;
            }
            
            const placeFromRight = charStrNoCommas.length - 1 - digitIndex;
            digitIndex++;
            
            const posMap = { 3: 'thousands', 2: 'hundreds', 1: 'tens', 0: 'ones' };
            const charPos = posMap[placeFromRight];
            const isHighlighted = charPos === posName;
            
            return (
              <span 
                key={i} 
                style={{
                  color: isHighlighted ? color : 'white',
                  textShadow: isHighlighted ? `0 0 15px ${color}` : 'none',
                  transform: isHighlighted ? 'scale(1.15)' : 'scale(1)',
                  display: 'inline-block',
                  transition: 'all 0.3s ease',
                  margin: '0 4px',
                  borderBottom: isHighlighted ? `4px solid ${color}` : '4px solid transparent',
                  paddingBottom: '4px'
                }}
              >
                {char}
              </span>
            );
          })}
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

  React.useEffect(() => {
    setPadInput('');
    setSelectedOption(null);
  }, [question]);

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
    if (padInput.length >= 6) return;
    const newVal = padInput + n;
    setPadInput(newVal);
    if (newVal === String(question.correctAnswer)) {
      handleOptionClick(newVal);
    }
  };

  const handleCheck = () => {
    if (disabled || !padInput) return;
    handleOptionClick(padInput);
    if (padInput !== String(question.correctAnswer)) {
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

      {question.answerType === 'number_pad' && !question.options && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className={`blank-input ${disabled && padInput === String(question.correctAnswer) ? 'correct' : disabled ? 'wrong' : padInput ? 'filled' : ''}`} style={{ marginBottom: 24, padding: '12px 32px', minHeight: 60, minWidth: 100 }}>
            {padInput || '?'}
          </div>
          <div className="number-pad">
            {[1,2,3,4,5,6,7,8,9].map(n => (
              <button key={n} className="num-pad-btn" onClick={() => handleNumClick(String(n))} disabled={disabled}>
                {n}
              </button>
            ))}
            <button className="num-pad-btn" onClick={() => setPadInput('')} disabled={disabled}>C</button>
            <button className="num-pad-btn" onClick={() => handleNumClick('0')} disabled={disabled}>0</button>
            <button className="num-pad-btn" style={{ background: 'var(--green)', color: 'white' }} onClick={handleCheck} disabled={disabled}>✓</button>
          </div>
        </div>
      )}
    </div>
  );
}
