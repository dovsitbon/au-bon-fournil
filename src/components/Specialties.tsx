"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { CATEGORIES, PRODUCTS, type CategoryId, type Product } from "@/lib/products";

type Filter = CategoryId | "tout";

/**
 * Mise en page éditoriale : chaque position dans la grille a sa largeur, son format
 * et son décalage vertical, pour éviter une rangée de cartes identiques.
 */
const LAYOUT = [
  { col: "md:col-span-7", aspect: "aspect-[4/5]", offset: "" },
  { col: "md:col-span-5", aspect: "aspect-[4/3]", offset: "md:mt-40" },
  { col: "md:col-span-4", aspect: "aspect-square", offset: "" },
  { col: "md:col-span-4", aspect: "aspect-[3/4]", offset: "md:mt-24" },
  { col: "md:col-span-4", aspect: "aspect-square", offset: "" },
  { col: "md:col-span-5 md:col-start-2", aspect: "aspect-[4/3]", offset: "" },
  { col: "md:col-span-5 md:col-start-8", aspect: "aspect-[4/5]", offset: "md:mt-32" },
];

export function Specialties() {
  const [filter, setFilter] = useState<Filter>("tout");
  const items = filter === "tout" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);
  const filters: { id: Filter; label: string; count: number }[] = [
    { id: "tout", label: "Tout", count: PRODUCTS.length },
    ...CATEGORIES.map((c) => ({ ...c, count: PRODUCTS.filter((p) => p.category === c.id).length })),
  ];

  return (
    <section id="vitrine" aria-labelledby="vitrine-titre" className="px-5 py-28 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <h2
            id="vitrine-titre"
            className="font-serif text-5xl font-medium leading-[0.95] tracking-[-0.02em] text-balance sm:text-7xl lg:col-span-7"
          >
            Nos spécialités, du pétrin à la vitrine
          </h2>
          <p className="max-w-sm text-ink-soft lg:col-span-4 lg:col-start-9">
            Ce que vous trouverez au comptoir chaque jour, et ce que nous préparons sur commande pour vos fêtes.
          </p>
        </div>

        <div
          role="toolbar"
          aria-label="Filtrer par catégorie"
          className="-mx-5 mt-14 flex gap-7 overflow-x-auto border-b border-rule px-5 [scrollbar-width:none] sm:mx-0 sm:px-0"
        >
          {filters.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                aria-pressed={active}
                className={`relative min-h-12 shrink-0 cursor-pointer pb-1 text-[0.95rem] transition-colors duration-300 ${
                  active ? "font-semibold text-ink" : "text-ink-soft hover:text-ink"
                }`}
              >
                {f.label}
                <sup className="ml-1 text-[0.65rem] font-medium tabular-nums text-ink-soft">{f.count}</sup>
                {active && (
                  <motion.span
                    layoutId="filtre-actif"
                    className="absolute inset-x-0 -bottom-px h-[2px] bg-crust"
                    transition={{ type: "spring", stiffness: 380, damping: 36 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <ul className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 md:grid-cols-12 md:gap-y-20">
          <AnimatePresence mode="popLayout" initial={false}>
            {items.map((p, i) => (
              <ProductEntry key={p.id} product={p} layout={LAYOUT[i % LAYOUT.length]} showCategory={filter === "tout"} />
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </section>
  );
}

function ProductEntry({
  product: p,
  layout,
  showCategory,
}: {
  product: Product;
  layout: (typeof LAYOUT)[number];
  showCategory: boolean;
}) {
  const category = CATEGORIES.find((c) => c.id === p.category)!.label;
  const orderable = p.category === "traiteur" || p.category === "patisseries";

  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`group ${layout.col} ${layout.offset}`}
    >
      {p.image ? (
        <div className={`relative overflow-hidden bg-flour ${layout.aspect}`}>
          <Image
            src={p.image}
            alt={p.name}
            fill
            sizes="(min-width: 768px) 50vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
          />
        </div>
      ) : (
        <div className={`flex items-end bg-flour p-7 sm:p-9 ${layout.aspect}`}>
          <p className="font-serif text-4xl font-medium leading-[1.05] tracking-[-0.01em] text-crust sm:text-5xl" aria-hidden="true">
            {p.name}
          </p>
        </div>
      )}

      <div className="mt-5 max-w-md">
        {showCategory && <p className="text-[0.8rem] font-medium text-crust">{category}</p>}
        <h3 className="mt-1 font-serif text-[1.85rem] font-medium leading-tight">{p.name}</h3>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">{p.description}</p>
        {orderable && (
          <a href="#commande" className="link mt-3 inline-block text-sm font-semibold decoration-crust">
            Commander
            <span className="sr-only"> : {p.name}</span>
          </a>
        )}
      </div>
    </motion.li>
  );
}
