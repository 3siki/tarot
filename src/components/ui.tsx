export function SectionHeading({ title, subtitle, className = '' }: { title: string; subtitle?: string; className?: string }) {
  return (
    <div className={`mb-8 ${className}`}>
      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-sm sm:text-base text-text-muted">
          {subtitle}
        </p>
      )}
      <div className="mt-3 w-12 h-0.5 bg-gradient-to-r from-accent-gold to-transparent" />
    </div>
  );
}

export function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'gold' | 'lavender' }) {
  const styles = {
    default: 'bg-accent-lavender-dim text-accent-lavender',
    gold: 'bg-accent-gold-dim text-accent-gold',
    lavender: 'bg-accent-lavender-dim text-accent-lavender',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
}

export function CategoryBadge({ category, label }: { category: string; label: string }) {
  const icons: Record<string, string> = {
    love: '💕', money: '💰', career: '💼', health: '🌿', relationship: '🤝', growth: '🌱',
  };
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-surface border border-border text-text-secondary">
      <span>{icons[category] || '✦'}</span>
      {label}
    </span>
  );
}
