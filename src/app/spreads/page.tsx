'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { spreads } from '@/data/spreads';
import { SectionHeading, Badge } from '@/components/ui';

export default function SpreadsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <SectionHeading title="스프레드 라이브러리" subtitle="다양한 타로 배열법을 배우고 상황에 맞는 스프레드를 찾아보세요" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {spreads.map((spread, i) => (
          <motion.div
            key={spread.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <Link href={`/spreads/${spread.id}`} className="block group h-full">
              <div className="rounded-[16px] bg-card-bg border border-border hover:border-border-hover transition-all duration-300 p-6 h-full flex flex-col">
                {/* Visual Preview */}
                <div className="relative h-32 mb-4 rounded-xl bg-surface overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center gap-2">
                    {Array.from({ length: Math.min(spread.cardCount, 5) }).map((_, j) => (
                      <div
                        key={j}
                        className="w-8 h-12 rounded-md bg-gradient-to-br from-accent-gold/20 to-accent-lavender/10 border border-border"
                        style={{
                          transform: `rotate(${(j - Math.floor(Math.min(spread.cardCount, 5) / 2)) * 8}deg)`,
                        }}
                      />
                    ))}
                  </div>
                  {spread.cardCount > 5 && (
                    <div className="absolute bottom-2 right-2 text-[10px] text-text-muted">+{spread.cardCount - 5}</div>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="gold">{spread.cardCount}장</Badge>
                  <Badge variant="lavender">{spread.difficulty}</Badge>
                </div>
                <h3 className="font-serif text-lg font-semibold text-text-primary group-hover:text-accent-gold transition-colors mb-2">
                  {spread.name}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed flex-1">{spread.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {spread.bestFor.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] bg-surface border border-border text-text-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
