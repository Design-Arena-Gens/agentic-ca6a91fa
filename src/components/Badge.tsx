import clsx from 'clsx';
import type { ReactNode } from 'react';

interface BadgeProps {
  color?: 'default' | 'accent' | 'success' | 'warning';
  children: ReactNode;
}

export function Badge({ color = 'default', children }: BadgeProps) {
  const palette =
    color === 'accent'
      ? 'bg-accent/10 text-accent border border-accent/40'
      : color === 'success'
        ? 'bg-success/10 text-success border border-success/30'
        : color === 'warning'
          ? 'bg-warning/10 text-warning border border-warning/30'
          : 'bg-slate-800/70 text-slate-200 border border-slate-600/30';

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide',
        palette,
      )}
    >
      {children}
    </span>
  );
}
