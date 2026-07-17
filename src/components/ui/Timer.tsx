"use client";

import { motion } from "framer-motion";

interface TimerProps {
  secondsRemaining: number;
  progress: number;
  isUrgent: boolean;
}

export function Timer({ secondsRemaining, progress, isUrgent }: TimerProps) {
  const circumference = 2 * Math.PI * 44;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div
      className="relative flex h-24 w-24 items-center justify-center"
      aria-live="polite"
      aria-label={`${secondsRemaining} segundos restantes`}
    >
      <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          className="text-white/10"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.1 }}
          className={isUrgent ? "text-error" : "text-primary"}
        />
      </svg>
      <motion.span
        animate={isUrgent ? { scale: [1, 1.08, 1] } : { scale: 1 }}
        transition={
          isUrgent
            ? { repeat: Infinity, duration: 0.8 }
            : { duration: 0.2 }
        }
        className={`absolute font-mono text-2xl font-bold ${isUrgent ? "text-warning" : "text-white"}`}
      >
        {secondsRemaining}
      </motion.span>
    </div>
  );
}
