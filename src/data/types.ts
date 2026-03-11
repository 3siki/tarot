export interface TarotCard {
  id: string;
  name: string;
  nameEn: string;
  arcana: 'major' | 'minor';
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  number: number;
  keywords: string[];
  uprightMeaning: string;
  reversedMeaning: string;
  symbolism: string;
  categories: {
    love: string;
    money: string;
    career: string;
    health: string;
    relationship: string;
    growth: string;
    life: string;
    luck: string;
  };
  element?: string;
  zodiac?: string;
  imageSlug: string;
  tips?: string;
  relatedSpreads?: string[];
}

export interface SpreadPosition {
  index: number;
  name: string;
  description: string;
  x: number;
  y: number;
}

export interface Spread {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  longDescription: string;
  cardCount: number;
  positions: SpreadPosition[];
  difficulty: '입문' | '초급' | '중급' | '고급';
  bestFor: string[];
  tips: string;
  whenToUse?: string;
  exampleQuestions?: string[];
  recommendedTopics?: string[];
}

export interface StudyGuide {
  id: string;
  title: string;
  description: string;
  content: string;
  order: number;
  icon: string;
}

export type Category = 'love' | 'money' | 'career' | 'health' | 'relationship' | 'growth' | 'life' | 'luck';

export const CATEGORY_LABELS: Record<Category, string> = {
  love: '사랑',
  money: '재물',
  career: '직업',
  health: '건강',
  relationship: '관계',
  growth: '성장',
  life: '인생',
  luck: '행운',
};

export const CATEGORY_ICONS: Record<Category, string> = {
  love: '💕',
  money: '💰',
  career: '💼',
  health: '🌿',
  relationship: '🤝',
  growth: '🌱',
  life: '🌏',
  luck: '🍀',
};

export const SUIT_LABELS: Record<string, string> = {
  wands: '완드',
  cups: '컵',
  swords: '소드',
  pentacles: '펜타클',
};

export const SUIT_ELEMENTS: Record<string, string> = {
  wands: '불 🔥',
  cups: '물 💧',
  swords: '바람 🌬️',
  pentacles: '흙 🌍',
};
