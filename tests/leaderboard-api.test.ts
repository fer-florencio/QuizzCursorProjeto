import { describe, expect, it } from "vitest";
import { validateLeaderboardPayload } from "@/lib/leaderboard";

describe("validateLeaderboardPayload", () => {
  const validPayload = {
    player_name: "Bruno",
    score: 1250,
    level: "intermediate",
    correct_answers: 8,
    total_questions: 10,
    percentage: 80,
  };

  it("aceita payload válido", () => {
    const result = validateLeaderboardPayload(validPayload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.player_name).toBe("Bruno");
    }
  });

  it("usa Anônimo quando nome vazio", () => {
    const result = validateLeaderboardPayload({
      ...validPayload,
      player_name: "   ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.player_name).toBe("Anônimo");
    }
  });

  it("rejeita score negativo", () => {
    const result = validateLeaderboardPayload({
      ...validPayload,
      score: -1,
    });
    expect(result.success).toBe(false);
  });

  it("rejeita level inválido", () => {
    const result = validateLeaderboardPayload({
      ...validPayload,
      level: "expert",
    });
    expect(result.success).toBe(false);
  });

  it("rejeita percentage inconsistente", () => {
    const result = validateLeaderboardPayload({
      ...validPayload,
      percentage: 50,
    });
    expect(result.success).toBe(false);
  });

  it("rejeita nome muito longo", () => {
    const result = validateLeaderboardPayload({
      ...validPayload,
      player_name: "a".repeat(51),
    });
    expect(result.success).toBe(false);
  });
});
