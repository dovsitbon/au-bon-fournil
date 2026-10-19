"use client";

import { motion, type Variants } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
};

/** Conteneur qui déclenche ses enfants en cascade à l'entrée dans le viewport. */
export function Stagger({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "ul" | "dl";
}) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: delay } } }}
    >
      {children}
    </Comp>
  );
}

export function Item({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li" | "p" | "h2";
}) {
  const Comp = motion[as];
  return (
    <Comp className={className} variants={fadeUp}>
      {children}
    </Comp>
  );
}
