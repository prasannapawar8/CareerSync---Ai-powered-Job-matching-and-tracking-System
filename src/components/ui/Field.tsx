'use client';

import * as React from 'react';
import { cn } from '@/src/lib/utils';

export const inputClasses =
  'w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground ' +
  'outline-none transition-[border-color,box-shadow] duration-150 ' +
  'hover:border-border-strong focus:border-primary focus:ring-2 focus:ring-primary/25 ' +
  'disabled:cursor-not-allowed disabled:opacity-60';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn(inputClasses, className)} {...props} />;
  },
);

/** Labelled form control with optional hint / error text. */
export function Field({
  label,
  hint,
  error,
  htmlFor,
  trailing,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  trailing?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
          {label}
        </label>
        {trailing}
      </div>
      {children}
      {error ? (
        <p className="text-xs font-medium text-danger">{error}</p>
      ) : hint ? (
        <p className="text-xs text-subtle">{hint}</p>
      ) : null}
    </div>
  );
}
