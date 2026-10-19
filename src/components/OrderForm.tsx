"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import { EVENTS, PRESTATIONS, formatDateFR, minPickupDate, validateOrder, type OrderErrors, type OrderInput } from "@/lib/order";
import { site } from "@/lib/site";
import { Item, Stagger } from "./Reveal";

const EMPTY: OrderInput = { prestation: PRESTATIONS[0], name: "", phone: "", date: "", event: "", guests: "", details: "" };

type Result = { sent: boolean; order: OrderInput };

export function OrderForm() {
  const [values, setValues] = useState<OrderInput>(EMPTY);
  const [errors, setErrors] = useState<OrderErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof OrderInput, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [result, setResult] = useState<Result | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (result) resultRef.current?.focus();
  }, [result]);

  const set = (k: keyof OrderInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const next = { ...values, [k]: e.target.value };
    setValues(next);
    if (touched[k]) setErrors(validateOrder(next));
  };
  const blur = (k: keyof OrderInput) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validateOrder(values));
  };
  const err = (k: keyof OrderInput) => (touched[k] ? errors[k] : undefined);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validateOrder(values);
    setErrors(found);
    setTouched(Object.fromEntries(Object.keys(values).map((k) => [k, true])));
    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const website = (formRef.current?.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";
      const res = await fetch("/api/commande", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website }),
      });
      const data = await res.json();
      if (res.status === 422 && data.errors) {
        setErrors(data.errors);
        setStatus("idle");
        return;
      }
      if (!res.ok) throw new Error();
      setResult({ sent: Boolean(data.sent), order: values });
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  function reset() {
    setValues(EMPTY);
    setErrors({});
    setTouched({});
    setResult(null);
  }

  return (
    <section id="commande" aria-labelledby="commande-titre" className="px-5 py-28 sm:px-8 sm:py-36">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Stagger>
              <Item as="h2" className="font-serif text-5xl font-medium leading-[0.98] tracking-[-0.02em] text-balance sm:text-7xl">
                <span id="commande-titre">Commandes spéciales et traiteur</span>
              </Item>
              <Item as="p" className="mt-8 max-w-md text-lg leading-relaxed text-ink-soft">
                Un gâteau pour un anniversaire, un buffet pour vingt personnes, des pièces cocktail pour un pot de
                départ : décrivez votre demande, nous préparons le reste.
              </Item>
            </Stagger>

            <ol className="mt-12 max-w-md border-t border-rule">
              {[
                ["Vous décrivez", "La date de retrait, l'occasion, le nombre de personnes et vos envies."],
                ["Nous vous rappelons", "Pour choisir les parfums, le décor et vous donner le tarif."],
                ["Vous passez prendre", "Au 2 rue de Sprimont, le jour convenu."],
              ].map(([title, text], i) => (
                <li key={title} className="grid grid-cols-[2.5rem_1fr] border-b border-rule py-5">
                  <span className="font-serif text-2xl leading-none text-crust [font-variant-numeric:lining-nums]">{i + 1}</span>
                  <span>
                    <span className="block font-semibold">{title}</span>
                    <span className="mt-1 block text-[0.95rem] text-ink-soft">{text}</span>
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-6 max-w-md text-sm text-ink-soft">
              Prévoyez au moins 48 heures pour un gâteau, davantage pour un buffet. Pour une demande urgente, appelez le{" "}
              <a href={site.phoneHref} className="link font-semibold tabular-nums text-ink decoration-crust">
                {site.phoneDisplay}
              </a>
              .
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-6 lg:col-start-7"
        >
          <div className="relative mb-10 aspect-[16/9] overflow-hidden bg-flour">
            <Image
              src="/images/gateau-perso.jpg"
              alt="Gâteau à étages au chocolat garni de cerises et de fruits rouges"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover object-[50%_40%]"
            />
          </div>
          <AnimatePresence mode="wait" initial={false}>
            {result ? (
              <motion.div
                key="ok"
                ref={resultRef}
                tabIndex={-1}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="outline-none"
                role="status"
              >
                <h3 className="font-serif text-4xl font-medium leading-tight">
                  {result.sent ? "Demande envoyée" : "Votre demande est prête"}
                </h3>
                <p className="mt-3 max-w-lg leading-relaxed text-ink-soft">
                  {result.sent
                    ? "Nous vous rappelons au numéro indiqué pour confirmer les détails et le tarif."
                    : "Pour valider votre commande, appelez-nous en mentionnant ce récapitulatif : nous confirmons la date et le tarif avec vous."}
                </p>
                <dl className="mt-8 border-t border-ink text-[0.95rem]">
                  {[
                    ["Prestation", result.order.prestation],
                    ["Retrait", formatDateFR(result.order.date)],
                    ["Événement", result.order.event],
                    ["Personnes", result.order.guests],
                    ["Détails", result.order.details],
                  ].map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-3 border-b border-rule py-3.5">
                      <dt className="font-semibold">{k}</dt>
                      <dd className="whitespace-pre-line break-words text-ink-soft first-letter:uppercase">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a href={site.phoneHref} className={`btn ${result.sent ? "btn-line" : "btn-ink"}`}>
                    Appeler le {site.phoneDisplay}
                  </a>
                  <button type="button" onClick={reset} className="btn btn-line">
                    Faire une autre demande
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                ref={formRef}
                onSubmit={onSubmit}
                noValidate
                exit={{ opacity: 0, scale: 0.98 }}
                aria-describedby="form-aide"
              >
                <fieldset>
                  <legend className="text-sm font-semibold">Votre demande concerne</legend>
                  <div className="mt-3 grid grid-cols-2 border border-ink">
                    {PRESTATIONS.map((p) => {
                      const active = values.prestation === p;
                      return (
                        <label
                          key={p}
                          className={`relative flex min-h-13 cursor-pointer items-center justify-center px-3 text-center font-serif text-xl transition-colors duration-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-crust ${
                            active ? "text-paper" : "text-ink hover:bg-flour"
                          }`}
                        >
                          <input
                            type="radio"
                            name="prestation"
                            value={p}
                            checked={active}
                            onChange={set("prestation")}
                            className="sr-only"
                          />
                          {active && (
                            <motion.span
                              layoutId="prestation-active"
                              className="absolute inset-0 bg-ink"
                              transition={{ type: "spring", stiffness: 380, damping: 36 }}
                            />
                          )}
                          <span className="relative">{p}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="mt-6 grid gap-5 sm:grid-cols-6">
                  <Field label="Nom et prénom" name="name" error={err("name")} className="sm:col-span-3">
                    <input
                      id="name"
                      name="name"
                      autoComplete="name"
                      className="field"
                      value={values.name}
                      onChange={set("name")}
                      onBlur={blur("name")}
                      aria-invalid={!!err("name")}
                      aria-describedby={err("name") ? "name-err" : undefined}
                    />
                  </Field>
                  <Field label="Téléphone" name="phone" error={err("phone")} className="sm:col-span-3">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="06 12 34 56 78"
                      className="field"
                      value={values.phone}
                      onChange={set("phone")}
                      onBlur={blur("phone")}
                      aria-invalid={!!err("phone")}
                      aria-describedby={err("phone") ? "phone-err" : undefined}
                    />
                  </Field>
                  <Field label="Date de retrait" name="date" error={err("date")} hint="Fermé le mercredi" className="sm:col-span-6 md:col-span-2">
                    <input
                      id="date"
                      name="date"
                      autoComplete="off"
                      type="date"
                      onFocus={(e) => (e.currentTarget.min = minPickupDate())}
                      className="field"
                      value={values.date}
                      onChange={set("date")}
                      onBlur={blur("date")}
                      aria-invalid={!!err("date")}
                      aria-describedby={err("date") ? "date-err" : "date-hint"}
                    />
                  </Field>
                  <Field label="Type d'événement" name="event" error={err("event")} className="sm:col-span-3 md:col-span-2">
                    <select
                      id="event"
                      name="event"
                      autoComplete="off"
                      className="field cursor-pointer"
                      value={values.event}
                      onChange={set("event")}
                      onBlur={blur("event")}
                      aria-invalid={!!err("event")}
                      aria-describedby={err("event") ? "event-err" : undefined}
                    >
                      <option value="" disabled>
                        Choisir…
                      </option>
                      {EVENTS.map((ev) => (
                        <option key={ev}>{ev}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Personnes" name="guests" error={err("guests")} className="sm:col-span-3 md:col-span-2">
                    <input
                      id="guests"
                      name="guests"
                      autoComplete="off"
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={500}
                      className="field"
                      value={values.guests}
                      onChange={set("guests")}
                      onBlur={blur("guests")}
                      aria-invalid={!!err("guests")}
                      aria-describedby={err("guests") ? "guests-err" : undefined}
                    />
                  </Field>
                  <Field label="Détails de votre demande" name="details" error={err("details")} className="sm:col-span-6">
                    <textarea
                      id="details"
                      name="details"
                      autoComplete="off"
                      rows={4}
                      placeholder={
                        values.prestation === PRESTATIONS[0]
                          ? "Parfum, thème, inscription, allergies…"
                          : "Salé, sucré, pièces cocktail, budget approximatif…"
                      }
                      className="field resize-y"
                      value={values.details}
                      onChange={set("details")}
                      onBlur={blur("details")}
                      aria-invalid={!!err("details")}
                      aria-describedby={err("details") ? "details-err" : undefined}
                    />
                  </Field>
                </div>

                {/* Champ piège, invisible pour les humains */}
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <label>
                    Site web <input name="website" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>

                {status === "error" && (
                  <p role="alert" className="mt-5 flex items-start gap-2 border-l-2 border-terracotta bg-flour p-3 text-sm font-medium text-terracotta">
                    <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    La demande n&apos;a pas pu partir. Réessayez, ou appelez-nous au {site.phoneDisplay}.
                  </p>
                )}

                <button type="submit" disabled={status === "sending"} className="btn btn-ink mt-8 w-full disabled:cursor-wait disabled:opacity-70">
                  {status === "sending" ? (
                    <>
                      <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                      Envoi en cours…
                    </>
                  ) : (
                    "Envoyer la demande"
                  )}
                </button>
                <p id="form-aide" className="mt-4 text-xs text-ink-soft">
                  Tous les champs sont obligatoires. Vos coordonnées servent uniquement à vous rappeler au sujet de cette commande.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  error,
  hint,
  className = "",
  children,
}: {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-2 block text-sm font-semibold">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${name}-err`} className="mt-1.5 flex items-center gap-1.5 text-sm font-semibold text-terracotta">
          <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${name}-hint`} className="mt-1.5 text-xs text-ink-soft">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
