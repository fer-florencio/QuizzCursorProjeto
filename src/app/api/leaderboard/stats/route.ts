import { emptyStats } from "@/lib/leaderboard";
import { createApiClient } from "@/lib/supabase/api";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createApiClient();

    const [bestResult, countResult] = await Promise.all([
      supabase
        .from("leaderboard_entries")
        .select("score")
        .order("score", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("leaderboard_entries")
        .select("*", { count: "exact", head: true }),
    ]);

    if (bestResult.error || countResult.error) {
      return NextResponse.json(
        { error: bestResult.error?.message ?? countResult.error?.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      bestScore: bestResult.data?.score ?? 0,
      totalGames: countResult.count ?? 0,
    });
  } catch {
    return NextResponse.json(emptyStats());
  }
}
