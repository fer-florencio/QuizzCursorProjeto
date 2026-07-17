"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { LeaderboardTabs } from "@/components/leaderboard/LeaderboardTabs";
import { PageContainer } from "@/components/layout/PageContainer";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { getLastEntryId } from "@/lib/storage";
import type { QuizLevel } from "@/types";

export default function LeaderboardPage() {
  const { entries, loading, error, fetchEntries } = useLeaderboard();
  const [activeLevel, setActiveLevel] = useState<QuizLevel | "all">("all");
  const [highlightId, setHighlightId] = useState<string | null>(null);

  useEffect(() => {
    setHighlightId(getLastEntryId());
    fetchEntries(activeLevel);
  }, [activeLevel, fetchEntries]);

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
        <p className="mt-2 text-white/60">
          Top 10 jogadores — ranking global via Supabase
        </p>
      </div>

      <LeaderboardTabs activeLevel={activeLevel} onChange={setActiveLevel} />

      <div className="mt-6">
        {loading && (
          <p className="text-center text-white/50">Carregando ranking...</p>
        )}

        {error && (
          <div className="rounded-2xl border border-error/30 bg-error/10 p-6 text-center">
            <p className="text-error">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => fetchEntries(activeLevel)}
            >
              Tentar novamente
            </Button>
          </div>
        )}

        {!loading && !error && (
          <LeaderboardTable entries={entries} highlightId={highlightId} />
        )}
      </div>
    </PageContainer>
  );
}
