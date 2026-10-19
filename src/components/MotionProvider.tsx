"use client";

import { MotionConfig } from "framer-motion";

/** Respecte prefers-reduced-motion pour toutes les animations Framer Motion. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
