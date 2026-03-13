'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { majorArcana } from '@/data/major-arcana';
import { spreads } from '@/data/spreads';
import { searchAll } from '@/data';
import TarotCardTile from '@/components/TarotCardTile';
import { SectionHeading, Badge } from '@/components/ui';
import { TarotCard } from '@/data/types';
import { useState, useEffect, useMemo, useRef } from 'react';

/* ─── 글로벌 검색 ─── */
function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const results = useMemo(() => (query.trim().length >= 1 ? searchAll(query) : null), [query]);
  const hasResults = results && (results.cards.length > 0 || results.spreadResults.length > 0);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="카드 이름, 키워드, 스프레드 검색..."
          className="w-full px-5 py-3.5 pl-11 rounded-2xl bg-card-bg/80 backdrop-blur border border-border text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-accent-gold transition-colors"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">🔍</span>
      </div>

      {focused && query.trim() && (
        <div className="absolute top-full mt-2 w-full rounded-2xl bg-card-bg border border-border shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
          {hasResults ? (
            <div className="p-2">
              {results.cards.length > 0 && (
                <div className="mb-2">
                  <p className="px-3 py-1 text-[10px] font-semibold text-text-muted uppercase tracking-wider">카드</p>
                  {results.cards.slice(0, 6).map((card) => (
                    <button
                      key={card.id}
                      onClick={() => { router.push(`/cards/${card.id}`); setFocused(false); setQuery(''); }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-surface-hover transition-colors"
                    >
                      <span className="w-6 text-xs text-accent-gold/50 text-center">{card.number}</span>
                      <span className="text-sm text-text-primary">{card.name}</span>
                      <span className="text-xs text-text-muted ml-auto">{card.nameEn}</span>
                    </button>
                  ))}
                </div>
              )}
              {results.spreadResults.length > 0 && (
                <div>
                  <p className="px-3 py-1 text-[10px] font-semibold text-text-muted uppercase tracking-wider">스프레드</p>
                  {results.spreadResults.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => { router.push(`/spreads/${s.id}`); setFocused(false); setQuery(''); }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-surface-hover transition-colors"
                    >
                      <span className="text-sm">✦</span>
                      <span className="text-sm text-text-primary">{s.name}</span>
                      <span className="text-xs text-text-muted ml-auto">{s.cardCount}장</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 text-center text-text-muted text-sm">검색 결과가 없습니다</div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── 오늘의 카드 ─── */
function CardOfTheDay({ initialCard }: { initialCard: TarotCard }) {
  const card = initialCard;

  return (
    <Link href={`/cards/${card.id}`} className="block group">
      <div className="rounded-[16px] bg-card-bg border border-border hover:border-border-hover transition-all duration-300 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-32 rounded-xl bg-gradient-to-br from-accent-gold/20 via-accent-lavender/10 to-accent-gold/5 flex flex-col items-center justify-center shrink-0 border border-border">
            <span className="text-3xl font-serif text-accent-gold/60">{card.number}</span>
            <div className="w-6 h-px bg-accent-gold/30 my-1" />
            <span className="text-[9px] text-text-muted tracking-wider">{card.nameEn}</span>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-xs text-accent-gold mb-1">✦ 오늘의 카드</p>
            <h3 className="font-serif text-xl font-bold text-text-primary mb-2 group-hover:text-accent-gold transition-colors">
              {card.name}
            </h3>
            <p className="text-sm text-text-muted leading-relaxed line-clamp-2">{card.uprightMeaning}</p>
            <div className="flex flex-wrap gap-1.5 mt-3 justify-center sm:justify-start">
              {card.keywords.slice(0, 4).map((kw) => (
                <span key={kw} className="px-2 py-0.5 rounded-full text-[10px] bg-accent-lavender-dim text-accent-lavender">
                  {kw}
                  <span className="sr-only">, </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─── 메인 ─── */
const quickLinks = [
  { href: '/cards', icon: '🃏', title: '카드 도감', desc: '78장의 타로카드를 탐색하세요' },
  { href: '/spreads', icon: '✦', title: '스프레드', desc: '다양한 배열법을 배워보세요' },
  { href: '/reading', icon: '🔮', title: '리딩 연습', desc: '카드를 입력하고 해석해보세요' },
  { href: '/guide', icon: '📖', title: '학습 가이드', desc: '타로 기초부터 체계적으로' },
];

export default function HomeClient({ initialCard }: { initialCard: TarotCard }) {
  const featuredCards = useMemo(() => {
    const shuffled = [...majorArcana].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6);
  }, []);

  const popularSpreads = spreads.filter((s) => ['three-card', 'relationship', 'career-path'].includes(s.id));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      {/* 히어로 */}
      <section className="py-16 sm:py-24 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="text-accent-gold text-sm tracking-widest mb-4">✧ TAROT STUDY SERVICE ✧</p>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-text-primary leading-tight mb-6">
            타로의 세계로<br />
            <span className="text-accent-gold">첫 걸음</span>을 내디뎌 보세요
          </h1>
          <p className="text-text-muted text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            신비롭지만 어렵지 않은, 체계적인 타로 학습.<br />
            78장의 카드가 전하는 이야기를 함께 배워봅니다.
          </p>

          {/* 글로벌 검색 */}
          <div className="mb-10">
            <GlobalSearch />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/cards" className="px-8 py-3 rounded-xl bg-accent-gold text-background font-semibold text-sm hover:bg-accent-gold/90 transition-colors">카드 도감 보기</Link>
            <Link href="/guide" className="px-8 py-3 rounded-xl border border-border text-text-secondary text-sm hover:border-accent-gold hover:text-accent-gold transition-colors">학습 시작하기</Link>
          </div>
        </motion.div>
      </section>

      {/* 오늘의 카드 */}
      <section className="mb-16"><CardOfTheDay initialCard={initialCard} /></section>

      {/* 빠른 이동 */}
      <section className="mb-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {quickLinks.map((link, i) => (
            <motion.div key={link.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.5 }}>
              <Link href={link.href} className="block group">
                <div className="rounded-[16px] bg-card-bg border border-border hover:border-border-hover p-5 sm:p-6 transition-all duration-300 h-full">
                  <span className="text-2xl mb-3 block">{link.icon}</span>
                  <h3 className="font-semibold text-sm text-text-primary group-hover:text-accent-gold transition-colors mb-1">{link.title}</h3>
                  <p className="text-xs text-text-muted">{link.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 인기 스프레드 */}
      <section className="mb-16">
        <SectionHeading title="인기 스프레드" subtitle="초보자에게 가장 추천하는 타로 배열법입니다" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {popularSpreads.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Link href={`/spreads/${s.id}`} className="block group h-full">
                <div className="rounded-[16px] bg-card-bg border border-border hover:border-border-hover p-5 transition-all h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="gold">{s.cardCount}장</Badge>
                    <Badge variant="lavender">{s.difficulty}</Badge>
                  </div>
                  <h3 className="font-serif text-base font-semibold text-text-primary group-hover:text-accent-gold transition-colors mb-2">{s.name}</h3>
                  <p className="text-xs text-text-muted leading-relaxed">{s.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 입문 가이드 안내 */}
      <section className="mb-16">
        <div className="rounded-[16px] bg-gradient-to-br from-accent-gold/5 via-card-bg to-accent-lavender/5 border border-border p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="text-5xl">📖</div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-serif text-xl font-bold text-text-primary mb-2">타로가 처음이신가요?</h3>
              <p className="text-sm text-text-muted mb-4">메이저 아르카나부터 리버스 해석법까지, 5단계 학습 가이드로 체계적으로 배워보세요.</p>
              <Link href="/guide" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent-gold text-background font-semibold text-sm hover:bg-accent-gold/90 transition-colors">학습 가이드 시작 →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 메이저 아르카나 미리보기 */}
      <section className="mb-16">
        <SectionHeading title="메이저 아르카나 미리보기" subtitle="바보의 여정을 따라가며 22장의 핵심 카드를 만나보세요" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {featuredCards.map((card, i) => (<TarotCardTile key={card.id} card={card} index={i} />))}
        </div>
        <div className="text-center mt-8">
          <Link href="/cards" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-border text-sm text-text-secondary hover:border-accent-gold hover:text-accent-gold transition-colors">전체 78장 보기 →</Link>
        </div>
      </section>
    </div>
  );
}
