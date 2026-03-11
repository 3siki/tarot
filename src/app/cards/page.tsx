'use client';

import { useState, useMemo } from 'react';
import { allCards } from '@/data';
import { SUIT_LABELS } from '@/data/types';
import TarotCardTile from '@/components/TarotCardTile';
import { SectionHeading } from '@/components/ui';

type ArcanaFilter = 'all' | 'major' | 'minor';
type SuitFilter = 'all' | 'wands' | 'cups' | 'swords' | 'pentacles';

export default function CardsPage() {
  const [search, setSearch] = useState('');
  const [arcanaFilter, setArcanaFilter] = useState<ArcanaFilter>('all');
  const [suitFilter, setSuitFilter] = useState<SuitFilter>('all');

  const filtered = useMemo(() => {
    let cards = allCards;
    if (arcanaFilter !== 'all') cards = cards.filter((c) => c.arcana === arcanaFilter);
    if (suitFilter !== 'all') cards = cards.filter((c) => c.suit === suitFilter);
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      cards = cards.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.nameEn.toLowerCase().includes(q) ||
          c.keywords.some((k) => k.includes(q))
      );
    }
    return cards;
  }, [search, arcanaFilter, suitFilter]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <SectionHeading title="카드 도감" subtitle="78장의 타로카드를 탐색하고 각 카드의 의미를 배워보세요" />

      {/* Search & Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="카드 이름, 키워드로 검색..."
            className="w-full px-4 py-3 pl-10 rounded-xl bg-card-bg border border-border text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-accent-gold transition-colors"
          />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-sm">🔍</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {(['all', 'major', 'minor'] as ArcanaFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => { setArcanaFilter(f); if (f !== 'minor') setSuitFilter('all'); }}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                arcanaFilter === f
                  ? 'bg-accent-gold text-background'
                  : 'bg-card-bg border border-border text-text-secondary hover:border-accent-gold hover:text-accent-gold'
              }`}
            >
              {f === 'all' ? '전체' : f === 'major' ? '메이저' : '마이너'}
            </button>
          ))}

          {arcanaFilter === 'minor' && (
            <>
              <div className="w-px h-6 bg-border self-center mx-1" />
              {(['all', 'wands', 'cups', 'swords', 'pentacles'] as SuitFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setSuitFilter(f)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    suitFilter === f
                      ? 'bg-accent-lavender text-background'
                      : 'bg-card-bg border border-border text-text-secondary hover:border-accent-lavender hover:text-accent-lavender'
                  }`}
                >
                  {f === 'all' ? '전체 수트' : SUIT_LABELS[f]}
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Results */}
      <p className="text-xs text-text-muted mb-4">{filtered.length}장의 카드</p>
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {filtered.map((card, i) => (
            <TarotCardTile key={card.id} card={card} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-text-muted">검색 결과가 없습니다</p>
        </div>
      )}
    </div>
  );
}
