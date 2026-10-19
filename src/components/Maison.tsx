"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Item, Stagger } from "./Reveal";

const SERVICES = [
  { name: "Pain artisanal", detail: "Baguettes, levain, campagne, céréales" },
  { name: "Pâtisserie sur commande", detail: "Entremets, tartes, gâteaux d'anniversaire" },
  { name: "Traiteur", detail: "Buffets, plateaux, pièces cocktail" },
  { name: "Sandwichs & snacking", detail: "Sandwichs, quiches, feuilletés" },
  { name: "Boissons à emporter", detail: "Café, boissons chaudes et fraîches" },
];

export function Maison() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-8%", "8%"]);
  const wordX = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["4%", "-6%"]);

  return (
    <section aria-labelledby="maison-titre" className="relative overflow-hidden bg-flour">
      {/* Mot géant en filigrane */}
      <motion.p
        style={{ x: wordX }}
        aria-hidden="true"
        className="pointer-events-none absolute -top-[0.18em] left-0 select-none whitespace-nowrap font-serif text-[clamp(9rem,30vw,26rem)] font-medium leading-none tracking-[-0.04em] text-ink/[0.045]"
      >
        Fournil
      </motion.p>

      <div className="relative mx-auto grid max-w-7xl gap-14 px-5 py-28 sm:px-8 sm:py-36 lg:grid-cols-12">
        <Stagger className="lg:col-span-6">
          <Item as="h2" className="font-serif text-4xl font-medium leading-[1.08] tracking-[-0.015em] text-balance sm:text-6xl">
            <span id="maison-titre">Une boulangerie de quartier, avec ses habitudes.</span>
          </Item>
          <Item as="p" className="mt-8 max-w-md text-lg leading-relaxed text-ink-soft">
            La première fournée sort à 6h45. Les gâteaux de fête se préparent à la demande, pour la date et le nombre
            de personnes que vous nous donnez. Le mercredi, le fournil se repose.
          </Item>
        </Stagger>

        <Stagger as="dl" className="border-t border-ink lg:col-span-5 lg:col-start-8 lg:mt-3" delay={0.15}>
          {SERVICES.map((s) => (
            <Item key={s.name} className="grid gap-1 border-b border-rule py-5 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-6">
              <dt className="font-serif text-2xl font-medium">{s.name}</dt>
              <dd className="text-sm text-ink-soft sm:text-right">{s.detail}</dd>
            </Item>
          ))}
        </Stagger>
      </div>

      <figure ref={ref} className="relative">
        <div className="relative h-[58vh] min-h-[340px] overflow-hidden sm:h-[72vh]">
          <motion.div style={{ y }} className="absolute -inset-y-[10%] inset-x-0">
            <Image
              src="/images/vitrine.jpg"
              alt="La vitrine d'une boulangerie garnie de viennoiseries et de pains"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </div>
        <figcaption className="mx-auto max-w-7xl px-5 py-4 text-sm text-ink-soft sm:px-8">
          Viennoiseries et pains en vitrine, chaque matin.
        </figcaption>
      </figure>
    </section>
  );
}
