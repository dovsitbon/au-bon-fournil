"use client";

import { useEffect, useState } from "react";
import { getOpenStatus, parisNow, type OpenStatus } from "@/lib/site";

/**
 * Statut d'ouverture calculé côté client (heure de Paris), rafraîchi chaque minute.
 * Renvoie null au premier rendu pour éviter un écart d'hydratation.
 */
export function useOpenStatus(): (OpenStatus & { today: number }) | null {
  const [status, setStatus] = useState<(OpenStatus & { today: number }) | null>(null);

  useEffect(() => {
    const update = () => setStatus({ ...getOpenStatus(), today: parisNow().day });
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  return status;
}
