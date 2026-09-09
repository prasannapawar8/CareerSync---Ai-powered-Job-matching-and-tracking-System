'use client';

import React from 'react';
import { motion, type HTMLMotionProps, type Variants } from 'framer-motion';
import { cn } from '@/src/lib/utils';

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

const OFFSETS: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 28 },
  down: { x: 0, y: -28 },
  left: { x: 28, y: 0 },
  right: { x: -28, y: 0 },
  none: { x: 0, y: 0 },
};

function buildVariants(direction: Direction, duration: number, delay: number): Variants {
  return {
    hidden: { opacity: 0, ...OFFSETS[direction] },
    visible: { opacity: 1, x: 0, y: 0, transition: { duration, delay, ease: EASE } },
  };
}

interface FadeInProps extends Omit<HTMLMotionProps<'div'>, 'variants'> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: Direction;
}

/** Self-triggering reveal. Use for standalone blocks. */
export const FadeIn = ({
  children,
  delay = 0,
  duration = 0.5,
  direction = 'up',
  className,
  ...props
}: FadeInProps) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-80px' }}
    variants={buildVariants(direction, duration, delay)}
    className={cn(className)}
    {...props}
  >
    {children}
  </motion.div>
);

/**
 * Reveal that inherits its timing from a parent StaggerContainer. It
 * deliberately omits `initial`/`whileInView` so Framer Motion propagates the
 * parent's variant state — that propagation is what makes the stagger work.
 */
export const StaggerItem = ({
  children,
  duration = 0.5,
  direction = 'up',
  className,
  ...props
}: Omit<FadeInProps, 'delay'>) => (
  <motion.div variants={buildVariants(direction, duration, 0)} className={cn(className)} {...props}>
    {children}
  </motion.div>
);

export const StaggerContainer = ({
  children,
  className,
  delayChildren = 0.1,
  staggerChildren = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  delayChildren?: number;
  staggerChildren?: number;
}) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-80px' }}
    variants={{ hidden: {}, visible: { transition: { staggerChildren, delayChildren } } }}
    className={className}
  >
    {children}
  </motion.div>
);
