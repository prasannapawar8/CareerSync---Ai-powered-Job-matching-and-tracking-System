import * as React from 'react';
import { cn } from '@/src/lib/utils';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
type Size = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  /** Renders a spinner and disables the button. */
  loading?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const base =
  'relative inline-flex select-none items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap ' +
  'transition-[background-color,border-color,color,box-shadow,transform] duration-150 ' +
  'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50';

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary-hover elevation-sm hover:elevation-glow',
  secondary: 'bg-surface-muted text-foreground hover:bg-border',
  outline: 'border border-border bg-surface text-foreground hover:border-border-strong hover:bg-surface-muted',
  ghost: 'bg-transparent text-muted hover:bg-surface-muted hover:text-foreground',
  danger: 'bg-danger text-white hover:brightness-110 elevation-sm',
  success: 'bg-success text-white hover:brightness-110 elevation-sm',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-[0.95rem]',
  icon: 'size-9 p-0',
};

function Spinner() {
  return (
    <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', size = 'md', loading = false, leadingIcon, trailingIcon, children, disabled, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {loading ? <Spinner /> : leadingIcon}
      {children}
      {!loading && trailingIcon}
    </button>
  );
});

export default Button;
