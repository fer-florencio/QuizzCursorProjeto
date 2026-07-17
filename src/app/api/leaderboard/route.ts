import { createApiClient } from "@/lib/supabase/api";
import {
  mapLeaderboardRow,
  validateLeaderboardPayload,
} from "@/lib/leaderboard";
import type { QuizLevel } from "@/types";
import { NextRequest, NextResponse } from "next/server";

function parseLimit(value: string | null): number {
  const parsed = Number(value ?? "10");
  if (!Number.isInteger(parsed) || parsed < 1) return 10;
  return Math.min(parsed, 50);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get("level") ?? "all";
  const limit = parseLimit(searchParams.get("limit"));

  if (
    level !== "all" &&
    !["beginner", "intermediate", "advanced", "mixed"].includes(level)
  ) {
    return NextResponse.json({ error: "level inválido" }, { status: 400 });
  }

  try {
    const supabase = createApiClient();
    let query = supabase
      .from("leaderboard_entries")
      .select("*")
      .order("score", { ascending: false })
      .limit(limit);

    if (level !== "all") {
      query = query.eq("level", level as QuizLevel);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      entries: (data ?? []).map(mapLeaderboardRow),
    });
  } catch {
    return NextResponse.json(
      { error: "Falha ao conectar ao Supabase" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const validation = validateLeaderboardPayload(body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  try {
    const supabase = createApiClient();
    const { data, error } = await supabase
      .from("leaderboard_entries")
      .insert(validation.data)
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Falha ao conectar ao Supabase" },
      { status: 500 },
    );
  }
}
