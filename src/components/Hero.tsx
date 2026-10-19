"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { site } from "@/lib/site";
import { OpenBadge } from "./OpenBadge";

const SLIDES = [
  { src: "/images/hero-croissants.jpg", caption: "Croissants du matin", alt: "Croissants dorés saupoudrés de farine" },
  { src: "/images/hero-pain.jpg", caption: "Pains de campagne", alt: "Pains de campagne à la croûte farinée et épis de blé" },
  { src: "/images/hero-assortiment.jpg", caption: "Baguettes et pains spéciaux", alt: "Assortiment de baguettes, boules et petits pains" },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "12%"]);

  useEffect(() => {
    if (reduce || paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 6500);
    return () => clearInterval(id);
  }, [reduce, paused]);

  const line = (delay: number) => ({
    initial: { y: "105%" },
    animate: { y: "0%" },
    transition: { duration: 1.1, delay, ease },
  });
  const fade = (delay: number) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 1, delay, ease },
  });

  return (
    <section ref={ref} className="relative overflow-hidden pt-16">
      <div className="mx-auto grid max-w-7xl gap-x-8 px-5 pb-16 pt-10 sm:px-8 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-12 lg:items-end lg:pb-20 lg:pt-12">
        <div className="relative z-10 lg:col-span-7 lg:row-start-1 lg:pb-6">
          <motion.p {...fade(0.1)} className="text-[0.95rem] font-semibold text-crust">
            Artisan boulanger à Montmagny
          </motion.p>

          <h1 className="mt-4 font-serif font-medium leading-[0.82] tracking-[-0.035em] text-[clamp(4.6rem,22vw,8rem)] lg:text-[clamp(8rem,15.5vw,14.5rem)] lg:-mr-48 lg:whitespace-nowrap">
            <span className="block overflow-hidden pb-[0.06em]" translate="no">
              <motion.span className="block" {...line(0.15)}>
                Au Bon
              </motion.span>
            </span>
            {" "}
            <span className="block overflow-hidden pb-[0.1em]" translate="no">
              <motion.span className="block lg:pl-[0.42em]" {...line(0.3)}>
                Fournil
              </motion.span>
            </span>
            <span className="sr-only">, boulangerie-pâtisserie artisanale à Montmagny</span>
          </h1>

          <motion.div {...fade(0.75)} className="mt-8 max-w-md lg:mt-10">
            <p className="text-lg leading-relaxed text-ink-soft">
              Le pain, les viennoiseries et les pâtisseries de la maison, tous les jours sauf le mercredi. Gâteaux de
              fête et buffets sur commande.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href="#commande" className="btn btn-ink">
                Commander une pâtisserie
              </a>
              <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-line">
                S&apos;y rendre
                <span className="sr-only">(Google Maps, nouvel onglet)</span>
              </a>
            </div>
            <OpenBadge className="mt-6 text-ink" />
          </motion.div>
        </div>

        <motion.figure
          initial={{ opacity: 0, clipPath: "inset(18% 0% 0% 0%)" }}
          animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: 1.4, delay: 0.2, ease }}
          className="mt-14 lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:mt-0 lg:self-stretch lg:pt-6"
        >
          {/* Cadre en arche, comme la gueule d'un four */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] bg-flour max-lg:mx-auto max-lg:max-w-md lg:h-[calc(100%-3rem)] lg:aspect-auto">
            <motion.div style={{ y: imageY }} className="absolute -inset-y-[8%] inset-x-0">
              <AnimatePresence initial={false}>
                <motion.div
                  key={index}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.6, ease: "easeInOut" }}
                >
                  <Image
                    src={SLIDES[index].src}
                    alt={SLIDES[index].alt}
                    fill
                    priority={index === 0}
                    sizes="(min-width: 1024px) 40vw, 90vw"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
          <figcaption className="mt-4 flex items-center justify-between gap-4 text-sm text-ink-soft max-lg:mx-auto max-lg:max-w-md">
            <span aria-live="polite">{SLIDES[index].caption}</span>
            <span className="flex items-center gap-1">
              {!reduce && (
                <button
                  type="button"
                  onClick={() => setPaused((p) => !p)}
                  aria-label={paused ? "Reprendre le défilement des photos" : "Mettre en pause le défilement des photos"}
                  className="grid size-8 cursor-pointer place-items-center text-ink-soft transition-colors hover:text-ink"
                >
                  {paused ? <Play className="size-3.5" aria-hidden="true" /> : <Pause className="size-3.5" aria-hidden="true" />}
                </button>
              )}
              {SLIDES.map((s, i) => (
                <button
                  key={s.src}
                  type="button"
                  onClick={() => {
                    setIndex(i);
                    setPaused(true);
                  }}
                  aria-label={`Afficher : ${s.caption}`}
                  aria-pressed={i === index}
                  className="grid size-8 cursor-pointer place-items-center"
                >
                  <span
                    className={`block size-1.5 rounded-full transition-colors duration-500 ${
                      i === index ? "bg-ink" : "bg-ink/25 hover:bg-ink/50"
                    }`}
                  />
                </button>
              ))}
            </span>
          </figcaption>
        </motion.figure>
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <dl className="grid grid-cols-1 border-t border-rule text-sm sm:grid-cols-3">
          <div className="flex justify-between gap-4 border-b border-rule py-4 sm:block sm:border-b-0 sm:border-r sm:pr-6">
            <dt className="text-ink-soft">Adresse</dt>
            <dd className="font-medium sm:mt-1">
              {site.street}, {site.city}
            </dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-rule py-4 sm:block sm:border-b-0 sm:border-r sm:px-6">
            <dt className="text-ink-soft">Horaires</dt>
            <dd className="font-medium sm:mt-1">6h45 – 20h, fermé le mercredi</dd>
          </div>
          <div className="flex justify-between gap-4 py-4 sm:block sm:pl-6">
            <dt className="text-ink-soft">Téléphone</dt>
            <dd className="sm:mt-1">
              <a href={site.phoneHref} className="link font-medium tabular-nums decoration-crust">
                {site.phoneDisplay}
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
