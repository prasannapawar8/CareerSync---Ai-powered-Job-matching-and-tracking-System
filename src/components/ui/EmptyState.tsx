import * as React from 'react';
import { cn } from '@/src/lib/utils';

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'grid place-items-center rounded-panel border border-dashed border-border-strong bg-surface/60 px-6 py-14 text-center',
        className,
      )}
    >
      <div className="max-w-sm">
        {icon && (
          <span className="mx-auto mb-5 grid size-12 place-items-center rounded-2xl bg-surface-muted text-subtle">
            {icon}
          </span>
        )}
        <h3 className="font-semibold tracking-tight text-foreground">{title}</h3>
        {description && <p className="mt-2 text-sm leading-6 text-muted">{description}</p>}
        {action && <div className="mt-6 flex justify-center">{action}</div>}
      </div>
    </div>
  );
}

export default EmptyState;
