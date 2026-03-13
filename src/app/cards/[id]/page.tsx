'use client';

import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import { getCardById, allCards, spreads } from '@/data';
import { CATEGORY_LABELS, CATEGORY_ICONS, SUIT_LABELS } from '@/data/types';
import { SectionHeading, Badge } from '@/components/ui';
import TarotCardTile from '@/components/TarotCardTile';
import { useBookmarks, useRecentViews } from '@/hooks/useStorage';
import { motion } from 'framer-motion';
import Link from 'next/link';

/* ─── SVG 아르카나 심볼 ─── */
function CardSymbol({ card }: { card: { arcana: string; suit?: string; number: number } }) {
  const size = 120;
  const cx = size / 2;
  const cy = size / 2;
  const isMajor = card.arcana === 'major';

  return (
    <svg aria-hidden="true" width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="opacity-30">
      {/* 외곽 원 */}
      <circle cx={cx} cy={cy} r={50} fill="none" stroke="currentColor" strokeWidth="0.5" className="text-accent-gold" />
      <circle cx={cx} cy={cy} r={45} fill="none" stroke="currentColor" strokeWidth="0.3" className="text-accent-lavender" strokeDasharray="4 4" />

      {isMajor ? (
        <>
          {/* 메이저: 별 패턴 */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 45 * Math.PI) / 180;
            const x1 = cx + 20 * Math.cos(angle);
            const y1 = cy + 20 * Math.sin(angle);
            const x2 = cx + 42 * Math.cos(angle);
            const y2 = cy + 42 * Math.sin(angle);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.5" className="text-accent-gold" />;
          })}
          <circle cx={cx} cy={cy} r={8} fill="none" stroke="currentColor" strokeWidth="0.8" className="text-accent-gold" />
        </>
      ) : (
        <>
          {/* 마이너: 수트 기하학 패턴 */}
          {card.suit === 'wands' && <line x1={cx} y1={cy - 35} x2={cx} y2={cy + 35} stroke="currentColor" strokeWidth="1.5" className="text-red-400" />}
          {card.suit === 'cups' && <circle cx={cx} cy={cy} r={25} fill="none" stroke="currentColor" strokeWidth="1" className="text-blue-400" />}
          {card.suit === 'swords' && <><line x1={cx - 25} y1={cy - 25} x2={cx + 25} y2={cy + 25} stroke="currentColor" strokeWidth="1" className="text-gray-400" /><line x1={cx + 25} y1={cy - 25} x2={cx - 25} y2={cy + 25} stroke="currentColor" strokeWidth="1" className="text-gray-400" /></>}
          {card.suit === 'pentacles' && <polygon points={`${cx},${cy-30} ${cx+28},${cy-9} ${cx+17},${cy+24} ${cx-17},${cy+24} ${cx-28},${cy-9}`} fill="none" stroke="currentColor" strokeWidth="1" className="text-green-400" />}
        </>
      )}
    </svg>
  );
}

const romanNumerals = ['0','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX','XXI'];

/* ─── 카드 이미지 (폴백 포함) ─── */
function CardImage({ card, numeral }: { card: { id: string; arcana: string; suit?: string; number: number; name: string; nameEn: string }; numeral: string }) {
  const [imgError, setImgError] = useState(false);
  const imagePath = `/cards/${card.id}.jpg`;

  if (imgError) {
    return (
      <div className="aspect-[3/4] rounded-[16px] bg-gradient-to-br from-accent-gold/15 via-accent-lavender/8 to-card-bg border border-border flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <CardSymbol card={card} />
        </div>
        <span className="relative text-5xl font-serif text-accent-gold/70 mb-2">{numeral}</span>
        <div className="relative w-10 h-px bg-accent-gold/30 mb-3" />
        <span className="relative text-xs text-text-muted tracking-widest">{card.nameEn}</span>
      </div>
    );
  }

  return (
    <div className="aspect-[3/4] rounded-[16px] border border-border relative overflow-hidden">
      <Image
        src={imagePath}
        alt={card.name}
        fill
        sizes="(max-width: 640px) 160px, 192px"
        className="object-cover"
        priority
        onError={() => setImgError(true)}
      />
    </div>
  );
}

