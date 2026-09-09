'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/src/lib/utils';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  glareEnable?: boolean;
  /** Maximum rotation in degrees on each axis. */
  intensity?: number;
}

/**
 * Pointer-tracking tilt card. The glare is driven through a motion template so
 * it follows the cursor instead of being sampled once at render time.
 */
export const TiltCard = ({
  children,
  className,
  containerClassName,
  glareEnable = true,
  intensity = 8,
}: TiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 260, damping: 22 });
  const mouseYSpring = useSpring(y, { stiffness: 260, damping: 22 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [`${intensity}deg`, `-${intensity}deg`]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [`-${intensity}deg`, `${intensity}deg`]);

  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgb(255 255 255 / 0.14) 0%, transparent 55%)`;

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div className={cn('relative flex [perspective:1000px]', containerClassName)}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className={cn(
          'relative overflow-hidden rounded-panel border border-border bg-surface elevation-sm',
          'transition-[box-shadow,border-color] duration-200 hover:border-border-strong hover:elevation-md',
          className,
        )}
      >
        {children}

        {glareEnable && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{ background: glare, opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s ease' }}
          />
        )}
      </motion.div>
    </div>
  );
};

/** Lifts a child out of the card plane for a parallax feel. */
export const CardItem = ({
  children,
  className,
  translateZ = 50,
}: {
  children: React.ReactNode;
  className?: string;
  translateZ?: number | string;
}) => (
  <div className={className} style={{ transform: `translateZ(${translateZ}px)`, transformStyle: 'preserve-3d' }}>
    {children}
  </div>
);
