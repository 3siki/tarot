'use client';

import { useState, useMemo, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
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
  { id: 'today', label: '오늘의 운세', icon: '☀️' },
  { id: 'tomorrow', label: '내일의 운세', icon: '🌤️' },
  { id: 'year', label: '올해 운세', icon: '🎯' },
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
          <div className={`w-12 h-16 rounded-lg border border-border relative overflow-hidden ${value?.reversed ? 'rotate-180' : ''}`}>
            <Image src={`/cards/${selectedCard.id}.jpg`} alt={selectedCard.name} fill className="object-cover" sizes="48px" />
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

function FlippableResultCard({ pos, input, card, topicMeaning, topicLabel, selectedTopic, delay }: any) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`rounded-[16px] border transition-all duration-500 ${flipped ? 'bg-card-bg border-border p-5 sm:p-6 cursor-default' : 'bg-surface border-accent-gold/30 p-8 sm:p-10 cursor-pointer hover:border-accent-gold hover:shadow-lg flex flex-col items-center justify-center'}`}
      onClick={() => !flipped && setFlipped(true)}
    >
      {!flipped ? (
        <motion.div 
          initial={{ rotateY: 180 }}
          animate={{ rotateY: 0 }}
          className="flex flex-col items-center"
        >
          <div className="w-20 h-32 sm:w-24 sm:h-36 rounded-xl border-2 border-accent-gold/50 bg-gradient-to-br from-accent-gold to-accent-lavender shadow-xl flex items-center justify-center">
             <span className="text-4xl">🌌</span>
          </div>
          <p className="mt-6 text-sm font-bold text-accent-gold animate-pulse">카드를 클릭하여 해석 확인하기</p>
          <p className="mt-2 text-xs text-text-muted">{pos.name} : {pos.description}</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ rotateY: -90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="w-7 h-7 rounded-lg bg-accent-gold-dim flex items-center justify-center text-xs font-bold text-accent-gold">
              {pos.index + 1}
            </span>
            <span className="font-semibold text-sm text-text-primary">{pos.name}</span>
            <span className="text-xs text-text-muted">— {pos.description}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={`/cards/${card.id}`} className="shrink-0 flex items-start justify-center">
              <div className={`w-20 h-32 sm:w-24 sm:h-36 rounded-xl border border-border relative overflow-hidden shadow-md transition-transform hover:scale-105 ${input.reversed ? 'rotate-180' : ''}`}>
                <Image src={`/cards/${card.id}.jpg`} alt={card.name} fill className="object-cover" sizes="96px" />
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
                {card.keywords.map((kw: string) => (
                  <span key={kw} className="px-2 py-0.5 rounded-full text-[10px] bg-accent-lavender-dim text-accent-lavender">
                    {kw}
                    <span className="sr-only">, </span>
                  </span>
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
                <div className="rounded-xl bg-surface p-3 mt-4">
                  <h4 className="text-xs font-semibold text-accent-gold mb-1 flex items-center gap-1.5">
                    {TOPICS.find((t) => t.id === selectedTopic)?.icon} {topicLabel} 관점
                  </h4>
                  <p className="text-xs text-text-muted leading-relaxed">{topicMeaning}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
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
  const [readingMode, setReadingMode] = useState<'manual' | 'auto'>('manual');
  const [isDrawing, setIsDrawing] = useState(false);

  const selectedSpread = useMemo(() => spreads.find((s) => s.id === selectedSpreadId), [selectedSpreadId]);

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId);
    if (selectedSpreadId) {
      setCardInputs(new Array(selectedSpread?.cardCount || 1).fill(null));
      setStep('cards');
    } else {
      setStep('spread');
    }
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

  const handleAutoDraw = () => {
    if (!selectedSpread) return;
    setIsDrawing(true);
    setCardInputs(new Array(selectedSpread.cardCount).fill(null));

    // Simulate drawing animation delay
    setTimeout(() => {
      // Pick unique random cards
      const count = selectedSpread.cardCount;
      const shuffled = [...allCards].sort(() => Math.random() - 0.5).slice(0, count);
      
      const newInputs: CardInput[] = shuffled.map((c) => ({
        cardId: c.id,
        reversed: Math.random() > 0.5,
      }));
      
      setCardInputs(newInputs);
      setIsDrawing(false);
    }, 1500); // 1.5 seconds suspense
  };

  const handleReset = () => {
    setStep('topic');
    setSelectedTopic('');
    setSelectedSpreadId('');
    setCardInputs([]);
  };

  const topicLabel = TOPICS.find((t) => t.id === selectedTopic)?.label || selectedTopic;
  
  const getMappedCategory = (topic: string) => {
    if (topic === 'today' || topic === 'tomorrow') return 'luck';
    if (topic === 'year') return 'life';
    return topic;
  };
  const topicCategory = getMappedCategory(selectedTopic);

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
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
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

            {/* 타로 질문 가이드 */}
            <div className="rounded-[16px] bg-gradient-to-br from-accent-gold/5 to-accent-lavender/5 border border-border p-5 sm:p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-accent-gold mb-4">💡 타로에게 좋은 질문을 던지는 방법</h3>
              <ul className="space-y-4 text-xs sm:text-sm text-text-secondary leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-accent-lavender mt-0.5">•</span>
                  <div>
                    <strong className="text-text-primary block mb-1">구체적으로 물어보세요.</strong>
                    "내 연애운은 어때?" 보다는 <span className="text-text-primary bg-accent-gold/10 px-1 rounded">"지금 만나는 사람과 관계를 발전시키려면 어떻게 해야 할까?"</span>가 더 명확한 조언을 줍니다.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-lavender mt-0.5">•</span>
                  <div>
                    <strong className="text-text-primary block mb-1">'예/아니오' 질문은 피하세요.</strong>
                    "이직에 성공할까?" 보다는 <span className="text-text-primary bg-accent-gold/10 px-1 rounded">"이직을 성공하기 위해 내가 지금 집중해야 할 부분은?"</span>이 타로의 방향성 제시에 적합합니다.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-lavender mt-0.5">•</span>
                  <div>
                    <strong className="text-text-primary block mb-1">주체를 '나'로 설정하세요.</strong>
                    "그 사람은 무슨 생각일까?" 보다는 <span className="text-text-primary bg-accent-gold/10 px-1 rounded">"그 사람과의 관계에서 내가 어떤 태도를 취하면 좋을까?"</span>에 초점을 맞추세요.
                  </div>
                </li>
              </ul>
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
          <motion.div key="cards" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="relative">
            
            {/* 시각적 로딩/셔플 오버레이 */}
            <AnimatePresence>
              {isDrawing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-x-0 top-32 bottom-20 z-10 flex flex-col items-center justify-center bg-card-bg/80 backdrop-blur-sm rounded-[16px] border border-accent-gold/50 shadow-2xl"
                >
                  <div className="w-16 h-24 mb-6 relative">
                    {/* 카드 셔플 애니메이션 느낌 */}
                    <motion.div animate={{ rotateY: 180 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent-gold to-accent-lavender shadow-lg" />
                    <motion.div animate={{ rotateY: -180 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="absolute inset-0 rounded-xl border-2 border-background" />
                  </div>
                  <p className="text-sm font-bold text-accent-gold">우주의 기운을 모아 카드를 뽑는 중...</p>
                  <p className="text-xs text-text-muted mt-2">잠시만 기다려주세요</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-2 mb-4">
              <button onClick={() => setStep('spread')} className="text-xs text-text-muted hover:text-accent-gold transition-colors">← 스프레드 변경</button>
              <Badge variant="gold">{topicLabel}</Badge>
              <Badge variant="lavender">{selectedSpread.name}</Badge>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-1">카드를 준비해주세요</h3>
                <p className="text-xs text-text-muted">직접 카드를 뽑아 입력하거나, 서비스가 대신 뽑아드립니다.</p>
              </div>
              <div className="flex bg-surface p-1 rounded-xl">
                <button
                  onClick={() => setReadingMode('manual')}
                  className={`flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                    readingMode === 'manual' ? 'bg-card-bg text-text-primary shadow-sm border border-border' : 'text-text-muted hover:text-text-secondary'
                  }`}
                >
                  직접 입력하기 (셀프)
                </button>
                <button
                  onClick={() => setReadingMode('auto')}
                  className={`flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                    readingMode === 'auto' ? 'bg-card-bg text-text-primary shadow-sm border border-border' : 'text-text-muted hover:text-text-secondary'
                  }`}
                >
                  자동으로 뽑기 (도움받기)
                </button>
              </div>
            </div>

            {readingMode === 'auto' && !allCardsFilled && (
              <div className="rounded-[16px] bg-card-bg border border-border p-8 text-center mb-6">
                <p className="text-sm text-text-primary mb-6">질문을 마음에 깊이 품고 아래 버튼을 눌러주세요.</p>
                <button
                  onClick={handleAutoDraw}
                  disabled={isDrawing}
                  className="px-8 py-3 rounded-xl bg-accent-gold text-background font-semibold text-sm hover:bg-accent-gold/90 transition-all disabled:opacity-50"
                >
                  {isDrawing ? '🔮 카드를 섞고 배열하는 중...' : '✨ 카운슬러에게 카드 뽑기 맡기기 ✨'}
                </button>
              </div>
            )}

            <div className={`space-y-3 mb-6 ${readingMode === 'auto' && !allCardsFilled ? 'opacity-30 pointer-events-none' : ''}`}>
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
              📖 {readingMode === 'auto' ? '해석 가이드 보기 (서비스 툴)' : '해석 가이드 보기 (셀프 도움말)'}
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
                  <FlippableResultCard 
                    key={i}
                    pos={pos}
                    input={input}
                    card={card}
                    topicMeaning={topicMeaning}
                    topicLabel={topicLabel}
                    selectedTopic={selectedTopic}
                    delay={i * 0.15}
                  />
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
