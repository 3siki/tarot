import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3">
              <span className="text-xl">✧</span>
              <span className="font-serif text-lg font-semibold text-accent-gold">타로 길잡이</span>
            </Link>
            <p className="text-sm text-text-muted leading-relaxed">
              타로를 처음 배우는 분들을 위한<br />
              교육 중심의 타로 학습 서비스입니다.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-text-secondary mb-3">바로가기</h3>
            <div className="space-y-2">
              {[
                { href: '/cards', label: '카드 도감' },
                { href: '/spreads', label: '스프레드' },
                { href: '/reading', label: '리딩' },
                { href: '/guide', label: '학습 가이드' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-text-muted hover:text-accent-gold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div>
            <h3 className="text-sm font-semibold text-text-secondary mb-3">안내</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              이 서비스는 교육 목적의 타로 학습 도구입니다.
              의학적, 법적, 재정적 조언을 대체하지 않으며,
              자기 성찰과 학습을 위한 참고 자료로 활용해주세요.
            </p>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-xs text-text-muted">
            © 2025 타로 길잡이. 교육 목적으로 제작되었습니다.
          </p>
        </div>
      </div>
    </footer>
  );
}
