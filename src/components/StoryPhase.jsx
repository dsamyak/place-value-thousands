import { useState, useEffect, useCallback, useRef } from 'react';
import { narrate, stopNarration, preloadNarration } from '../utils/audio';
import { getStoryNarration } from '../utils/narration';
import { storyPanels } from '../data/storyContent';

const STORY_SLIDES = storyPanels.map((panel, idx) => ({
  title: panel.title,
  text: panel.screenText.replace(/<[^>]+>/g, ''), // strip HTML for simple text
  highlight: panel.keyTerms[0] || "",
  mascotText: panel.index === 0 ? "Let's explore! 🏛️" :
              panel.index === 1 ? "Meet the houses! 🏠" :
              panel.index === 2 ? "Big numbers! 🔢" :
              panel.index === 3 ? "Putting it together! ➕" :
              panel.index === 4 ? "Zero is important! 0️⃣" : "You did it! 🎉",
  pvChart: panel.pvChartState,
  bgImage: `linear-gradient(135deg, hsl(${idx * 40}, 70%, 50%), hsl(${idx * 40 + 40}, 70%, 30%))`
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
        <div className="story-image-section" style={{ background: s.bgImage, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          
          <div style={{ display: 'flex', gap: '8px', zIndex: 10, background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 60 }}>
              <div style={{ fontSize: '0.7rem', color: '#ffb74d', fontWeight: 'bold' }}>TH</div>
              <div style={{ fontSize: '2rem', color: 'white', fontWeight: 'bold' }}>{s.pvChart.th || '-'}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 60 }}>
              <div style={{ fontSize: '0.7rem', color: '#81c784', fontWeight: 'bold' }}>H</div>
              <div style={{ fontSize: '2rem', color: 'white', fontWeight: 'bold' }}>{s.pvChart.h || '-'}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 60 }}>
              <div style={{ fontSize: '0.7rem', color: '#4fc3f7', fontWeight: 'bold' }}>T</div>
              <div style={{ fontSize: '2rem', color: 'white', fontWeight: 'bold' }}>{s.pvChart.t || '-'}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 60 }}>
              <div style={{ fontSize: '0.7rem', color: '#e57373', fontWeight: 'bold' }}>O</div>
              <div style={{ fontSize: '2rem', color: 'white', fontWeight: 'bold' }}>{s.pvChart.o || '-'}</div>
            </div>
          </div>
          
          <div className="story-image-overlay" />
        </div>
        <div className="story-text-section">
          <h2 className="story-title">{s.title}</h2>
          <p className={`story-text ${textVis ? 'revealed' : ''}`}>{s.text}</p>
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
