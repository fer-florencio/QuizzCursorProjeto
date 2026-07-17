import {
  DEFAULT_PLAYER_NAME,
  MAX_PLAYER_NAME_LENGTH,
  VALID_LEVELS,
} from "@/lib/config";
import { calculatePercentage } from "@/lib/scoring";
import type {
  LeaderboardEntry,
  LeaderboardStats,
  LeaderboardSubmitPayload,
  QuizLevel,
} from "@/types";

export function validateLeaderboardPayload(
  body: unknown,
):
  | { success: true; data: LeaderboardSubmitPayload }
  | { success: false; error: string } {
  if (!body || typeof body !== "object") {
    return { success: false, error: "Payload inválido" };
  }

  const raw = body as Record<string, unknown>;

  const playerName =
    typeof raw.player_name === "string"
      ? raw.player_name.trim() || DEFAULT_PLAYER_NAME
      : DEFAULT_PLAYER_NAME;

  if (playerName.length < 1 || playerName.length > MAX_PLAYER_NAME_LENGTH) {
    return {
      success: false,
      error: `player_name deve ter entre 1 e ${MAX_PLAYER_NAME_LENGTH} caracteres`,
    };
  }

  if (typeof raw.score !== "number" || !Number.isInteger(raw.score) || raw.score < 0) {
    return { success: false, error: "score deve ser um inteiro >= 0" };
  }

  if (
    typeof raw.level !== "string" ||
    !VALID_LEVELS.includes(raw.level as QuizLevel)
  ) {
    return { success: false, error: "level inválido" };
  }

  if (
    typeof raw.correct_answers !== "number" ||
    !Number.isInteger(raw.correct_answers) ||
    raw.correct_answers < 0
  ) {
    return { success: false, error: "correct_answers inválido" };
  }

  if (
    typeof raw.total_questions !== "number" ||
    !Number.isInteger(raw.total_questions) ||
    raw.total_questions <= 0
  ) {
    return { success: false, error: "total_questions inválido" };
  }

  if (raw.correct_answers > raw.total_questions) {
    return {
      success: false,
      error: "correct_answers não pode exceder total_questions",
    };
  }

  const expectedPercentage = calculatePercentage(
    raw.correct_answers,
    raw.total_questions,
  );

  const percentage =
    typeof raw.percentage === "number" ? raw.percentage : expectedPercentage;

  if (percentage < 0 || percentage > 100) {
    return { success: false, error: "percentage fora do intervalo 0-100" };
  }

  if (Math.abs(percentage - expectedPercentage) > 0.01) {
    return {
      success: false,
      error: "percentage inconsistente com acertos/total",
    };
  }

  return {
    success: true,
    data: {
      player_name: playerName,
      score: raw.score,
      level: raw.level as QuizLevel,
      correct_answers: raw.correct_answers,
      total_questions: raw.total_questions,
      percentage: expectedPercentage,
    },
  };
}

export function mapLeaderboardRow(row: {
  id: string;
  player_name: string;
  score: number;
  level: string;
  correct_answers: number;
  total_questions: number;
  percentage: number;
  created_at: string;
}): LeaderboardEntry {
  return {
    id: row.id,
    player_name: row.player_name,
    score: row.score,
    level: row.level as QuizLevel,
    correct_answers: row.correct_answers,
    total_questions: row.total_questions,
    percentage: Number(row.percentage),
    created_at: row.created_at,
  };
}

export function emptyStats(): LeaderboardStats {
  return { bestScore: 0, totalGames: 0 };
}