export default function CardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const card = getCardById(id);
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const { addRecentView } = useRecentViews();
  const [tab, setTab] = useState<'upright' | 'reversed'>('upright');

  useEffect(() => {
    if (card) addRecentView(card.id);
  }, [card, addRecentView]);

  if (!card) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-4xl mb-4">🔍</p>
        <p className="text-text-muted mb-4">카드를 찾을 수 없습니다</p>
        <Link href="/cards" className="text-accent-gold hover:underline text-sm">카드 도감으로 돌아가기</Link>
      </div>
    );
  }

  const bookmarked = isBookmarked(card.id);
  const relatedCards = allCards.filter((c) => c.id !== card.id && c.arcana === card.arcana && (card.arcana === 'major' || c.suit === card.suit)).slice(0, 4);
  const relatedSpreads = spreads.filter((s) => card.relatedSpreads?.includes(s.id) || s.recommendedTopics?.some((t) => Object.keys(card.categories).includes(t))).slice(0, 3);
  const numeral = card.arcana === 'major' ? romanNumerals[card.number] : String(card.number);

  // 초보자 팁 생성
  const studyTips = [
    `이 카드의 이미지를 1분간 바라보며 어떤 느낌이 드는지 적어보세요.`,
    `"${card.keywords[0]}"라는 키워드가 최근 내 삶에서 어떻게 나타나고 있는지 생각해보세요.`,
    card.arcana === 'major'
      ? `메이저 아르카나 중 ${card.number > 0 ? `${card.number - 1}번 카드와` : '마지막 카드와'} 비교하면서 이야기의 흐름을 따라가 보세요.`
      : `같은 숫자(${card.number})의 다른 수트 카드와 비교해보세요. 같은 주제가 원소에 따라 어떻게 달라지는지 알 수 있습니다.`,
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* 브레드크럼 */}
      <nav className="flex items-center gap-2 text-xs text-text-muted mb-8">
        <Link href="/cards" className="hover:text-accent-gold transition-colors">카드 도감</Link>
        <span>›</span>
        <span className="text-text-secondary">{card.name}</span>
      </nav>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* 헤더 */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 mb-10">
          {/* 카드 비주얼 (실제 이미지 or SVG 폴백) */}
          <div className="w-40 sm:w-48 shrink-0 mx-auto sm:mx-0">
            <CardImage card={card} numeral={numeral} />
          </div>

          {/* 카드 정보 */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-text-primary">{card.name}</h1>
              <button
                onClick={() => toggleBookmark(card.id)}
                className="text-2xl transition-transform hover:scale-110"
                aria-label={bookmarked ? '북마크 해제' : '북마크'}
              >
                {bookmarked ? '★' : '☆'}
              </button>
            </div>
            <p className="text-text-muted text-sm mb-4">{card.nameEn}</p>

            <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-4">
              <Badge variant="gold">{card.arcana === 'major' ? '메이저 아르카나' : '마이너 아르카나'}</Badge>
              {card.suit && <Badge>{SUIT_LABELS[card.suit]}</Badge>}
              {card.element && <Badge variant="lavender">{card.element}</Badge>}
              {card.zodiac && <Badge>{card.zodiac}</Badge>}
            </div>

            <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
              {card.keywords.map((kw) => (
                <span key={kw} className="px-2.5 py-1 rounded-full text-xs bg-accent-lavender-dim text-accent-lavender">
                  {kw}
                  <span className="sr-only">, </span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 정방향 / 역방향 탭 */}
        <div className="mb-8">
          <div className="flex border-b border-border mb-6">
            {(['upright', 'reversed'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-6 py-3 text-sm font-medium transition-all border-b-2 ${
                  tab === t ? 'border-accent-gold text-accent-gold' : 'border-transparent text-text-muted hover:text-text-secondary'
                }`}
              >
                {t === 'upright' ? '☀️ 정방향' : '🌙 역방향'}
              </button>
            ))}
          </div>
          <div className="rounded-[16px] bg-card-bg border border-border p-6">
            <p className="text-text-primary leading-relaxed">{tab === 'upright' ? card.uprightMeaning : card.reversedMeaning}</p>
          </div>
        </div>

        {/* 상징과 의미 */}
        <div className="mb-8">
          <h2 className="font-serif text-xl font-semibold text-text-primary mb-4">🔮 상징과 의미</h2>
          <div className="rounded-[16px] bg-card-bg border border-border p-6">
            <p className="text-text-secondary leading-relaxed text-sm">{card.symbolism}</p>
          </div>
        </div>

        {/* 분야별 해석 */}
        <div className="mb-8">
          <h2 className="font-serif text-xl font-semibold text-text-primary mb-4">📋 분야별 해석</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(Object.entries(card.categories) as [string, string][]).map(([key, value]) => {
              if (!value) return null;
              return (
                <div key={key} className="rounded-[16px] bg-card-bg border border-border p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span>{CATEGORY_ICONS[key as keyof typeof CATEGORY_ICONS] || '✦'}</span>
                    <span className="font-semibold text-sm text-text-primary">{CATEGORY_LABELS[key as keyof typeof CATEGORY_LABELS] || key}</span>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">{value}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 초보자 학습 팁 */}
        <div className="mb-8">
          <h2 className="font-serif text-xl font-semibold text-text-primary mb-4">📝 학습 팁</h2>
          <div className="rounded-[16px] bg-gradient-to-br from-accent-gold/5 to-accent-lavender/5 border border-border p-6">
            <ul className="space-y-3">
              {studyTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                  <span className="text-accent-gold mt-0.5 shrink-0">✦</span>
                  <span className="leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 관련 스프레드 */}
        {relatedSpreads.length > 0 && (
          <div className="mb-10">
            <h2 className="font-serif text-xl font-semibold text-text-primary mb-4">✦ 관련 스프레드</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {relatedSpreads.map((s) => (
                <Link key={s.id} href={`/spreads/${s.id}`} className="block group">
                  <div className="rounded-[16px] bg-card-bg border border-border hover:border-border-hover p-4 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="gold">{s.cardCount}장</Badge>
                      <Badge variant="lavender">{s.difficulty}</Badge>
                    </div>
                    <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent-gold transition-colors">{s.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 관련 카드 */}
        {relatedCards.length > 0 && (
          <div>
            <SectionHeading title="관련 카드" subtitle="같은 계열의 다른 카드도 살펴보세요" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {relatedCards.map((c, i) => (<TarotCardTile key={c.id} card={c} index={i} />))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
