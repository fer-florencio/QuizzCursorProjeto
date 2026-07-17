"use client";

import { Button } from "@/components/ui/Button";

interface AnswerButtonsProps {
  onAnswer: (answer: boolean) => void;
  disabled?: boolean;
}

export function AnswerButtons({ onAnswer, disabled }: AnswerButtonsProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
      <Button
        variant="success"
        onClick={() => onAnswer(true)}
        disabled={disabled}
        aria-label="Verdadeiro"
        className="flex-1 sm:max-w-xs"
      >
        ✓ Verdadeiro
      </Button>
      <Button
        variant="danger"
        onClick={() => onAnswer(false)}
        disabled={disabled}
        aria-label="Falso"
        className="flex-1 sm:max-w-xs"
      >
        ✗ Falso
      </Button>
    </div>
  );
}
