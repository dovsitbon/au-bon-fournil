"use client";

import { useOpenStatus } from "./useOpenStatus";

/** Statut d'ouverture en ligne de texte, avec une pastille olive (ouvert) ou terracotta (fermé). */
export function OpenBadge({ className = "", onDark = false }: { className?: string; onDark?: boolean }) {
  const status = useOpenStatus();
  const dot =
    status == null
      ? "bg-current opacity-30"
      : status.open
        ? onDark
          ? "bg-[#a9b97a]"
          : "bg-olive"
        : onDark
          ? "bg-[#e3906b]"
          : "bg-terracotta";

  return (
    <p role="status" aria-live="polite" className={`inline-flex items-center gap-2.5 text-sm font-medium ${className}`}>
      <span aria-hidden="true" className={`size-2 rounded-full transition-colors duration-500 ${dot}`} />
      {status?.label ?? "Ouvert de 6h45 à 20h, fermé le mercredi"}
    </p>
  );
}
