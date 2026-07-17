import { describe, expect, it } from "vitest";
import { pickRandom, shuffle } from "@/lib/shuffle";

describe("shuffle", () => {
  it("mantém os mesmos elementos", () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffle(input);
    expect(result.sort()).toEqual(input.sort());
  });

  it("não muta o array original", () => {
    const input = [1, 2, 3];
    shuffle(input);
    expect(input).toEqual([1, 2, 3]);
  });

  it("pode alterar a ordem", () => {
    const input = Array.from({ length: 20 }, (_, i) => i);
    const results = new Set(
      Array.from({ length: 10 }, () => shuffle(input).join(",")),
    );
    expect(results.size).toBeGreaterThan(1);
  });
});

describe("pickRandom", () => {
  it("retorna quantidade solicitada", () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    expect(pickRandom(input, 3)).toHaveLength(3);
  });

  it("não excede tamanho do array", () => {
    expect(pickRandom([1, 2], 10)).toHaveLength(2);
  });
});
