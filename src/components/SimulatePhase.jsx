import React, { useState, useCallback, useEffect, useRef } from 'react';
import { narrate, stopNarration, sounds } from '../utils/audio';
import { celebrate, cheer } from '../utils/audio';
import { simulateStation1Intro, simulateStation2Intro, simulateStation3Intro } from '../utils/narration';

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

const STATIONS = [
  { id: 0, title: 'Build It', subtitle: 'Place Value Blocks', icon: '🧱' },
  { id: 1, title: 'Spot True', subtitle: 'True or False', icon: '✅' },
  { id: 2, title: 'Missing Digit', subtitle: 'Number Pad', icon: '📝' },
];

function PVChart({ th, h, t, o }) {
  return (
    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '16px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontSize: '0.9rem', color: '#ffb74d', fontWeight: 'bold', marginBottom: '8px' }}>Thousands</div>
        <div style={{ fontSize: '2.5rem', color: 'white', fontWeight: 'bold' }}>{th ?? '?'}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontSize: '0.9rem', color: '#81c784', fontWeight: 'bold', marginBottom: '8px' }}>Hundreds</div>
        <div style={{ fontSize: '2.5rem', color: 'white', fontWeight: 'bold' }}>{h ?? '?'}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontSize: '0.9rem', color: '#4fc3f7', fontWeight: 'bold', marginBottom: '8px' }}>Tens</div>
        <div style={{ fontSize: '2.5rem', color: 'white', fontWeight: 'bold' }}>{t ?? '?'}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontSize: '0.9rem', color: '#e57373', fontWeight: 'bold', marginBottom: '8px' }}>Ones</div>
        <div style={{ fontSize: '2.5rem', color: 'white', fontWeight: 'bold' }}>{o ?? '?'}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// STATION 1: Build Number
