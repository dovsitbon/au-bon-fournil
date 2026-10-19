import { formatDateFR, validateOrder, type OrderInput } from "@/lib/order";
import { site } from "@/lib/site";

const FIELDS: (keyof OrderInput)[] = ["prestation", "name", "phone", "date", "event", "guests", "details"];

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/**
 * Reçoit une demande de commande spéciale.
 * Si RESEND_API_KEY et ORDER_EMAIL_TO sont définies, la demande est envoyée par email à la boulangerie.
 * Sinon la route répond { sent: false } et le site invite le client à appeler pour confirmer.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }

  // Champ piège anti-robots : rempli = on ignore silencieusement.
  if (typeof body.website === "string" && body.website.length > 0) {
    return Response.json({ sent: true });
  }

  const order = Object.fromEntries(FIELDS.map((k) => [k, String(body[k] ?? "").slice(0, 2000)])) as OrderInput;
  const errors = validateOrder(order);
  if (Object.keys(errors).length > 0) {
    return Response.json({ errors }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ORDER_EMAIL_TO;
  if (!apiKey || !to) {
    return Response.json({ sent: false });
  }

  const rows: [string, string][] = [
    ["Prestation", order.prestation],
    ["Nom", order.name],
    ["Téléphone", order.phone],
    ["Retrait", formatDateFR(order.date)],
    ["Événement", order.event],
    ["Personnes", order.guests],
    ["Détails", order.details],
  ];

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.ORDER_EMAIL_FROM ?? `${site.name} <onboarding@resend.dev>`,
      to: to.split(",").map((s) => s.trim()),
      subject: `Nouvelle demande : ${order.prestation} – ${order.name} (${formatDateFR(order.date)})`,
      text: rows.map(([k, v]) => `${k} : ${v}`).join("\n"),
      html: `<table cellpadding="6">${rows
        .map(([k, v]) => `<tr><th align="left">${k}</th><td>${escape(v).replace(/\n/g, "<br>")}</td></tr>`)
        .join("")}</table>`,
    }),
  });

  if (!res.ok) {
    console.error("Envoi Resend échoué", res.status, await res.text());
    return Response.json({ sent: false });
  }
  return Response.json({ sent: true });
}
