import { audioMap } from '../utils/audioMap';

export function useAudio(audioEnabled) {

  function getAudioUrl(text) {
    // Only use pre-generated audio from audioMap
    return audioMap[text] || null;
  }

  async function speak(text) {
    if (!audioEnabled) return;
    const url = getAudioUrl(text);
    if (!url) return;
    const audio = new Audio(url);
    audio.play().catch(console.warn);
    return audio;
  }

  async function narrate(segments) {
    for (let i = 0; i < segments.length; i++) {
      await new Promise((resolve) => {
        const url = getAudioUrl(segments[i]);
        if (!url || !audioEnabled) { resolve(); return; }
        const audio = new Audio(url);
        audio.onended = resolve;
        audio.onerror = resolve;
        audio.play().catch(resolve);
      });
    }
  }

  function preloadNarration(segments) {
    // No-op: static files are served by the browser cache
  }

  return { speak, narrate, preloadNarration };
}
