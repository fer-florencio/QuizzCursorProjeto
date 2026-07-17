import { LEVEL_CONFIG } from "@/lib/config";
import type { QuizLevel } from "@/types";
import { Card } from "@/components/ui/Card";

interface LevelCardProps {
  level: QuizLevel;
  selected?: boolean;
  onSelect: (level: QuizLevel) => void;
}

const colorClasses: Record<string, string> = {
  emerald: "border-emerald-500/40 hover:border-emerald-400",
  blue: "border-blue-500/40 hover:border-blue-400",
  purple: "border-purple-500/40 hover:border-purple-400",
  amber: "border-amber-500/40 hover:border-amber-400",
};

export function LevelCard({ level, selected, onSelect }: LevelCardProps) {
  const config = LEVEL_CONFIG[level];

  return (
    <button type="button" onClick={() => onSelect(level)} className="text-left">
      <Card
        hover
        className={`h-full cursor-pointer ${colorClasses[config.color]} ${selected ? "border-primary ring-2 ring-primary/30" : ""}`}
      >
        <h3 className="text-xl font-bold text-white">{config.label}</h3>
        <p className="mt-2 text-sm text-white/60">{config.description}</p>
        <div className="mt-4 flex gap-4 text-sm text-white/50">
          <span>{config.questionsPerSession} perguntas</span>
          <span>{config.timePerQuestionSec}s cada</span>
        </div>
      </Card>
    </button>
  );
}
