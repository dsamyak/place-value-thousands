import { audioMap } from '../utils/audioMap';

const googleTTSCache = new Map();  // in-memory cache for dynamic requests

export function useAudio(audioEnabled) {

  async function getAudioUrl(text) {
    // 1. Static pre-generated audio map lookup
    if (audioMap[text]) {
      return audioMap[text];
    }
    // 2. In-memory cache
    if (googleTTSCache.has(text)) {
      return googleTTSCache.get(text);
    }
    // 3. Dynamic Google TTS request
    try {
      const res = await fetch('/api/google-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, speakingRate: 0.9, pitch: 1.0 }),
      });
      const data = await res.json();
      if (data.audioContent) {
        const url = `data:audio/mp3;base64,${data.audioContent}`;
        googleTTSCache.set(text, url);
        return url;
      }
    } catch (err) {
      console.warn('Google TTS dynamic request failed:', err);
    }
    return null;
  }

  async function speak(text) {
    if (!audioEnabled) return;
    const url = await getAudioUrl(text);
    if (!url) return;
    const audio = new Audio(url);
    audio.play().catch(console.warn);
    return audio; // Caller can await audio.onended
  }

  async function narrate(segments) {
    // segments: array of text strings
    // Eagerly preload segment i+1 while playing segment i
    for (let i = 0; i < segments.length; i++) {
      // Preload next
      if (i + 1 < segments.length) {
        getAudioUrl(segments[i + 1]); // fire and forget — fills cache
      }
      await new Promise((resolve) => {
        getAudioUrl(segments[i]).then(url => {
          if (!url || !audioEnabled) { resolve(); return; }
          const audio = new Audio(url);
          audio.onended = resolve;
          audio.onerror = resolve;
          audio.play().catch(resolve);
        });
      });
    }
  }

  function preloadNarration(segments) {
    segments.forEach(text => getAudioUrl(text)); // warm cache silently
  }

  return { speak, narrate, preloadNarration };
}
