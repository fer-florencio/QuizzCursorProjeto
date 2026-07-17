import type { LeaderboardStats } from "@/types";
import { Card } from "@/components/ui/Card";

interface StatsDisplayProps {
  stats: LeaderboardStats;
  loading?: boolean;
}

export function StatsDisplay({ stats, loading }: StatsDisplayProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <p className="text-sm text-white/50">Melhor score</p>
        <p className="mt-1 font-mono text-3xl font-bold text-primary">
          {loading ? "—" : stats.bestScore}
        </p>
      </Card>
      <Card>
        <p className="text-sm text-white/50">Partidas jogadas</p>
        <p className="mt-1 font-mono text-3xl font-bold text-white">
          {loading ? "—" : stats.totalGames}
        </p>
      </Card>
    </div>
  );
}
