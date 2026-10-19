"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { site } from "@/lib/site";

const LINKS = [
  { href: "#vitrine", label: "La vitrine" },
  { href: "#commande", label: "Commander" },
  { href: "#infos", label: "Horaires & accès" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 ${
        scrolled || open ? "border-rule bg-paper/80 backdrop-blur-lg backdrop-saturate-150" : "border-transparent"
      }`}
    >
      <nav aria-label="Navigation principale" className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#" className="font-serif text-2xl font-semibold leading-none" translate="no">
          Au Bon Fournil
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-sm font-medium decoration-crust underline-offset-[6px] hover:underline">
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a href={site.phoneHref} className="text-sm font-semibold tabular-nums text-crust hover:underline underline-offset-[6px]">
              {site.phoneDisplay}
            </a>
          </li>
        </ul>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          className="-mr-2 grid size-11 cursor-pointer place-items-center md:hidden"
        >
          {open ? <X className="size-6" strokeWidth={1.5} aria-hidden="true" /> : <Menu className="size-6" strokeWidth={1.5} aria-hidden="true" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden md:hidden"
          >
            <ul className="border-t border-rule px-5 pb-6 pt-2">
              {LINKS.map((l) => (
                <li key={l.href} className="border-b border-rule">
                  <a href={l.href} onClick={() => setOpen(false)} className="block py-4 font-serif text-3xl">
                    {l.label}
                  </a>
                </li>
              ))}
              <li className="pt-5">
                <a href={site.phoneHref} className="btn btn-ink w-full">
                  Appeler le {site.phoneDisplay}
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
