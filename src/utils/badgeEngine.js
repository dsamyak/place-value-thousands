export const BADGE_DEFINITIONS = [
  {
    id: 'ones_explorer',
    name: 'Ones Explorer',
    icon: '🔢',
    description: 'Complete World 1',
    condition: (state) => state.worldScores[0]?.score >= 6,
  },
  {
    id: 'hundreds_hero',
    name: 'Hundreds Hero',
    icon: '💯',
    description: 'Complete Worlds 2 and 3',
    condition: (state) => state.worldScores[1]?.score >= 6 && state.worldScores[2]?.score >= 6,
  },
  {
    id: 'thousands_champion',
    name: 'Thousands Champion',
    icon: '🏆',
    description: 'Complete Worlds 1–5',
    condition: (state) => state.worldScores.slice(0,5).every(w => w?.score >= 6),
  },
  {
    id: 'zero_master',
    name: 'Zero Master',
    icon: '0️⃣',
    description: 'Answer 5 consecutive zero-placeholder questions correctly',
    condition: (state) => {
      // Check last 5 answered questions; all hasZero && correct
      const recent = state.answerHistory.slice(-5);
      return recent.length === 5 && recent.every(a => a.hasZero && a.correct);
    },
  },
  {
    id: 'speed_star',
    name: 'Speed Star',
    icon: '⚡',
    description: 'Answer 5 in a row under 10 seconds each (World 10)',
    condition: (state) => {
      const w10 = state.answerHistory.filter(a => a.worldIndex === 9);
      // Check any consecutive 5 with time < 10s
      for (let i = 0; i <= w10.length - 5; i++) {
        if (w10.slice(i, i+5).every(a => a.timeMs < 10000 && a.correct)) return true;
      }
      return false;
    },
  },
  {
    id: 'perfect_placer',
    name: 'Perfect Placer',
    icon: '⭐',
    description: 'Achieve 3 stars on any 5 worlds',
    condition: (state) => state.worldScores.filter(w => w?.stars === 3).length >= 5,
  },
  {
    id: 'place_value_pro',
    name: 'Place Value Pro',
    icon: '🎓',
    description: 'Complete all 10 worlds',
    condition: (state) => state.worldScores.every(w => w?.score >= 6),
  },
  {
    id: 'grand_explorer',
    name: 'Grand Explorer',
    icon: '🌟',
    description: 'Complete 100 questions with ≥80% accuracy',
    condition: (state) => {
      const total = state.answerHistory.length;
      const correct = state.answerHistory.filter(a => a.correct).length;
      return total === 100 && (correct / total) >= 0.8;
    },
  },
];

export function checkBadges(state) {
  return BADGE_DEFINITIONS
    .filter(b => !state.badgesEarned.includes(b.id) && b.condition(state))
    .map(b => b.id);
}
