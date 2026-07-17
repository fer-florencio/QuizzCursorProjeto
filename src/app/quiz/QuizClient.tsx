"use client";

import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnswerButtons } from "@/components/quiz/AnswerButtons";
import { FeedbackPanel } from "@/components/quiz/FeedbackPanel";
import { QuestionDisplay } from "@/components/quiz/QuestionDisplay";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { selectSessionQuestions } from "@/data/questions";
import { AUTO_ADVANCE_MS, VALID_LEVELS } from "@/lib/config";
import {
  getTotalTimeMs,
  initialQuizState,
  quizReducer,
} from "@/hooks/useQuiz";
import { useTimer } from "@/hooks/useTimer";
import { saveQuizSession } from "@/lib/storage";
import type { QuizLevel } from "@/types";

export function QuizClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, dispatch] = useReducer(quizReducer, initialQuizState);
  const [initialized, setInitialized] = useState(false);
  const answeredRef = useRef(false);

  const levelParam = searchParams.get("level");
  const nameParam = searchParams.get("name") ?? "Anônimo";
  const level = VALID_LEVELS.includes(levelParam as QuizLevel)
    ? (levelParam as QuizLevel)
    : null;

  const totalTimeMs = level ? getTotalTimeMs(level) : 30000;
  const currentQuestion = state.session?.questions[state.session.currentIndex];

  const handleTimeout = useCallback(() => {
    if (answeredRef.current || state.phase !== "question") return;
    answeredRef.current = true;
    dispatch({ type: "TIMEOUT", totalTimeMs });
  }, [state.phase, totalTimeMs]);

  const timer = useTimer({
    durationMs: totalTimeMs,
    isRunning: state.phase === "question" && initialized,
    onTimeout: handleTimeout,
    resetKey: `${state.session?.currentIndex ?? 0}-${state.phase}`,
  });

  useEffect(() => {
    if (!level || initialized) return;
    const questions = selectSessionQuestions(level);
    dispatch({
      type: "START",
      playerName: decodeURIComponent(nameParam),
      level,
      questions,
    });
    setInitialized(true);
  }, [level, nameParam, initialized]);

  useEffect(() => {
    if (!level) {
      router.replace("/");
    }
  }, [level, router]);

  useEffect(() => {
    answeredRef.current = false;
  }, [state.session?.currentIndex, state.phase]);

  useEffect(() => {
    if (state.phase !== "finished" || !state.session) return;
    saveQuizSession(state.session);
    router.push("/results");
  }, [state.phase, state.session, router]);

  useEffect(() => {
    if (state.phase !== "feedback") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        dispatch({ type: "NEXT" });
      }
    };

    const autoAdvance = setTimeout(() => {
      dispatch({ type: "NEXT" });
    }, AUTO_ADVANCE_MS);

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(autoAdvance);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [state.phase, state.session?.currentIndex]);

  useEffect(() => {
    if (state.phase !== "question") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (answeredRef.current) return;
      const key = e.key.toLowerCase();
      if (key === "v") {
        answeredRef.current = true;
        dispatch({
          type: "ANSWER",
          userAnswer: true,
          timeRemainingMs: timer.timeRemainingMs,
          totalTimeMs,
        });
      } else if (key === "f") {
        answeredRef.current = true;
        dispatch({
          type: "ANSWER",
          userAnswer: false,
          timeRemainingMs: timer.timeRemainingMs,
          totalTimeMs,
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.phase, timer.timeRemainingMs, totalTimeMs]);

  function handleAnswer(userAnswer: boolean) {
    if (answeredRef.current || state.phase !== "question") return;
    answeredRef.current = true;
    dispatch({
      type: "ANSWER",
      userAnswer,
      timeRemainingMs: timer.timeRemainingMs,
      totalTimeMs,
    });
  }

  function handleNext() {
    dispatch({ type: "NEXT" });
  }

  if (!level || !state.session || !currentQuestion) {
    return (
      <PageContainer>
        <p className="text-center text-white/60">Carregando quiz...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="max-w-3xl">
      <QuizHeader
        currentIndex={state.session.currentIndex}
        totalQuestions={state.session.questions.length}
        score={state.session.score}
        streak={state.session.streak}
        secondsRemaining={timer.secondsRemaining}
        timerProgress={timer.progress}
        isUrgent={timer.isUrgent}
      />

      <div className="mt-8 space-y-8">
        {state.phase === "question" && (
          <>
            <QuestionDisplay text={currentQuestion.text} />
            <AnswerButtons onAnswer={handleAnswer} />
            <p className="text-center text-sm text-white/40">
              Atalhos: V = Verdadeiro, F = Falso
            </p>
          </>
        )}

        {state.phase === "feedback" && state.pendingFeedback && (
          <FeedbackPanel
            question={currentQuestion}
            correct={state.pendingFeedback.correct}
            userAnswer={state.pendingFeedback.userAnswer}
            pointsEarned={state.pendingFeedback.pointsEarned}
            onNext={handleNext}
          />
        )}
      </div>
    </PageContainer>
  );
}
