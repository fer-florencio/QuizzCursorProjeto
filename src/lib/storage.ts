import { DEFAULT_PLAYER_NAME, STORAGE_KEYS } from "@/lib/config";
import type { QuizSession } from "@/types";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getPlayerName(): string {
  if (!isBrowser()) return DEFAULT_PLAYER_NAME;
  return localStorage.getItem(STORAGE_KEYS.PLAYER_NAME) || DEFAULT_PLAYER_NAME;
}

export function setPlayerName(name: string): void {
  if (!isBrowser()) return;
  const trimmed = name.trim() || DEFAULT_PLAYER_NAME;
  localStorage.setItem(STORAGE_KEYS.PLAYER_NAME, trimmed);
}

export function getLastEntryId(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(STORAGE_KEYS.LAST_ENTRY_ID);
}

export function setLastEntryId(id: string): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.LAST_ENTRY_ID, id);
}

export function saveQuizSession(session: QuizSession): void {
  if (!isBrowser()) return;
  sessionStorage.setItem(STORAGE_KEYS.QUIZ_SESSION, JSON.stringify(session));
}

export function getQuizSession(): QuizSession | null {
  if (!isBrowser()) return null;
  const raw = sessionStorage.getItem(STORAGE_KEYS.QUIZ_SESSION);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as QuizSession;
  } catch {
    return null;
  }
}

export function clearQuizSession(): void {
  if (!isBrowser()) return;
  sessionStorage.removeItem(STORAGE_KEYS.QUIZ_SESSION);
}
