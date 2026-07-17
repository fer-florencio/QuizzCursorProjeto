"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { StatsDisplay } from "@/components/leaderboard/StatsDisplay";
import { PageContainer } from "@/components/layout/PageContainer";
import { LevelCard } from "@/components/quiz/LevelCard";
import { PlayerNameInput } from "@/components/quiz/PlayerNameInput";
import { DEFAULT_PLAYER_NAME } from "@/lib/config";
import { getPlayerName, setPlayerName } from "@/lib/storage";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import type { QuizLevel } from "@/types";

const LEVELS: QuizLevel[] = [
  "beginner",
  "intermediate",
  "advanced",
  "mixed",
];

export default function HomePage() {
  const router = useRouter();
  const { stats, fetchStats } = useLeaderboard();
  const [showLevels, setShowLevels] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<QuizLevel | null>(null);
  const [playerName, setPlayerNameState] = useState(DEFAULT_PLAYER_NAME);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    setPlayerNameState(getPlayerName());
    fetchStats().finally(() => setStatsLoading(false));
  }, [fetchStats]);

  function handleStartQuiz() {
    if (!selectedLevel) return;
    const name = playerName.trim() || DEFAULT_PLAYER_NAME;
    setPlayerName(name);
    router.push(
      `/quiz?level=${selectedLevel}&name=${encodeURIComponent(name)}`,
    );
  }

  return (
    <PageContainer>
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
          Cursor <span className="text-primary">Quiz</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/60">
          Teste seu conhecimento sobre o ecossistema Cursor IDE — do negócio ao
          técnico avançado. Verdadeiro ou Falso, com ranking global.
        </p>

        <div className="mt-10">
          <StatsDisplay stats={stats} loading={statsLoading} />
        </div>

        {!showLevels ? (
          <div className="mt-10">
            <Button onClick={() => setShowLevels(true)} className="px-10">
              Começar
            </Button>
          </div>
        ) : (
          <div className="mt-10 space-y-8 text-left">
            <div className="flex justify-center">
              <PlayerNameInput
                value={playerName}
                onChange={setPlayerNameState}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {LEVELS.map((level) => (
                <LevelCard
                  key={level}
                  level={level}
                  selected={selectedLevel === level}
                  onSelect={setSelectedLevel}
                />
              ))}
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleStartQuiz}
                disabled={!selectedLevel}
                className="px-10"
              >
                Iniciar Quiz
              </Button>
            </div>
          </div>
        )}
      </section>
    </PageContainer>
  );
}