// ═══════════════════════════════════════════════════
function Station1({ audioEnabled, onNext }) {
  const [target, setTarget] = useState({ th: 0, h: 0, t: 0, o: 0, num: 0 });
  const [current, setCurrent] = useState({ th: 0, h: 0, t: 0, o: 0 });
  const [round, setRound] = useState(0);
  const [done, setDone] = useState(false);
  const narRef = useRef(null);

  useEffect(() => {
    const th = randInt(1, 9);
    const h = randInt(0, 9);
    const t = randInt(0, 9);
    const o = randInt(0, 9);
    setTarget({ th, h, t, o, num: th*1000 + h*100 + t*10 + o });
    setCurrent({ th: 0, h: 0, t: 0, o: 0 });
    setDone(false);
  }, [round]);

  useEffect(() => {
    if (audioEnabled && target.num > 0) {
      narRef.current = narrate(simulateStation1Intro(), true);
    }
    return () => { narRef.current?.cancel(); };
  }, [target, audioEnabled]);

  const handleChange = (place, delta) => {
    if (done) return;
    const newVal = current[place] + delta;
    if (newVal < 0 || newVal > 9) return;
    
    sounds.click();
    const next = { ...current, [place]: newVal };
    setCurrent(next);

    if (next.th === target.th && next.h === target.h && next.t === target.t && next.o === target.o) {
      setDone(true);
      sounds.correct();
      narRef.current?.cancel();
      if (audioEnabled) {
        narRef.current = narrate([
          celebrate(`You built ${target.num.toLocaleString()}!`),
          cheer("Great job!")
        ], true);
      }
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="station-header"><h2>🧱 Build It</h2></div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
        Build the number <strong style={{ color: 'var(--gold)', fontSize: '1.5rem' }}>{target.num.toLocaleString()}</strong> by pressing the buttons!
      </p>

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
        {['th', 'h', 't', 'o'].map((place, i) => (
          <div key={place} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {place === 'th' ? 'Thousands' : place === 'h' ? 'Hundreds' : place === 't' ? 'Tens' : 'Ones'}
            </div>
            <button className="btn btn-outline" style={{ padding: '8px 16px', minWidth: '40px' }} onClick={() => handleChange(place, 1)} disabled={done}>+</button>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', width: '40px', textAlign: 'center', color: current[place] === target[place] && done ? 'var(--green)' : 'white' }}>{current[place]}</div>
            <button className="btn btn-outline" style={{ padding: '8px 16px', minWidth: '40px' }} onClick={() => handleChange(place, -1)} disabled={done}>-</button>
          </div>
        ))}
      </div>

      {done && (
        <div style={{ animation: 'bounceIn 0.5s' }}>
          <button className={`btn ${round < 2 ? 'btn-outline' : 'btn-primary'}`} onClick={() => round < 2 ? setRound(r => r + 1) : onNext()}>
            {round < 2 ? 'Try Another →' : 'Next Station →'}
          </button>
        </div>
      )}
      <div style={{ marginTop: 16, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Round {Math.min(round + 1, 3)} / 3</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// STATION 2: Spot True
// ═══════════════════════════════════════════════════
function Station2({ audioEnabled, onNext }) {
  const [round, setRound] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [data, setData] = useState({ num: 0, chart: {}, isTrue: true });
  const narRef = useRef(null);

  useEffect(() => {
    const th = randInt(1, 9);
    const h = randInt(0, 9);
    const t = randInt(0, 9);
    const o = randInt(0, 9);
    const num = th*1000 + h*100 + t*10 + o;
    
    const isTrue = Math.random() > 0.5;
    let chartTh = th, chartH = h, chartT = t, chartO = o;
    if (!isTrue) {
      const wrongPlace = randInt(0, 3);
      if (wrongPlace === 0) chartTh = (th + randInt(1, 4)) % 10;
      if (wrongPlace === 1) chartH = (h + randInt(1, 4)) % 10;
      if (wrongPlace === 2) chartT = (t + randInt(1, 4)) % 10;
      if (wrongPlace === 3) chartO = (o + randInt(1, 4)) % 10;
      if (chartTh === 0) chartTh = 1;
    }

    setData({ num, chart: { th: chartTh, h: chartH, t: chartT, o: chartO }, isTrue });
    setAnswered(false);
    setSelectedIdx(null);
  }, [round]);

  useEffect(() => {
    if (audioEnabled && data.num > 0) {
      narRef.current = narrate(simulateStation2Intro(), true);
    }
    return () => { narRef.current?.cancel(); };
  }, [data, audioEnabled]);

  const handleSelect = (idx) => {
    if (answered) return;
    setSelectedIdx(idx);
    setAnswered(true);
    const correctIdx = data.isTrue ? 0 : 1; // 0 is True, 1 is False
    if (idx === correctIdx) {
      sounds.correct();
      narRef.current?.cancel();
      if (audioEnabled) {
        narRef.current = narrate([celebrate("You got it right!")], true);
      }
    } else {
      sounds.wrong();
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="station-header"><h2>✅ Spot True</h2></div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
        Does the chart show the number <strong style={{ color: 'var(--gold)', fontSize: '1.2rem' }}>{data.num.toLocaleString()}</strong>?
      </p>

      <PVChart th={data.chart.th} h={data.chart.h} t={data.chart.t} o={data.chart.o} />

      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', margin: '24px 0' }}>
        <button 
          className={`btn btn-outline ${answered && data.isTrue ? 'btn-green' : ''} ${answered && selectedIdx===0 && !data.isTrue ? 'btn-danger' : ''}`}
          onClick={() => handleSelect(0)} disabled={answered}>
          True
        </button>
        <button 
          className={`btn btn-outline ${answered && !data.isTrue ? 'btn-green' : ''} ${answered && selectedIdx===1 && data.isTrue ? 'btn-danger' : ''}`}
          onClick={() => handleSelect(1)} disabled={answered}>
          False
        </button>
      </div>

      {answered && (
        <div style={{ marginTop: 20, animation: 'bounceIn 0.5s' }}>
          <button className={`btn ${round < 2 ? 'btn-outline' : 'btn-primary'}`} onClick={() => round < 2 ? setRound(r => r + 1) : onNext()}>
            {round < 2 ? 'Try Another →' : 'Next Station →'}
          </button>
        </div>
      )}
      <div style={{ marginTop: 16, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Round {Math.min(round + 1, 3)} / 3</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// STATION 3: Missing Digit
// ═══════════════════════════════════════════════════
function Station3({ audioEnabled, onComplete }) {
  const [data, setData] = useState({ num: 0, place: '', digit: 0, val: 0, missingVal: false });
  const [inputVal, setInputVal] = useState('');
  const [round, setRound] = useState(0);
  const [done, setDone] = useState(false);
  const narRef = useRef(null);

  useEffect(() => {
    const th = randInt(1, 9);
    const h = randInt(0, 9);
    const t = randInt(0, 9);
    const o = randInt(0, 9);
    const num = th*1000 + h*100 + t*10 + o;
    const places = ['th', 'h', 't', 'o'];
    const names = { th: 'Thousands', h: 'Hundreds', t: 'Tens', o: 'Ones' };
    const p = places[randInt(0, 3)];
    const digit = p === 'th' ? th : p === 'h' ? h : p === 't' ? t : o;
    const missingVal = Math.random() > 0.5; // If true, ask for value (e.g. 300). If false, ask for digit (e.g. 3)
    const val = digit * (p === 'th' ? 1000 : p === 'h' ? 100 : p === 't' ? 10 : 1);

    setData({ num, place: names[p], digit, val, missingVal });
    setInputVal('');
    setDone(false);
  }, [round]);

  useEffect(() => {
    if (audioEnabled && data.num > 0) {
      narRef.current = narrate(simulateStation3Intro(), true);
    }
    return () => { narRef.current?.cancel(); };
  }, [data, audioEnabled]);

  const targetAns = data.missingVal ? data.val : data.digit;

  const handleNumClick = (n) => {
    if (done) return;
    const newVal = inputVal + n;
    setInputVal(newVal);
    sounds.click();

    if (parseInt(newVal) === targetAns) {
      setDone(true);
      sounds.correct();
      narRef.current?.cancel();
      if (audioEnabled) {
        narRef.current = narrate([celebrate(`Yes! You found it!`)], true);
      }
    } else if (newVal.length >= String(targetAns).length) {
      sounds.wrong();
      setTimeout(() => setInputVal(''), 500);
    }
  };

  const handleComplete = () => { narRef.current?.cancel(); stopNarration(); onComplete(); };

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="station-header"><h2>📝 Missing Digit</h2></div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
        In the number <strong style={{ color: 'var(--gold)', fontSize: '1.5rem' }}>{data.num.toLocaleString()}</strong>,<br/>
        what is the <strong style={{ color: 'var(--coral)' }}>{data.missingVal ? 'VALUE of the' : 'digit in the'} {data.place}</strong> place?
      </p>

      <div className="sentence-row">
        <div className={`blank-input ${done ? 'correct' : inputVal ? 'filled' : ''}`}>
          {inputVal || (done ? targetAns : '?')}
        </div>
      </div>

      {/* Number Pad */}
      {!done && (
        <div className="number-pad">
          {[1,2,3,4,5,6,7,8,9,0].map(n => (
            <button key={n} className="num-pad-btn" onClick={() => handleNumClick(String(n))}>
              {n}
            </button>
          ))}
          <button className="num-pad-btn" onClick={() => setInputVal('')} style={{ gridColumn: 'span 2' }}>Clear</button>
        </div>
      )}

      {done && (
        <div style={{ marginTop: 24, animation: 'bounceIn 0.5s' }}>
          {round < 2 ? (
            <button className="btn btn-outline" onClick={() => setRound(r => r + 1)}>Try Another →</button>
          ) : (
            <button className="btn btn-primary btn-lg" onClick={handleComplete}>🎉 Complete Simulation!</button>
          )}
        </div>
      )}

      <div style={{ marginTop: 24, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Round {Math.min(round + 1, 3)} / 3</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// Main SimulatePhase
// ═══════════════════════════════════════════════════
export default function SimulatePhase({ onComplete, audioEnabled }) {
  const [station, setStation] = useState(0);
  const nextStation = useCallback(() => { if (station < 2) setStation(s => s + 1); }, [station]);

  return (
    <div className="simulate-phase">
      <div className="simulate-header">
        <h3 className="simulate-label">🧪 Simulate</h3>
        <p className="simulate-sublabel">Explore and discover — no wrong answers!</p>
      </div>
      <div className="progress-dots">
        {STATIONS.map((s, i) => (
          <div key={i} className="simulate-dot-wrapper">
            <div className={`progress-dot ${i === station ? 'active' : i < station ? 'completed' : ''}`} />
            <span className="simulate-dot-label">{s.icon}</span>
          </div>
        ))}
      </div>
      <div className="glass-card" style={{ maxWidth: 800, width: '100%', animation: 'slideUp 0.4s ease' }}>
        {station === 0 && <Station1 audioEnabled={audioEnabled} onNext={nextStation} />}
        {station === 1 && <Station2 audioEnabled={audioEnabled} onNext={nextStation} />}
        {station === 2 && <Station3 audioEnabled={audioEnabled} onComplete={onComplete} />}
      </div>
    </div>
  );
}
