"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import type { Question } from "@/types";

interface FeedbackPanelProps {
  question: Question;
  correct: boolean;
  userAnswer: boolean | null;
  pointsEarned: number;
  onNext: () => void;
}

export function FeedbackPanel({
  question,
  correct,
  userAnswer,
  pointsEarned,
  onNext,
}: FeedbackPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-6 ${correct ? "border-success/40 bg-success/10" : "border-error/40 bg-error/10"}`}
    >
      <p className="text-lg font-bold text-white">
        {correct ? "Correto!" : "Incorreto"}
      </p>
      {!correct && (
        <p className="mt-2 text-sm text-white/70">
          Resposta correta:{" "}
          <strong>{question.answer ? "Verdadeiro" : "Falso"}</strong>
          {userAnswer === null && " (tempo esgotado)"}
        </p>
      )}
      <p className="mt-3 text-white/80">{question.explanation}</p>
      {pointsEarned > 0 && (
        <p className="mt-3 font-mono text-success">
          +{pointsEarned} pontos
        </p>
      )}
      <div className="mt-6">
        <Button onClick={onNext} fullWidth>
          Próxima
        </Button>
      </div>
    </motion.div>
  );
}
