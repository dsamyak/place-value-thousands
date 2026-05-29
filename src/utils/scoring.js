export const XP_TABLE = {
  correctFirstTry: 20,
  correctWithHint1: 10,
  correctWithHint2: 5,
  worldCompletion: 50,
  threeStarBonus: 30,
  streakBonus: 10,   // added per question when streak >= 5
};

export function calculateStars(score) {
  if (score >= 9) return 3;
  if (score >= 7) return 2;
  if (score >= 6) return 1;
  return 0;
}

export function calculateXP({ correct, hintsUsed, streak }) {
  if (!correct) return 0;
  let xp = hintsUsed === 0
    ? XP_TABLE.correctFirstTry
    : hintsUsed === 1
      ? XP_TABLE.correctWithHint1
      : XP_TABLE.correctWithHint2;
  if (streak >= 5) xp += XP_TABLE.streakBonus;
  return xp;
}
