export const site = {
  name: "Au Bon Fournil",
  tagline: "Artisan boulanger à Montmagny",
  description:
    "Boulangerie-pâtisserie artisanale à Montmagny (95) : pain cuit chaque jour, pâtisseries et gâteaux sur commande, traiteur, sandwichs et boissons à emporter.",
  street: "2 Rue de Sprimont",
  postalCode: "95360",
  city: "Montmagny",
  region: "Val-d'Oise",
  phoneDisplay: "01 87 63 22 62",
  phoneE164: "+33187632262",
  phoneHref: "tel:+33187632262",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Au+Bon+Fournil+2+Rue+de+Sprimont+95360+Montmagny",
  mapsEmbed:
    "https://www.google.com/maps?q=2+Rue+de+Sprimont,+95360+Montmagny&z=16&output=embed",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://au-bon-fournil.vercel.app").replace(/\/$/, ""),
} as const;

/** Minutes depuis minuit (heure de Paris). */
export const OPEN_AT = 6 * 60 + 45;
export const CLOSE_AT = 20 * 60;
/** Jour de fermeture, numérotation JS (0 = dimanche, 3 = mercredi). */
export const CLOSED_DAY = 3;

export const DAY_NAMES = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

/** Semaine affichée du lundi au dimanche. */
export const WEEK = [1, 2, 3, 4, 5, 6, 0].map((day) => ({
  day,
  label: DAY_NAMES[day][0].toUpperCase() + DAY_NAMES[day].slice(1),
  hours: day === CLOSED_DAY ? null : "6h45 – 20h00",
}));

const WEEKDAY_INDEX: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

export function parisNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Paris",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "0";
  return { day: WEEKDAY_INDEX[get("weekday")], minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

export type OpenStatus = { open: boolean; label: string };

export function getOpenStatus(date = new Date()): OpenStatus {
  const { day, minutes } = parisNow(date);
  const openToday = day !== CLOSED_DAY;

  if (openToday && minutes >= OPEN_AT && minutes < CLOSE_AT) {
    return { open: true, label: "Ouvert jusqu'à 20h" };
  }
  if (openToday && minutes < OPEN_AT) {
    return { open: false, label: "Fermé · Ouvre aujourd'hui à 6h45" };
  }

  let offset = 1;
  while ((day + offset) % 7 === CLOSED_DAY) offset++;
  const when = offset === 1 ? "demain" : DAY_NAMES[(day + offset) % 7];
  return { open: false, label: `Fermé · Ouvre ${when} à 6h45` };
}
