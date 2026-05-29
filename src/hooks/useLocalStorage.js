const STORAGE_KEY = 'intellia_pv_session';
const SESSION_TTL = 24 * 60 * 60 * 1000; // 24 hours in ms

export function useLocalStorage() {
  function saveSession(state) {
    const data = {
      ...state,
      savedAt: Date.now(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('localStorage save failed:', e);
    }
  }

  function loadSession() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (Date.now() - data.savedAt > SESSION_TTL) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return data;
    } catch (e) {
      return null;
    }
  }

  function clearSession() {
    localStorage.removeItem(STORAGE_KEY);
  }

  return { saveSession, loadSession, clearSession };
}
