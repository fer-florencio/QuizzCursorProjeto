import { getLevelLabel } from "@/lib/config";
import type { LeaderboardEntry } from "@/types";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  highlightId?: string | null;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function LeaderboardTable({
  entries,
  highlightId,
}: LeaderboardTableProps) {
  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-card p-8 text-center text-white/60">
        Nenhuma partida registrada ainda. Seja o primeiro!
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-white/5 text-white/60">
          <tr>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Nome</th>
            <th className="px-4 py-3">Score</th>
            <th className="px-4 py-3">Acertos</th>
            <th className="px-4 py-3">Nível</th>
            <th className="px-4 py-3">Data</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr
              key={entry.id}
              className={`border-t border-white/5 ${entry.id === highlightId ? "bg-primary/20" : ""}`}
            >
              <td className="px-4 py-3 font-mono">{index + 1}</td>
              <td className="px-4 py-3 font-medium text-white">
                {entry.player_name}
              </td>
              <td className="px-4 py-3 font-mono text-primary">
                {entry.score}
              </td>
              <td className="px-4 py-3">
                {entry.correct_answers}/{entry.total_questions}
              </td>
              <td className="px-4 py-3">{getLevelLabel(entry.level)}</td>
              <td className="px-4 py-3 text-white/50">
                {formatDate(entry.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
