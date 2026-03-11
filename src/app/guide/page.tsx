'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { studyGuides } from '@/data/study-guides';
import { SectionHeading } from '@/components/ui';

export default function GuidePage() {
  const [openId, setOpenId] = useState(studyGuides[0]?.id || '');

  const toggle = (id: string) => {
    setOpenId(openId === id ? '' : id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <SectionHeading
        title="학습 가이드"
        subtitle="타로를 처음 시작하는 분들을 위한 체계적인 학습 자료입니다"
      />

      <div className="space-y-3">
        {studyGuides
          .sort((a, b) => a.order - b.order)
          .map((guide, i) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              <div className="rounded-[16px] bg-card-bg border border-border overflow-hidden">
                <button
                  onClick={() => toggle(guide.id)}
                  className="w-full flex items-center gap-4 p-5 sm:p-6 text-left hover:bg-surface-hover transition-colors"
                >
                  <span className="text-2xl shrink-0">{guide.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] text-accent-gold font-semibold">STEP {guide.order}</span>
                    </div>
                    <h3 className="font-serif text-base sm:text-lg font-semibold text-text-primary">
                      {guide.title}
                    </h3>
                    <p className="text-xs text-text-muted mt-0.5">{guide.description}</p>
                  </div>
                  <span
                    className={`text-text-muted transition-transform duration-300 ${openId === guide.id ? 'rotate-180' : ''}`}
                  >
                    ▾
                  </span>
                </button>

                <AnimatePresence>
                  {openId === guide.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-6 border-t border-border pt-5">
                        <div
                          className="prose prose-sm prose-invert max-w-none
                            prose-headings:font-serif prose-headings:text-text-primary prose-headings:font-semibold
                            prose-h2:text-lg prose-h2:mt-6 prose-h2:mb-3
                            prose-h3:text-base prose-h3:mt-4 prose-h3:mb-2
                            prose-p:text-text-secondary prose-p:leading-relaxed prose-p:text-sm
                            prose-li:text-text-secondary prose-li:text-sm
                            prose-strong:text-text-primary
                            prose-table:text-sm
                            prose-th:text-text-primary prose-th:font-semibold prose-th:py-2 prose-th:px-3 prose-th:bg-surface prose-th:border-border
                            prose-td:text-text-secondary prose-td:py-2 prose-td:px-3 prose-td:border-border
                          "
                          dangerouslySetInnerHTML={{ __html: markdownToHtml(guide.content) }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  );
}

function markdownToHtml(md: string): string {
  return md
    .split('\n\n')
    .map((block) => {
      block = block.trim();
      if (!block) return '';

      // Headers
      if (block.startsWith('### ')) return `<h3>${block.slice(4)}</h3>`;
      if (block.startsWith('## ')) return `<h2>${block.slice(3)}</h2>`;
      if (block.startsWith('# ')) return `<h1>${block.slice(2)}</h1>`;

      // Table
      if (block.includes('|') && block.includes('---')) {
        const rows = block.split('\n').filter((r) => !r.match(/^\|[\s-|]+\|$/));
        const headerRow = rows[0];
        const dataRows = rows.slice(1);
        const headers = headerRow.split('|').filter(Boolean).map((h) => h.trim());
        let html = '<table><thead><tr>';
        headers.forEach((h) => { html += `<th>${h}</th>`; });
        html += '</tr></thead><tbody>';
        dataRows.forEach((row) => {
          const cells = row.split('|').filter(Boolean).map((c) => c.trim());
          html += '<tr>';
          cells.forEach((c) => { html += `<td>${c}</td>`; });
          html += '</tr>';
        });
        html += '</tbody></table>';
        return html;
      }

      // Lists
      if (block.match(/^[-*] /m) || block.match(/^\d+\. /m)) {
        const items = block.split('\n').map((line) => {
          const content = line.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '');
          const bold = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          return `<li>${bold}</li>`;
        });
        const isOrdered = block.match(/^\d+\. /);
        return isOrdered
          ? `<ol>${items.join('')}</ol>`
          : `<ul>${items.join('')}</ul>`;
      }

      // Paragraph
      const bold = block.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return `<p>${bold}</p>`;
    })
    .join('');
}
