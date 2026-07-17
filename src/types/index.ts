export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export type QuizLevel = DifficultyLevel | "mixed";

export interface Question {
  id: string;
  level: DifficultyLevel;
  text: string;
  answer: boolean;
  explanation: string;
  tags?: string[];
}

export interface AnswerRecord {
  questionId: string;
  userAnswer: boolean | null;
  correct: boolean;
  pointsEarned: number;
  timeSpentMs: number;
}

export interface QuizSession {
  playerName: string;
  level: QuizLevel;
  questions: Question[];
  currentIndex: number;
  score: number;
  correctAnswers: number;
  streak: number;
  answers: AnswerRecord[];
  startedAt: string;
  finishedAt?: string;
}

export interface LeaderboardEntry {
  id: string;
  player_name: string;
  score: number;
  level: QuizLevel;
  correct_answers: number;
  total_questions: number;
  percentage: number;
  created_at: string;
}

export interface LeaderboardSubmitPayload {
  player_name: string;
  score: number;
  level: QuizLevel;
  correct_answers: number;
  total_questions: number;
  percentage: number;
}

export interface LeaderboardStats {
  bestScore: number;
  totalGames: number;
}

export type QuizPhase = "question" | "feedback" | "finished";

export interface PendingFeedback {
  questionId: string;
  userAnswer: boolean | null;
  correct: boolean;
  pointsEarned: number;
  timeSpentMs: number;
}

export interface QuizState {
  session: QuizSession | null;
  phase: QuizPhase;
  pendingFeedback: PendingFeedback | null;
  questionStartedAt: number | null;
}

export type PerformanceTitle =
  | "Cursor Master"
  | "Cursor Pro"
  | "Cursor Explorer"
  | "Cursor Beginner";

export interface PerformanceResult {
  title: PerformanceTitle;
  message: string;
}
