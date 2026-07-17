import { LEVEL_CONFIG } from "@/lib/config";
import { calculatePoints } from "@/lib/scoring";
import type {
  PendingFeedback,
  QuizLevel,
  QuizSession,
  QuizState,
} from "@/types";

export type QuizAction =
  | {
      type: "START";
      playerName: string;
      level: QuizLevel;
      questions: QuizSession["questions"];
    }
  | {
      type: "ANSWER";
      userAnswer: boolean;
      timeRemainingMs: number;
      totalTimeMs: number;
    }
  | {
      type: "TIMEOUT";
      totalTimeMs: number;
    }
  | { type: "NEXT" };

export const initialQuizState: QuizState = {
  session: null,
  phase: "question",
  pendingFeedback: null,
  questionStartedAt: null,
};

function processAnswer(
  state: QuizState,
  userAnswer: boolean | null,
  timeRemainingMs: number,
  totalTimeMs: number,
): QuizState {
  const session = state.session;
  if (!session || state.phase !== "question") return state;

  const question = session.questions[session.currentIndex];
  const timeSpentMs = totalTimeMs - timeRemainingMs;
  const correct = userAnswer !== null && userAnswer === question.answer;
  const nextStreak = correct ? session.streak + 1 : 0;
  const pointsEarned = calculatePoints(
    correct,
    timeRemainingMs,
    totalTimeMs,
    nextStreak,
  );

  const pendingFeedback: PendingFeedback = {
    questionId: question.id,
    userAnswer,
    correct,
    pointsEarned,
    timeSpentMs,
  };

  const updatedSession: QuizSession = {
    ...session,
    score: session.score + pointsEarned,
    correctAnswers: session.correctAnswers + (correct ? 1 : 0),
    streak: nextStreak,
    answers: [
      ...session.answers,
      {
        questionId: question.id,
        userAnswer,
        correct,
        pointsEarned,
        timeSpentMs,
      },
    ],
  };

  const isLastQuestion =
    session.currentIndex >= session.questions.length - 1;

  return {
    session: updatedSession,
    phase: "feedback",
    pendingFeedback,
    questionStartedAt: null,
    ...(isLastQuestion ? {} : {}),
  };
}

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "START":
      return {
        session: {
          playerName: action.playerName,
          level: action.level,
          questions: action.questions,
          currentIndex: 0,
          score: 0,
          correctAnswers: 0,
          streak: 0,
          answers: [],
          startedAt: new Date().toISOString(),
        },
        phase: "question",
        pendingFeedback: null,
        questionStartedAt: Date.now(),
      };

    case "ANSWER":
      return processAnswer(
        state,
        action.userAnswer,
        action.timeRemainingMs,
        action.totalTimeMs,
      );

    case "TIMEOUT":
      return processAnswer(state, null, 0, action.totalTimeMs);

    case "NEXT": {
      const session = state.session;
      if (!session || state.phase !== "feedback") return state;

      const isLastQuestion =
        session.currentIndex >= session.questions.length - 1;

      if (isLastQuestion) {
        return {
          session: {
            ...session,
            finishedAt: new Date().toISOString(),
          },
          phase: "finished",
          pendingFeedback: state.pendingFeedback,
          questionStartedAt: null,
        };
      }

      return {
        session: {
          ...session,
          currentIndex: session.currentIndex + 1,
        },
        phase: "question",
        pendingFeedback: null,
        questionStartedAt: Date.now(),
      };
    }

    default:
      return state;
  }
}

export function getTotalTimeMs(level: QuizLevel): number {
  return LEVEL_CONFIG[level].timePerQuestionSec * 1000;
}
