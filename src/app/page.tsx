import { Metadata } from 'next';
import HomeClient from '@/components/HomeClient';
import { majorArcana } from '@/data/major-arcana';

export const metadata: Metadata = {
  title: '타로 길잡이 — 오늘의 카드 & 타로 리딩',
  description: '매일 새로운 타로 카드를 만나고 당신만의 리딩을 시작하세요.',
};

export const revalidate = 3600; // revalidate every hour to keep date relatively fresh without constant rebuilding

export default function HomePage() {
  // Stable date-based index calculation on the server!
  // Use KST (Korean Standard Time) to be safe.
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(now.getTime() + kstOffset);
  const dayIndex = kstDate.getUTCDate() % majorArcana.length;
  const initialCard = majorArcana[dayIndex];

  return <HomeClient initialCard={initialCard} />;
}
