"use client";

import { motion } from "framer-motion";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Timer } from "@/components/ui/Timer";

interface QuizHeaderProps {
  currentIndex: number;
  totalQuestions: number;
  score: number;
  streak: number;
  secondsRemaining: number;
  timerProgress: number;
  isUrgent: boolean;
}

export function QuizHeader({
  currentIndex,
  totalQuestions,
  score,
  streak,
  secondsRemaining,
  timerProgress,
  isUrgent,
}: QuizHeaderProps) {
  return (
    <div className="sticky top-0 z-10 -mx-4 border-b border-white/10 bg-background/95 px-4 py-4 backdrop-blur">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-white/50">
            Pergunta {currentIndex + 1}/{totalQuestions}
          </p>
          <p className="font-mono text-2xl font-bold text-primary">
            {score} pts
          </p>
        </div>
        <Timer
          secondsRemaining={secondsRemaining}
          progress={timerProgress}
          isUrgent={isUrgent}
        />
        {streak >= 3 && (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="rounded-full bg-warning/20 px-3 py-1 text-sm font-semibold text-warning"
          >
            🔥 {streak} streak
          </motion.div>
        )}
      </div>
      <ProgressBar value={currentIndex + 1} max={totalQuestions} />
    </div>
  );
}
