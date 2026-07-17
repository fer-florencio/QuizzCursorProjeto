import { describe, expect, it } from "vitest";
import {
  BASE_POINTS,
  MAX_SPEED_BONUS,
  STREAK_BONUS,
  calculatePercentage,
  calculatePoints,
} from "@/lib/scoring";

describe("calculatePoints", () => {
  it("retorna 0 para resposta incorreta", () => {
    expect(calculatePoints(false, 15000, 30000, 5)).toBe(0);
  });

  it("retorna pontos base quando tempo esgotado mas correto", () => {
    expect(calculatePoints(true, 0, 30000, 0)).toBe(BASE_POINTS);
  });

  it("aplica bônus de velocidade proporcional", () => {
    const points = calculatePoints(true, 15000, 30000, 0);
    expect(points).toBe(BASE_POINTS + MAX_SPEED_BONUS / 2);
  });

  it("aplica bônus de streak a partir de 3 acertos", () => {
    expect(calculatePoints(true, 30000, 30000, 3)).toBe(
      BASE_POINTS + MAX_SPEED_BONUS + STREAK_BONUS,
    );
  });

  it("não aplica streak bonus abaixo do threshold", () => {
    expect(calculatePoints(true, 30000, 30000, 2)).toBe(
      BASE_POINTS + MAX_SPEED_BONUS,
    );
  });
});

describe("calculatePercentage", () => {
  it("calcula porcentagem corretamente", () => {
    expect(calculatePercentage(8, 10)).toBe(80);
  });

  it("retorna 0 para total zero", () => {
    expect(calculatePercentage(0, 0)).toBe(0);
  });
});
