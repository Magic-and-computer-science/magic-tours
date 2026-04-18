export type CardColor = 'red' | 'black';

export interface Card {
  id: string;
  color: CardColor;
  suit: string;
}

export interface PairResult {
  a: Card;
  b: Card;
  valid: boolean;
}

export interface ShuffleResult {
  deck: Card[];
  pairs: PairResult[];
  invariantHolds: boolean;
}

export function createInitialDecks(): { deck1: Card[]; deck2: Card[] } {
  return {
    deck1: [
      { id: 'd1-0', color: 'red', suit: '♥' },
      { id: 'd1-1', color: 'black', suit: '♠' },
      { id: 'd1-2', color: 'red', suit: '♦' },
      { id: 'd1-3', color: 'black', suit: '♣' },
      { id: 'd1-4', color: 'red', suit: '♥' },
      { id: 'd1-5', color: 'black', suit: '♠' },
    ],
    deck2: [
      { id: 'd2-0', color: 'black', suit: '♣' },
      { id: 'd2-1', color: 'red', suit: '♦' },
      { id: 'd2-2', color: 'black', suit: '♠' },
      { id: 'd2-3', color: 'red', suit: '♥' },
      { id: 'd2-4', color: 'black', suit: '♣' },
      { id: 'd2-5', color: 'red', suit: '♦' },
    ],
  };
}

// Any interleaving of deck1 and deck2 preserves the Gilbreath invariant.
// Invariant: deck1[i] and deck2[i] are always opposite colors.
// Therefore, the next two cards from the merged sequence always form a valid pair.
export function riffleShuffle(deck1: Card[], deck2: Card[]): Card[] {
  const result: Card[] = [];
  let i = 0;
  let j = 0;

  while (i < deck1.length || j < deck2.length) {
    if (i >= deck1.length) {
      result.push(...deck2.slice(j));
      break;
    }
    if (j >= deck2.length) {
      result.push(...deck1.slice(i));
      break;
    }
    const from1 = Math.min(1 + Math.floor(Math.random() * 2), deck1.length - i);
    for (let k = 0; k < from1; k++) result.push(deck1[i++]);
    if (j < deck2.length) {
      const from2 = Math.min(1 + Math.floor(Math.random() * 2), deck2.length - j);
      for (let k = 0; k < from2; k++) result.push(deck2[j++]);
    }
  }
  return result;
}

export function analyzeGilbreath(deck: Card[]): ShuffleResult {
  const pairs: PairResult[] = [];
  for (let i = 0; i + 1 < deck.length; i += 2) {
    pairs.push({
      a: deck[i],
      b: deck[i + 1],
      valid: deck[i].color !== deck[i + 1].color,
    });
  }
  return { deck, pairs, invariantHolds: pairs.every(p => p.valid) };
}
