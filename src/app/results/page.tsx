"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Confetti } from "@/components/ui/Confetti";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageContainer } from "@/components/layout/PageContainer";
import { getPerformanceResult, getLevelLabel } from "@/lib/config";
import { calculatePercentage } from "@/lib/scoring";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import {
  clearQuizSession,
  getQuizSession,
  setLastEntryId,
} from "@/lib/storage";
import type { QuizSession } from "@/types";

export default function ResultsPage() {
  const router = useRouter();
  const { submitScore } = useLeaderboard();
  const [session, setSession] = useState<QuizSession | null>(null);
  const [submitting, setSubmitting] = useState(true);
  const [submitError, setSubmitError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const submittedRef = useRef(false);

  useEffect(() => {
    const saved = getQuizSession();
    if (!saved?.finishedAt) {
      router.replace("/");
      return;
    }
    setSession(saved);
  }, [router]);

  useEffect(() => {
    if (!session) return;

    let cancelled = false;

    async function submit() {
      setSubmitting(true);
      setSubmitError(false);

      const percentage = calculatePercentage(
        session!.correctAnswers,
        session!.questions.length,
      );

      const result = await submitScore({
        player_name: session!.playerName,
        score: session!.score,
        level: session!.level,
        correct_answers: session!.correctAnswers,
        total_questions: session!.questions.length,
        percentage,
      });

      if (cancelled) return;

      if (result?.id) {
        setLastEntryId(result.id);
        submittedRef.current = true;
      } else {
        setSubmitError(true);
      }
      setSubmitting(false);
    }

    if (!submittedRef.current || retryCount > 0) {
      submit();
    }

    return () => {
      cancelled = true;
    };
  }, [session, submitScore, retryCount]);

  function handlePlayAgain() {
    if (!session) return;
    clearQuizSession();
    router.push(
      `/quiz?level=${session.level}&name=${encodeURIComponent(session.playerName)}`,
    );
  }

  if (!session) {
    return (
      <PageContainer>
        <p className="text-center text-white/60">Carregando resultado...</p>
      </PageContainer>
    );
  }

  const percentage = calculatePercentage(
    session.correctAnswers,
    session.questions.length,
  );
  const performance = getPerformanceResult(percentage);
  const showConfetti = percentage >= 90;

  const startedAt = new Date(session.startedAt).getTime();
  const finishedAt = session.finishedAt
    ? new Date(session.finishedAt).getTime()
    : Date.now();
  const totalTimeSec = Math.round((finishedAt - startedAt) / 1000);

  return (
    <PageContainer className="max-w-2xl">
      <Confetti active={showConfetti} />

      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Resultado</h1>
        <p className="mt-2 text-white/60">{getLevelLabel(session.level)}</p>
      </div>

      <Card className="mt-8 text-center">
        <p className="font-mono text-5xl font-bold text-primary">
          {session.score}
        </p>
        <p className="mt-2 text-white/60">pontos</p>

        <div className="mt-6 grid grid-cols-2 gap-4 text-left">
          <div>
            <p className="text-sm text-white/50">Acertos</p>
            <p className="text-xl font-semibold text-white">
              {session.correctAnswers}/{session.questions.length}
            </p>
          </div>
          <div>
            <p className="text-sm text-white/50">Porcentagem</p>
            <p className="text-xl font-semibold text-white">{percentage}%</p>
          </div>
          <div>
            <p className="text-sm text-white/50">Tempo total</p>
            <p className="text-xl font-semibold text-white">
              {Math.floor(totalTimeSec / 60)}:
              {(totalTimeSec % 60).toString().padStart(2, "0")}
            </p>
          </div>
          <div>
            <p className="text-sm text-white/50">Classificação</p>
            <p className="text-xl font-semibold text-primary">
              {performance.title}
            </p>
          </div>
        </div>

        <p className="mt-6 text-white/70">{performance.message}</p>
      </Card>

      {submitting && (
        <p className="mt-4 text-center text-sm text-white/50">
          Salvando score no ranking...
        </p>
      )}
      {submitError && (
        <div className="mt-4 text-center">
          <p className="text-sm text-error">
            Não foi possível salvar no ranking. Tente novamente.
          </p>
          <Button
            variant="outline"
            className="mt-2"
            onClick={() => setRetryCount((c) => c + 1)}
          >
            Tentar novamente
          </Button>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button onClick={handlePlayAgain}>Jogar Novamente</Button>
        <Link href="/leaderboard">
          <Button variant="outline" fullWidth>
            Ver Leaderboard
          </Button>
        </Link>
        <Link href="/">
          <Button variant="ghost" fullWidth>
            Escolher Outro Nível
          </Button>
        </Link>
      </div>
    </PageContainer>
  );
}
