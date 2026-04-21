import { describe, it, expect } from "vitest";
import {
  createInitialDecks,
  riffleShuffle,
  analyzeGilbreath,
} from "./gilbreath-principle.js";

describe("Gilbreath principle", () => {
  it("initial decks have opposite colors at every index", () => {
    const { deck1, deck2 } = createInitialDecks();
    for (let i = 0; i < deck1.length; i++) {
      expect(deck1[i].color).not.toBe(deck2[i].color);
    }
  });

  it("invariant holds after a single riffle shuffle", () => {
    const { deck1, deck2 } = createInitialDecks();
    const deck = riffleShuffle(deck1, deck2);
    const result = analyzeGilbreath(deck);
    expect(result.invariantHolds).toBe(true);
    expect(result.pairs.every(p => p.valid)).toBe(true);
  });

  it("invariant holds after 1000 independent shuffles", () => {
    const { deck1, deck2 } = createInitialDecks();
    for (let i = 0; i < 1000; i++) {
      const deck = riffleShuffle(deck1, deck2);
      const result = analyzeGilbreath(deck);
      expect(result.invariantHolds).toBe(true);
    }
  });

  it("each pair contains exactly one red and one black", () => {
    const { deck1, deck2 } = createInitialDecks();
    const deck = riffleShuffle(deck1, deck2);
    const result = analyzeGilbreath(deck);
    for (const pair of result.pairs) {
      expect(pair.a.color).not.toBe(pair.b.color);
    }
  });
});
