import * as React from 'react';
import { cn } from '@/src/lib/utils';

/** Surface container used for every panel in the app. */
export function Card({
  className,
  interactive = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        'rounded-panel border border-border bg-surface elevation-sm',
        interactive &&
          'transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:elevation-md',
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex items-start gap-4 border-b border-border px-5 py-4 sm:px-6 sm:py-5', className)}>
      {icon && (
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">{icon}</span>
      )}
      <div className="min-w-0 flex-1">
        <h2 className="font-semibold tracking-tight text-foreground">{title}</h2>
        {description && <p className="mt-1 text-sm leading-6 text-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-5 py-5 sm:px-6 sm:py-6', className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center gap-3 border-t border-border px-5 py-4 sm:px-6', className)}
      {...props}
    />
  );
}
