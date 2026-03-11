'use client';

import { use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getSpreadById } from '@/data';
import { Badge } from '@/components/ui';

export default function SpreadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const spread = getSpreadById(id);

  if (!spread) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-4xl mb-4">🔍</p>
        <p className="text-text-muted mb-4">스프레드를 찾을 수 없습니다</p>
        <Link href="/spreads" className="text-accent-gold hover:underline text-sm">스프레드 목록으로 돌아가기</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <nav className="flex items-center gap-2 text-xs text-text-muted mb-8">
        <Link href="/spreads" className="hover:text-accent-gold transition-colors">스프레드</Link>
        <span>›</span>
        <span className="text-text-secondary">{spread.name}</span>
      </nav>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="font-serif text-3xl font-bold text-text-primary">{spread.name}</h1>
        </div>
        <p className="text-text-muted text-sm mb-4">{spread.nameEn}</p>
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge variant="gold">{spread.cardCount}장</Badge>
          <Badge variant="lavender">{spread.difficulty}</Badge>
          {spread.bestFor.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>

        <div className="rounded-[16px] bg-card-bg border border-border p-6 mb-8">
          <p className="text-text-secondary leading-relaxed text-sm">{spread.longDescription}</p>
        </div>

        {/* Layout Diagram */}
        <h2 className="font-serif text-xl font-semibold text-text-primary mb-4">📐 배치도</h2>
        <div className="rounded-[16px] bg-card-bg border border-border p-6 mb-8">
          <div className="relative" style={{ paddingBottom: '60%' }}>
            {spread.positions.map((pos, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="absolute flex flex-col items-center"
                style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
              >
                <div className="w-10 h-14 sm:w-12 sm:h-16 rounded-lg bg-gradient-to-br from-accent-gold/20 to-accent-lavender/10 border border-border flex items-center justify-center">
                  <span className="text-xs font-semibold text-accent-gold">{pos.index + 1}</span>
                </div>
                <span className="mt-1 text-[9px] sm:text-[10px] text-text-muted text-center whitespace-nowrap">{pos.name}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Position Explanations */}
        <h2 className="font-serif text-xl font-semibold text-text-primary mb-4">📋 위치별 설명</h2>
        <div className="space-y-3 mb-8">
          {spread.positions.map((pos) => (
            <div key={pos.index} className="rounded-[16px] bg-card-bg border border-border p-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-7 h-7 rounded-lg bg-accent-gold-dim flex items-center justify-center text-xs font-bold text-accent-gold">
                  {pos.index + 1}
                </span>
                <span className="font-semibold text-sm text-text-primary">{pos.name}</span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed ml-10">{pos.description}</p>
            </div>
          ))}
        </div>

        {/* 사용 시기 */}
        {spread.whenToUse && (
          <div className="rounded-[16px] bg-card-bg border border-border p-6 mb-8">
            <h2 className="font-serif text-lg font-semibold text-text-primary mb-3">🕐 언제 사용하면 좋을까요?</h2>
            <p className="text-sm text-text-secondary leading-relaxed">{spread.whenToUse}</p>
          </div>
        )}

        {/* 예시 질문 */}
        {spread.exampleQuestions && spread.exampleQuestions.length > 0 && (
          <div className="rounded-[16px] bg-card-bg border border-border p-6 mb-8">
            <h2 className="font-serif text-lg font-semibold text-text-primary mb-3">❓ 예시 질문</h2>
            <ul className="space-y-2">
              {spread.exampleQuestions.map((q, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="text-accent-gold mt-0.5">•</span>
                  <span className="leading-relaxed">{q}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tips */}
        <div className="rounded-[16px] bg-gradient-to-br from-accent-gold/5 to-accent-lavender/5 border border-border p-6">
          <h3 className="font-semibold text-sm text-accent-gold mb-2">💡 리딩 팁</h3>
          <p className="text-xs text-text-secondary leading-relaxed">{spread.tips}</p>
        </div>

        <div className="text-center mt-10">
          <Link
            href={`/reading?spread=${spread.id}`}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-accent-gold text-background font-semibold text-sm hover:bg-accent-gold/90 transition-colors"
          >
            🔮 이 스프레드로 리딩하기
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
