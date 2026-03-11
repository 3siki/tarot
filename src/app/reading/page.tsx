'use client';

import { useState, useMemo, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { spreads } from '@/data/spreads';
import { allCards, getCardById } from '@/data';
import { TarotCard } from '@/data/types';
import { SectionHeading, Badge } from '@/components/ui';

const TOPICS = [
  { id: 'love', label: '사랑', icon: '💕' },
  { id: 'career', label: '직업·진로', icon: '💼' },
  { id: 'relationship', label: '관계·소통', icon: '🤝' },
  { id: 'money', label: '재물·재정', icon: '💰' },
  { id: 'growth', label: '성장·자기계발', icon: '🌱' },
  { id: 'life', label: '인생 전반', icon: '🌏' },
  { id: 'health', label: '건강·웰빙', icon: '🌿' },
];

type Step = 'topic' | 'spread' | 'cards' | 'result';

interface CardInput {
  cardId: string;
  reversed: boolean;
}

function CardSelector({
  positionIndex,
  positionName,
  value,
  onChange,
}: {
  positionIndex: number;
  positionName: string;
  value: CardInput | null;
  onChange: (val: CardInput) => void;
}) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return allCards.slice(0, 20);
    const q = search.toLowerCase();
    return allCards.filter(
      (c) => c.name.toLowerCase().includes(q) || c.nameEn.toLowerCase().includes(q) || c.keywords.some((k) => k.includes(q))
    ).slice(0, 20);
  }, [search]);

  const selectedCard = value ? getCardById(value.cardId) : null;

  return (
    <div className="rounded-[16px] bg-card-bg border border-border p-4 sm:p-5">
      <div className="flex items-center gap-3 mb-3">
        <span className="w-7 h-7 rounded-lg bg-accent-gold-dim flex items-center justify-center text-xs font-bold text-accent-gold">
          {positionIndex + 1}
        </span>
        <span className="font-semibold text-sm text-text-primary">{positionName}</span>
      </div>

      {selectedCard ? (
        <div className="flex items-center gap-3">
          <div className={`w-12 h-16 rounded-lg bg-gradient-to-br from-accent-gold/20 to-accent-lavender/10 border border-border flex items-center justify-center text-xs font-serif text-accent-gold/60 ${value?.reversed ? 'rotate-180' : ''}`}>
            {selectedCard.number}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-text-primary">{selectedCard.name}</p>
            <p className="text-xs text-text-muted">{selectedCard.nameEn}</p>
          </div>
          <button
            onClick={() => onChange({ cardId: value!.cardId, reversed: !value!.reversed })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              value?.reversed ? 'bg-accent-lavender text-background' : 'bg-surface border border-border text-text-secondary hover:border-accent-lavender'
            }`}
          >
            {value?.reversed ? '역방향' : '정방향'}
          </button>
          <button onClick={() => { onChange({ cardId: '', reversed: false }); setOpen(true); }} className="text-xs text-text-muted hover:text-accent-gold transition-colors">변경</button>
        </div>
      ) : (
        <div>
          {open ? (
            <div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="카드 이름으로 검색..."
                className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-gold mb-2"
                autoFocus
              />
              <div className="max-h-48 overflow-y-auto space-y-1">
                {filtered.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => { onChange({ cardId: card.id, reversed: false }); setOpen(false); setSearch(''); }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-surface-hover hover:text-accent-gold transition-all flex items-center gap-2"
                  >
                    <span className="text-xs text-accent-gold/50 w-6">{card.number}</span>
                    <span>{card.name}</span>
                    <span className="text-xs text-text-muted ml-auto">{card.nameEn}</span>
                  </button>
                ))}
                {filtered.length === 0 && <p className="text-xs text-text-muted text-center py-3">검색 결과가 없습니다</p>}
              </div>
            </div>
          ) : (
            <button
              onClick={() => setOpen(true)}
              className="w-full py-3 rounded-xl border border-dashed border-border text-text-muted text-sm hover:border-accent-gold hover:text-accent-gold transition-colors"
            >
              ✦ 여기에 뽑은 카드를 선택하세요
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ReadingContent() {
  const searchParams = useSearchParams();
  const preselectedSpread = searchParams.get('spread');
  const preselectedTopic = searchParams.get('topic');

  const [step, setStep] = useState<Step>(preselectedTopic ? 'spread' : 'topic');
  const [selectedTopic, setSelectedTopic] = useState(preselectedTopic || '');
  const [selectedSpreadId, setSelectedSpreadId] = useState(preselectedSpread || '');
  const [cardInputs, setCardInputs] = useState<(CardInput | null)[]>([]);

  const selectedSpread = useMemo(() => spreads.find((s) => s.id === selectedSpreadId), [selectedSpreadId]);

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId);
    setStep('spread');
  };

  const handleSpreadSelect = (spreadId: string) => {
    const spread = spreads.find((s) => s.id === spreadId);
    setSelectedSpreadId(spreadId);
    setCardInputs(new Array(spread?.cardCount || 1).fill(null));
    setStep('cards');
  };

  const handleCardChange = useCallback((index: number, value: CardInput) => {
    setCardInputs((prev) => {
      const next = [...prev];
      next[index] = value.cardId ? value : null;
      return next;
    });
  }, []);

  const allCardsFilled = cardInputs.every((c) => c && c.cardId);

  const handleSubmit = () => {
    if (allCardsFilled) setStep('result');
  };

  const handleReset = () => {
    setStep('topic');
    setSelectedTopic('');
    setSelectedSpreadId('');
    setCardInputs([]);
  };

  const topicLabel = TOPICS.find((t) => t.id === selectedTopic)?.label || selectedTopic;
  const topicCategory = selectedTopic as string;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <SectionHeading title="리딩 어시스턴트" subtitle="카드를 뽑고 직접 입력하여 학습 가이드를 받아보세요" />

      {/* 진행 표시 */}
      <div className="flex items-center gap-2 mb-8">
        {(['topic','spread','cards','result'] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step === s ? 'bg-accent-gold text-background' :
              (['topic','spread','cards','result'].indexOf(step) > i) ? 'bg-accent-gold/30 text-accent-gold' :
              'bg-surface text-text-muted'
            }`}>
              {i + 1}
            </div>
            {i < 3 && <div className={`w-8 h-px ${['topic','spread','cards','result'].indexOf(step) > i ? 'bg-accent-gold/30' : 'bg-border'}`} />}
          </div>
        ))}
        <span className="ml-3 text-xs text-text-muted">
          {step === 'topic' && '주제 선택'}
          {step === 'spread' && '스프레드 선택'}
          {step === 'cards' && '카드 입력'}
          {step === 'result' && '해석 가이드'}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: 주제 선택 */}
        {step === 'topic' && (
          <motion.div key="topic" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className="text-lg font-semibold text-text-primary mb-4">어떤 주제로 리딩하고 싶으신가요?</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => handleTopicSelect(topic.id)}
                  className="rounded-[16px] bg-card-bg border border-border hover:border-accent-gold p-5 text-left transition-all group"
                >
                  <span className="text-2xl mb-2 block">{topic.icon}</span>
                  <span className="text-sm font-semibold text-text-primary group-hover:text-accent-gold transition-colors">{topic.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: 스프레드 선택 */}
        {step === 'spread' && (
          <motion.div key="spread" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="flex items-center gap-2 mb-4">
              <button onClick={() => setStep('topic')} className="text-xs text-text-muted hover:text-accent-gold transition-colors">← 주제 변경</button>
              <Badge variant="gold">{topicLabel}</Badge>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">스프레드를 선택하세요</h3>
            <div className="space-y-3">
              {spreads.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSpreadSelect(s.id)}
                  className="w-full rounded-[16px] bg-card-bg border border-border hover:border-accent-gold p-5 text-left transition-all group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-serif text-base font-semibold text-text-primary group-hover:text-accent-gold transition-colors">{s.name}</span>
                    <Badge variant="lavender">{s.cardCount}장</Badge>
                    <Badge>{s.difficulty}</Badge>
                  </div>
                  <p className="text-xs text-text-muted">{s.description}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3: 카드 입력 */}
        {step === 'cards' && selectedSpread && (
          <motion.div key="cards" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="flex items-center gap-2 mb-4">
              <button onClick={() => setStep('spread')} className="text-xs text-text-muted hover:text-accent-gold transition-colors">← 스프레드 변경</button>
              <Badge variant="gold">{topicLabel}</Badge>
              <Badge variant="lavender">{selectedSpread.name}</Badge>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">뽑은 카드를 입력하세요</h3>
            <p className="text-xs text-text-muted mb-6">각 위치에 해당하는 카드를 선택하고, 정방향/역방향을 지정하세요.</p>

            <div className="space-y-3 mb-6">
              {selectedSpread.positions.map((pos, i) => (
                <CardSelector
                  key={i}
                  positionIndex={pos.index}
                  positionName={pos.name}
                  value={cardInputs[i]}
                  onChange={(val) => handleCardChange(i, val)}
                />
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!allCardsFilled}
              className="w-full py-3 rounded-xl bg-accent-gold text-background font-semibold text-sm hover:bg-accent-gold/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              📖 해석 가이드 보기
            </button>
          </motion.div>
        )}

        {/* Step 4: 결과 */}
        {step === 'result' && selectedSpread && (
          <motion.div key="result" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="rounded-[16px] bg-gradient-to-br from-accent-gold/5 to-accent-lavender/5 border border-border p-5 mb-6">
              <p className="text-xs text-accent-gold mb-1">📖 학습 가이드</p>
              <p className="text-sm text-text-secondary leading-relaxed">
                아래 해석은 타로 학습을 위한 <strong className="text-text-primary">참고 가이드</strong>입니다.
                절대적인 예측이 아닌, 자기 성찰과 사고의 도구로 활용해주세요.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-6">
              <Badge variant="gold">{topicLabel}</Badge>
              <Badge variant="lavender">{selectedSpread.name}</Badge>
            </div>

            <div className="space-y-4">
              {selectedSpread.positions.map((pos, i) => {
                const input = cardInputs[i];
                if (!input) return null;
                const card = getCardById(input.cardId);
                if (!card) return null;

                const catKey = topicCategory as keyof typeof card.categories;
                const topicMeaning = card.categories[catKey];

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-[16px] bg-card-bg border border-border p-5 sm:p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-7 h-7 rounded-lg bg-accent-gold-dim flex items-center justify-center text-xs font-bold text-accent-gold">
                        {pos.index + 1}
                      </span>
                      <span className="font-semibold text-sm text-text-primary">{pos.name}</span>
                      <span className="text-xs text-text-muted">— {pos.description}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link href={`/cards/${card.id}`} className="shrink-0">
                        <div className={`w-16 h-22 rounded-xl bg-gradient-to-br from-accent-gold/20 to-accent-lavender/10 border border-border flex flex-col items-center justify-center ${input.reversed ? 'rotate-180' : ''}`}>
                          <span className="text-lg font-serif text-accent-gold/60">{card.number}</span>
                          <span className="text-[7px] text-text-muted">{card.nameEn}</span>
                        </div>
                      </Link>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Link href={`/cards/${card.id}`} className="font-serif text-lg font-semibold text-text-primary hover:text-accent-gold transition-colors">
                            {card.name}
                          </Link>
                          {input.reversed && <Badge variant="lavender">역방향</Badge>}
                        </div>

                        {/* 핵심 키워드 */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {card.keywords.map((kw) => (
                            <span key={kw} className="px-2 py-0.5 rounded-full text-[10px] bg-accent-lavender-dim text-accent-lavender">{kw}</span>
                          ))}
                        </div>

                        {/* 의미 해석 */}
                        <div className="mb-3">
                          <h4 className="text-xs font-semibold text-text-secondary mb-1">
                            {input.reversed ? '🌙 역방향 의미' : '☀️ 정방향 의미'}
                          </h4>
                          <p className="text-sm text-text-secondary leading-relaxed">
                            {input.reversed ? card.reversedMeaning : card.uprightMeaning}
                          </p>
                        </div>

                        {/* 주제별 해석 */}
                        {topicMeaning && (
                          <div className="rounded-xl bg-surface p-3">
                            <h4 className="text-xs font-semibold text-accent-gold mb-1">
                              {TOPICS.find((t) => t.id === selectedTopic)?.icon} {topicLabel} 관점
                            </h4>
                            <p className="text-xs text-text-muted leading-relaxed">{topicMeaning}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* 종합 팁 */}
            <div className="mt-6 rounded-[16px] bg-gradient-to-br from-accent-gold/5 to-accent-lavender/5 border border-border p-5">
              <h3 className="text-sm font-semibold text-accent-gold mb-2">💡 해석 팁</h3>
              <ul className="space-y-2 text-xs text-text-secondary leading-relaxed">
                <li>• 각 카드를 개별적으로 이해한 후, 전체 흐름을 하나의 이야기로 연결해보세요.</li>
                <li>• 카드의 위치(어느 포지션에 놓였는지)가 해석의 맥락을 결정합니다.</li>
                <li>• 직관적으로 느껴지는 첫인상도 중요한 해석의 단서입니다.</li>
                <li>• 이 해석은 학습 참고 자료이며, 최종 판단은 항상 본인의 몫입니다.</li>
              </ul>
            </div>

            <div className="flex justify-center gap-3 mt-8">
              <button
                onClick={handleReset}
                className="px-8 py-3 rounded-xl border border-border text-text-secondary text-sm hover:border-accent-gold hover:text-accent-gold transition-colors"
              >
                🔄 새로운 리딩 시작
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ReadingPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-20 text-center text-text-muted">로딩 중...</div>}>
      <ReadingContent />
    </Suspense>
  );
}
