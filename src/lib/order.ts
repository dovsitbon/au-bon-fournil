import { CLOSED_DAY } from "./site";

export const PRESTATIONS = ["Gâteau personnalisé", "Service traiteur"] as const;
export const EVENTS = ["Anniversaire", "Mariage", "Baptême / Communion", "Événement d'entreprise", "Fête de famille", "Autre"] as const;

export type OrderInput = {
  prestation: string;
  name: string;
  phone: string;
  date: string;
  event: string;
  guests: string;
  details: string;
};

export type OrderErrors = Partial<Record<keyof OrderInput, string>>;

/** Délai minimum avant retrait, en jours. */
export const MIN_DAYS = 2;

export function toISODate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function minPickupDate(now = new Date()) {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + MIN_DAYS);
  return toISODate(d);
}

/** Validation partagée entre le formulaire et la route API. */
export function validateOrder(o: OrderInput, now = new Date()): OrderErrors {
  const e: OrderErrors = {};
  if (!PRESTATIONS.includes(o.prestation as (typeof PRESTATIONS)[number])) e.prestation = "Choisissez une prestation.";
  if (o.name.trim().length < 2) e.name = "Indiquez votre nom.";
  const digits = o.phone.replace(/[^\d+]/g, "");
  if (!/^(?:\+33|0)[1-9]\d{8}$/.test(digits)) e.phone = "Numéro français à 10 chiffres, ex. 06 12 34 56 78.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(o.date)) {
    e.date = "Choisissez une date de retrait.";
  } else {
    const [y, m, d] = o.date.split("-").map(Number);
    const picked = new Date(y, m - 1, d);
    if (o.date < minPickupDate(now)) e.date = `Merci de prévoir au moins ${MIN_DAYS} jours de délai.`;
    else if (picked.getDay() === CLOSED_DAY) e.date = "La boulangerie est fermée le mercredi.";
  }
  if (!o.event) e.event = "Choisissez un type d'événement.";
  const guests = Number(o.guests);
  if (!Number.isInteger(guests) || guests < 1 || guests > 500) e.guests = "Entre 1 et 500 personnes.";
  if (o.details.trim().length < 10) e.details = "Décrivez votre demande en quelques mots (parfums, thème, quantités…).";
  if (o.details.length > 2000) e.details = "2000 caractères maximum.";
  return e;
}

export function formatDateFR(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}
