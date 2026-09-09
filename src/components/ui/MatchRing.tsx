import * as React from 'react';
import { cn } from '@/src/lib/utils';

/**
 * Circular gauge for a 0–100 resume/job match score. Colour steps at 75 and 50
 * so a glance is enough to rank a list of results.
 */
export function MatchRing({ score, size = 56, className }: { score: number; size?: number; className?: string }) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const stroke = size >= 56 ? 5 : 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);

  const tone = clamped >= 75 ? 'text-success' : clamped >= 50 ? 'text-primary' : 'text-warning';

  return (
    <div
      className={cn('relative shrink-0', className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${clamped}% match with your resume`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-border"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn('stroke-current transition-[stroke-dashoffset] duration-700', tone)}
        />
      </svg>
      <span
        className={cn(
          'absolute inset-0 grid place-items-center font-semibold tabular-nums',
          tone,
          size >= 56 ? 'text-sm' : 'text-xs',
        )}
      >
        {clamped}
      </span>
    </div>
  );
}

export default MatchRing;
