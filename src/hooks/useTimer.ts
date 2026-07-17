"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseTimerOptions {
  durationMs: number;
  isRunning: boolean;
  onTimeout: () => void;
  resetKey: string | number;
}

export function useTimer({
  durationMs,
  isRunning,
  onTimeout,
  resetKey,
}: UseTimerOptions) {
  const [timeRemainingMs, setTimeRemainingMs] = useState(durationMs);
  const onTimeoutRef = useRef(onTimeout);
  const hasTimedOutRef = useRef(false);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  useEffect(() => {
    setTimeRemainingMs(durationMs);
    hasTimedOutRef.current = false;
  }, [durationMs, resetKey]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeRemainingMs((prev) => {
        const next = prev - 100;
        if (next <= 0 && !hasTimedOutRef.current) {
          hasTimedOutRef.current = true;
          onTimeoutRef.current();
          return 0;
        }
        return Math.max(0, next);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, resetKey]);

  const progress = durationMs > 0 ? timeRemainingMs / durationMs : 0;
  const secondsRemaining = Math.ceil(timeRemainingMs / 1000);
  const isUrgent = secondsRemaining <= 5 && isRunning;

  const reset = useCallback(() => {
    setTimeRemainingMs(durationMs);
    hasTimedOutRef.current = false;
  }, [durationMs]);

  return {
    timeRemainingMs,
    secondsRemaining,
    progress,
    isUrgent,
    reset,
  };
}
