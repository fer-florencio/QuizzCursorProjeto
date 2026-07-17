export const BASE_POINTS = 100;
export const MAX_SPEED_BONUS = 50;
export const STREAK_BONUS = 25;
export const STREAK_THRESHOLD = 3;

export function calculatePoints(
  correct: boolean,
  timeRemainingMs: number,
  totalTimeMs: number,
  currentStreak: number,
): number {
  if (!correct) return 0;

  const speedBonus = Math.round(
    (timeRemainingMs / totalTimeMs) * MAX_SPEED_BONUS,
  );
  const streakBonus =
    currentStreak >= STREAK_THRESHOLD ? STREAK_BONUS : 0;

  return BASE_POINTS + speedBonus + streakBonus;
}

export function calculatePercentage(
  correctAnswers: number,
  totalQuestions: number,
): number {
  if (totalQuestions === 0) return 0;
  return Math.round((correctAnswers / totalQuestions) * 10000) / 100;
}
