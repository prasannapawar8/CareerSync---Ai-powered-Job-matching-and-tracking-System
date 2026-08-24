import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'danger';
  size?: 'default' | 'sm' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', ...props }, ref) => {
    // Base styles
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50';

    // Variants
    const variants = {
      default: 'bg-accent text-accent-foreground hover:opacity-85',
      outline: 'border border-border bg-transparent hover:bg-surface-muted text-foreground',
      ghost: 'bg-transparent hover:bg-surface-muted text-foreground',
      danger: 'bg-danger text-white hover:opacity-85',
    };

    // Sizes
    const sizes = {
      default: 'h-10 px-4 py-2 text-sm',
      sm: 'h-9 px-3 text-xs',
      lg: 'h-11 px-8 text-base',
    };

    const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`.trim();

    return (
      <button ref={ref} className={combinedClassName} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button };
