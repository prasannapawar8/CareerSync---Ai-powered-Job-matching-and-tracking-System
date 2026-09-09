'use client';

import * as React from 'react';
import { cn } from '@/src/lib/utils';

/**
 * Accessible dialog shell: closes on Escape / backdrop click, locks body
 * scroll, and moves focus into the panel on open.
 */
export function Modal({
  open = true,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: {
  open?: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-end justify-center bg-black/55 p-0 backdrop-blur-sm animate-fade-in sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={cn(
          'flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-panel border border-border bg-surface',
          'elevation-lg animate-scale-in outline-none sm:max-w-2xl sm:rounded-panel',
          className,
        )}
      >
        <header className="flex items-start gap-4 border-b border-border px-5 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-semibold tracking-tight text-foreground">{title}</h2>
            {description && <p className="mt-1 text-sm text-muted">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="grid size-8 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">{children}</div>

        {footer && (
          <footer className="flex flex-wrap items-center justify-end gap-3 border-t border-border bg-surface-muted/50 px-5 py-4 sm:px-6">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}

export default Modal;
