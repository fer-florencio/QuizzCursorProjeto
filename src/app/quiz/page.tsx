import { Suspense } from "react";
import { QuizClient } from "./QuizClient";

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-white/60">
          Carregando quiz...
        </div>
      }
    >
      <QuizClient />
    </Suspense>
  );
}
