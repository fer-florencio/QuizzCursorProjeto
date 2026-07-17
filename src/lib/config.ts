import type { QuizLevel } from "@/types";

export const LEVEL_CONFIG = {
  beginner: {
    label: "Iniciante",
    description: "Negócio, planos e posicionamento do Cursor",
    questionsPerSession: 10,
    timePerQuestionSec: 30,
    color: "emerald",
  },
  intermediate: {
    label: "Intermediário",
    description: "Tab, Agent, Rules, Skills, MCP e indexação",
    questionsPerSession: 10,
    timePerQuestionSec: 25,
    color: "blue",
  },
  advanced: {
    label: "Avançado",
    description: "Cloud Agents, SDK, Enterprise, Privacy e Bugbot",
    questionsPerSession: 10,
    timePerQuestionSec: 20,
    color: "purple",
  },
  mixed: {
    label: "Misto",
    description: "Mix de todos os níveis — desafio completo",
    questionsPerSession: 10,
    timePerQuestionSec: 25,
    color: "amber",
  },
} as const satisfies Record<
  QuizLevel,
  {
    label: string;
    description: string;
    questionsPerSession: number;
    timePerQuestionSec: number;
    color: string;
  }
>;

export const VALID_LEVELS = [
  "beginner",
  "intermediate",
  "advanced",
  "mixed",
] as const;

export const AUTO_ADVANCE_MS = 3000;
export const DEFAULT_PLAYER_NAME = "Anônimo";
export const MAX_PLAYER_NAME_LENGTH = 50;

export const STORAGE_KEYS = {
  PLAYER_NAME: "cursor-quiz-player-name",
  LAST_ENTRY_ID: "cursor-quiz-last-entry-id",
  QUIZ_SESSION: "cursor-quiz-session",
} as const;

export function getPerformanceResult(percentage: number) {
  if (percentage >= 90) {
    return {
      title: "Cursor Master" as const,
      message: "Você domina o ecossistema Cursor!",
    };
  }
  if (percentage >= 70) {
    return {
      title: "Cursor Pro" as const,
      message: "Ótimo conhecimento — quase lá!",
    };
  }
  if (percentage >= 50) {
    return {
      title: "Cursor Explorer" as const,
      message: "Bom começo — revise as explicações.",
    };
  }
  return {
    title: "Cursor Beginner" as const,
    message: "Hora de explorar mais o Cursor!",
  };
}

export function getLevelLabel(level: QuizLevel): string {
  return LEVEL_CONFIG[level].label;
}
