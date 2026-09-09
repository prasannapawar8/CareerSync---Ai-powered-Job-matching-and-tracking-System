import * as React from 'react';
import { cn } from '@/src/lib/utils';

type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

const tones: Record<Tone, string> = {
  neutral: 'border-border bg-surface-muted text-muted',
  brand: 'border-primary/25 bg-primary-soft text-primary',
  success: 'border-success/25 bg-success-surface text-success',
  warning: 'border-warning/25 bg-warning-surface text-warning',
  danger: 'border-danger/25 bg-danger-surface text-danger',
  info: 'border-info/25 bg-info-surface text-info',
};

export function Badge({
  tone = 'neutral',
  className,
  dot = false,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone; dot?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        tones[tone],
        className,
      )}
      {...props}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export default Badge;
