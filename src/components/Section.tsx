import type { ReactNode } from 'react';
import clsx from 'clsx';

interface SectionProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Section({ title, description, action, children, className }: SectionProps) {
  return (
    <section className={clsx('card-surface p-6 md:p-7 lg:p-8 space-y-6', className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          {description && <p className="mt-1 text-sm text-slate-300">{description}</p>}
        </div>
        {action && <div className="flex shrink-0 items-center gap-3">{action}</div>}
      </div>
      <div>{children}</div>
    </section>
  );
}
