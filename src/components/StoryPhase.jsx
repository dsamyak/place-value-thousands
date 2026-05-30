import { useState, useEffect, useCallback, useRef } from 'react';
import { narrate, stopNarration, preloadNarration } from '../utils/audio';
import { getStoryNarration } from '../utils/narration';
import { storyPanels } from '../data/storyContent';

const STORY_SLIDES = storyPanels.map((panel) => ({
  title: panel.title,
  html: panel.screenText,
  highlight: panel.keyTerms[0] || "",
  mascotText: panel.index === 0 ? "Welcome to the museum! 🏛️" :
              panel.index === 1 ? "Meet the houses! 🏠" :
              panel.index === 2 ? "Big numbers! 🔢" :
              panel.index === 3 ? "Putting it together! ➕" :
              panel.index === 4 ? "Zero is important! 0️⃣" : "You did it! 🎉",
  pvChart: panel.pvChartState,
  image: panel.image,
}));

export default function StoryPhase({ onComplete, audioEnabled }) {
  const [slide, setSlide] = useState(0);
  const [anim, setAnim] = useState(false);
  const [textVis, setTextVis] = useState(false);
  const [hlVis, setHlVis] = useState(false);
  const narrationRef = useRef(null);
  const s = STORY_SLIDES[slide];
  const isLast = slide === STORY_SLIDES.length - 1;
  const pct = ((slide + 1) / STORY_SLIDES.length) * 100;

  // Preload audio
  useEffect(() => {
    if (audioEnabled) {
      preloadNarration(getStoryNarration(slide));
      if (slide + 1 < STORY_SLIDES.length) {
        preloadNarration(getStoryNarration(slide + 1));
      }
    }
  }, [slide, audioEnabled]);

  useEffect(() => {
    setTextVis(false); setHlVis(false);
    const t1 = setTimeout(() => setTextVis(true), 100);
    const t2 = setTimeout(() => setHlVis(true), 800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [slide]);

  useEffect(() => {
    if (textVis && audioEnabled) {
      narrationRef.current?.cancel();
      narrationRef.current = narrate(getStoryNarration(slide), true);
    }
    return () => { narrationRef.current?.cancel(); };
  }, [textVis, slide, audioEnabled]);

  const goNext = useCallback(() => {
    if (anim) return;
    narrationRef.current?.cancel();
    stopNarration();
    setAnim(true);
    setTimeout(() => { isLast ? onComplete() : setSlide(i => i + 1); setAnim(false); }, 400);
  }, [anim, isLast, onComplete]);

  const goPrev = useCallback(() => {
    if (anim || slide === 0) return;
    narrationRef.current?.cancel();
    stopNarration();
    setAnim(true);
    setTimeout(() => { setSlide(i => i - 1); setAnim(false); }, 400);
  }, [anim, slide]);

  return (
    <div className="story-phase">
      <div className="story-progress">
        <div className="story-progress-bar"><div className="story-progress-fill" style={{ width: `${pct}%` }} /></div>
        <span className="story-progress-label">{slide + 1} / {STORY_SLIDES.length}</span>
      </div>
      <div className={`story-card ${anim ? 'flipping' : ''}`}>
        <div className="story-image-section" style={{ position: 'relative' }}>
          {/* Story illustration */}
          <img
            src={s.image}
            alt={s.title}
            className="story-image"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* PV Chart overlay — only when digits are being revealed */}
          {(s.pvChart.th !== null || s.pvChart.h !== null || s.pvChart.t !== null || s.pvChart.o !== null) && (
            <div style={{
              position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
              display: 'flex', gap: '8px', zIndex: 10,
              background: 'rgba(0,0,0,0.6)', padding: '10px 16px', borderRadius: '12px',
              backdropFilter: 'blur(8px)',
            }}>
              {[
                { label: 'TH', value: s.pvChart.th, color: '#ffb74d' },
                { label: 'H', value: s.pvChart.h, color: '#81c784' },
                { label: 'T', value: s.pvChart.t, color: '#4fc3f7' },
                { label: 'O', value: s.pvChart.o, color: '#e57373' },
              ].map((col) => (
                <div key={col.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 48 }}>
                  <div style={{ fontSize: '0.6rem', color: col.color, fontWeight: 'bold' }}>{col.label}</div>
                  <div style={{
                    fontSize: '1.4rem', color: col.value !== null ? 'white' : 'rgba(255,255,255,0.25)',
                    fontWeight: 'bold',
                    transition: 'all 0.4s ease',
                    transform: col.value !== null ? 'scale(1)' : 'scale(0.7)',
                  }}>
                    {col.value !== null ? col.value : '–'}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="story-image-overlay" />
        </div>
        <div className="story-text-section">
          <h2 className="story-title">{s.title}</h2>
          <div
            className={`story-text ${textVis ? 'revealed' : ''}`}
            dangerouslySetInnerHTML={{ __html: s.html }}
          />
          <div className={`story-highlight ${hlVis ? 'visible' : ''}`}>
            <span>✨</span><span className="story-highlight-text">{s.highlight}</span><span>✨</span>
          </div>
          <div className="story-mascot">
            <div className="mascot" style={{ width: 50, height: 50, fontSize: '1.4rem' }}>🤖</div>
            <div className="speech-bubble" style={{ fontSize: '0.8rem', padding: '8px 14px', maxWidth: 180 }}>{s.mascotText}</div>
          </div>
        </div>
      </div>
      <div className="story-nav">
        <button className="btn btn-outline btn-sm" onClick={goPrev} disabled={slide === 0} style={{ opacity: slide === 0 ? 0.3 : 1 }}>← Back</button>
        <div className="story-dots">
          {STORY_SLIDES.map((_, i) => (<div key={i} className={`story-dot ${i === slide ? 'active' : i < slide ? 'completed' : ''}`} />))}
        </div>
        <button className={`btn ${isLast ? 'btn-green' : 'btn-primary'} btn-sm`} onClick={goNext}>
          {isLast ? "🚀 Let's Explore!" : 'Next →'}
        </button>
      </div>
    </div>
  );
}
