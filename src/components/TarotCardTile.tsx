'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { TarotCard } from '@/data/types';

const arcanaGradients: Record<string, string> = {
  major: 'from-accent-gold/20 via-accent-lavender/10 to-accent-gold/5',
  wands: 'from-red-900/30 via-orange-900/20 to-red-900/10',
  cups: 'from-blue-900/30 via-cyan-900/20 to-blue-900/10',
  swords: 'from-slate-700/30 via-gray-800/20 to-slate-700/10',
  pentacles: 'from-green-900/30 via-emerald-900/20 to-green-900/10',
};

function getGradient(card: TarotCard) {
  if (card.arcana === 'major') return arcanaGradients.major;
  return arcanaGradients[card.suit || 'major'];
}

const romanNumerals = ['0','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX','XXI'];

export default function TarotCardTile({ card, index = 0 }: { card: TarotCard; index?: number }) {
  const gradient = getGradient(card);
  const numeral = card.arcana === 'major' ? romanNumerals[card.number] : String(card.number);
  const imagePath = `/cards/${card.id}.jpg`;
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.4 }}
    >
      <Link href={`/cards/${card.id}`} className="block group">
        <div className="card-shimmer rounded-[16px] bg-card-bg border border-border hover:border-border-hover transition-all duration-300 overflow-hidden">
          {/* Card Visual */}
          <div className={`relative aspect-[3/4] bg-gradient-to-br ${gradient} flex flex-col items-center justify-center p-4 overflow-hidden`}>
            {!imgError ? (
              <Image
                src={imagePath}
                alt={card.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                onError={() => setImgError(true)}
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-card-bg/80 via-transparent to-transparent" />
                <span className="relative text-4xl sm:text-5xl font-serif text-accent-gold/60 mb-2">{numeral}</span>
                <div className="relative w-8 h-px bg-accent-gold/30 mb-3" />
                <span className="relative text-xs text-text-muted tracking-widest uppercase">{card.nameEn}</span>
              </>
            )}
          </div>

          {/* Card Info */}
          <div className="p-3 sm:p-4">
            <h3 className="font-serif text-base font-semibold text-text-primary group-hover:text-accent-gold transition-colors mb-1.5">
              {card.name}
            </h3>
            <div className="flex flex-wrap gap-1">
              {card.keywords.slice(0, 3).map((kw) => (
                <span key={kw} className="px-2 py-0.5 rounded-full text-[10px] bg-accent-lavender-dim text-accent-lavender">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
