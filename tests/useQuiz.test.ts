import { describe, expect, it } from "vitest";
import {
  getTotalTimeMs,
  initialQuizState,
  quizReducer,
} from "@/hooks/useQuiz";
import type { Question } from "@/types";

const mockQuestions: Question[] = [
  {
    id: "q1",
    level: "beginner",
    text: "Pergunta 1",
    answer: true,
    explanation: "Exp 1",
  },
  {
    id: "q2",
    level: "beginner",
    text: "Pergunta 2",
    answer: false,
    explanation: "Exp 2",
  },
];

describe("quizReducer", () => {
  it("inicia sessão corretamente", () => {
    const state = quizReducer(initialQuizState, {
      type: "START",
      playerName: "Bruno",
      level: "beginner",
      questions: mockQuestions,
    });

    expect(state.session?.playerName).toBe("Bruno");
    expect(state.session?.currentIndex).toBe(0);
    expect(state.phase).toBe("question");
  });

  it("processa resposta correta", () => {
    let state = quizReducer(initialQuizState, {
      type: "START",
      playerName: "Ana",
      level: "beginner",
      questions: mockQuestions,
    });

    state = quizReducer(state, {
      type: "ANSWER",
      userAnswer: true,
      timeRemainingMs: 20000,
      totalTimeMs: 30000,
    });

    expect(state.phase).toBe("feedback");
    expect(state.session?.correctAnswers).toBe(1);
    expect(state.session?.score).toBeGreaterThan(0);
  });

  it("processa timeout como erro", () => {
    let state = quizReducer(initialQuizState, {
      type: "START",
      playerName: "Ana",
      level: "beginner",
      questions: mockQuestions,
    });

    state = quizReducer(state, {
      type: "TIMEOUT",
      totalTimeMs: 30000,
    });

    expect(state.phase).toBe("feedback");
    expect(state.pendingFeedback?.correct).toBe(false);
    expect(state.pendingFeedback?.userAnswer).toBeNull();
    expect(state.session?.score).toBe(0);
  });

  it("avança para próxima pergunta", () => {
    let state = quizReducer(initialQuizState, {
      type: "START",
      playerName: "Ana",
      level: "beginner",
      questions: mockQuestions,
    });

    state = quizReducer(state, {
      type: "ANSWER",
      userAnswer: true,
      timeRemainingMs: 20000,
      totalTimeMs: 30000,
    });

    state = quizReducer(state, { type: "NEXT" });

    expect(state.phase).toBe("question");
    expect(state.session?.currentIndex).toBe(1);
  });

  it("finaliza na última pergunta", () => {
    let state = quizReducer(initialQuizState, {
      type: "START",
      playerName: "Ana",
      level: "beginner",
      questions: [mockQuestions[0]],
    });

    state = quizReducer(state, {
      type: "ANSWER",
      userAnswer: true,
      timeRemainingMs: 20000,
      totalTimeMs: 30000,
    });

    state = quizReducer(state, { type: "NEXT" });

    expect(state.phase).toBe("finished");
    expect(state.session?.finishedAt).toBeDefined();
  });
});

describe("getTotalTimeMs", () => {
  it("retorna tempo correto por nível", () => {
    expect(getTotalTimeMs("beginner")).toBe(30000);
    expect(getTotalTimeMs("advanced")).toBe(20000);
  });
});
