"use client";

import { LEVEL_CONFIG } from "@/lib/config";
import type { QuizLevel } from "@/types";

interface LeaderboardTabsProps {
  activeLevel: QuizLevel | "all";
  onChange: (level: QuizLevel | "all") => void;
}

const tabs: { id: QuizLevel | "all"; label: string }[] = [
  { id: "all", label: "Geral" },
  { id: "beginner", label: LEVEL_CONFIG.beginner.label },
  { id: "intermediate", label: LEVEL_CONFIG.intermediate.label },
  { id: "advanced", label: LEVEL_CONFIG.advanced.label },
  { id: "mixed", label: LEVEL_CONFIG.mixed.label },
];

export function LeaderboardTabs({ activeLevel, onChange }: LeaderboardTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeLevel === tab.id
              ? "bg-primary text-white"
              : "bg-white/5 text-white/70 hover:bg-white/10"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
