"use client";

import { useCallback, useState } from "react";
import type {
  LeaderboardEntry,
  LeaderboardStats,
  LeaderboardSubmitPayload,
} from "@/types";

interface UseLeaderboardReturn {
  entries: LeaderboardEntry[];
  stats: LeaderboardStats;
  loading: boolean;
  error: string | null;
  fetchEntries: (level?: string) => Promise<void>;
  fetchStats: () => Promise<void>;
  submitScore: (
    payload: LeaderboardSubmitPayload,
  ) => Promise<{ id: string } | null>;
}

export function useLeaderboard(): UseLeaderboardReturn {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState<LeaderboardStats>({
    bestScore: 0,
    totalGames: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(async (level = "all") => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/leaderboard?level=${encodeURIComponent(level)}&limit=10`,
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Erro ao carregar ranking");
      }
      const data = await res.json();
      setEntries(data.entries ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/leaderboard/stats");
      if (!res.ok) return;
      const data = await res.json();
      setStats({
        bestScore: data.bestScore ?? 0,
        totalGames: data.totalGames ?? 0,
      });
    } catch {
      // Stats são opcionais na landing
    }
  }, []);

  const submitScore = useCallback(
    async (payload: LeaderboardSubmitPayload) => {
      try {
        const res = await fetch("/api/leaderboard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? "Erro ao salvar score");
        }
        return (await res.json()) as { id: string };
      } catch {
        return null;
      }
    },
    [],
  );

  return {
    entries,
    stats,
    loading,
    error,
    fetchEntries,
    fetchStats,
    submitScore,
  };
}
