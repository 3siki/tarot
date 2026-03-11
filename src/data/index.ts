import { TarotCard } from './types';
import { majorArcana } from './major-arcana';
import { minorArcana as wands } from './minor-arcana';
import { cups } from './cups';
import { swords } from './swords';
import { pentacles } from './pentacles';
import { spreads } from './spreads';
import { studyGuides } from './study-guides';

export const allCards: TarotCard[] = [...majorArcana, ...wands, ...cups, ...swords, ...pentacles];

export function getCardById(id: string): TarotCard | undefined {
  return allCards.find((card) => card.id === id);
}

export function searchCards(query: string): TarotCard[] {
  const q = query.toLowerCase().trim();
  if (!q) return allCards;
  return allCards.filter(
    (card) =>
      card.name.toLowerCase().includes(q) ||
      card.nameEn.toLowerCase().includes(q) ||
      card.keywords.some((k) => k.includes(q))
  );
}

export function filterCards(filters: {
  arcana?: 'major' | 'minor';
  suit?: string;
  category?: string;
}): TarotCard[] {
  let filtered = allCards;
  if (filters.arcana) {
    filtered = filtered.filter((c) => c.arcana === filters.arcana);
  }
  if (filters.suit) {
    filtered = filtered.filter((c) => c.suit === filters.suit);
  }
  return filtered;
}

export function getSpreadById(id: string) {
  return spreads.find((s) => s.id === id);
}

export function getRandomCards(count: number): TarotCard[] {
  const shuffled = [...allCards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function searchAll(query: string): {
  cards: TarotCard[];
  spreadResults: typeof spreads;
} {
  const q = query.toLowerCase().trim();
  if (!q) return { cards: [], spreadResults: [] };
  const cards = allCards.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.nameEn.toLowerCase().includes(q) ||
      c.keywords.some((k) => k.includes(q))
  );
  const spreadResults = spreads.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.nameEn.toLowerCase().includes(q) ||
      s.bestFor.some((b) => b.includes(q)) ||
      s.description.includes(q)
  );
  return { cards, spreadResults };
}

export { majorArcana, spreads, studyGuides };
export { wands, cups, swords, pentacles };
export type { TarotCard } from './types';
