"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/* Motion is deliberately restrained: a short lift and fade, one easing
   curve, used on section openings only — not on every element.

   Reduced motion is honoured by collapsing the transition to zero rather
   than by rendering a different element. The tree must stay identical
   between server and client or hydration mismatches leave nodes stuck at
   opacity 0. */
export const ease = [0.22, 0.61, 0.36, 1] as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
};

export function Reveal({
  children,
  className,
  delay = 0,
  y = 12,
  once = true,
}: RevealProps) {
  const still = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-70px" }}
      transition={
        still ? { duration: 0 } : { duration: 0.85, delay, ease }
      }
    >
      {children}
    </motion.div>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  delayChildren?: number;
  stagger?: number;
};

export function Stagger({
  children,
  className,
  delayChildren = 0,
  stagger = 0.07,
}: StaggerProps) {
  const still = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-70px" }}
      variants={{
        hidden: {},
        show: {
          transition: still
            ? { staggerChildren: 0, delayChildren: 0 }
            : { staggerChildren: stagger, delayChildren },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  y = 10,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const still = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: {
          opacity: 1,
          y: 0,
          transition: still ? { duration: 0 } : { duration: 0.75, ease },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
