import Link from 'next/link';
import { cn } from '@/src/lib/utils';

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground elevation-glow',
        className,
      )}
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-[18px]" aria-hidden="true">
        <path
          d="M4 15.5 12 4l8 11.5-8 4.5-8-4.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M12 4v16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
      </svg>
    </span>
  );
}

export function Logo({
  href = '/',
  showWordmark = true,
  className,
}: {
  href?: string;
  showWordmark?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn('flex items-center gap-2.5 font-semibold tracking-tight text-foreground', className)}
    >
      <LogoMark />
      {showWordmark && <span className="text-[0.95rem]">CareerSync</span>}
    </Link>
  );
}

export default Logo;
