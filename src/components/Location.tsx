"use client";

import { useState } from "react";
import { site, WEEK } from "@/lib/site";
import { useOpenStatus } from "./useOpenStatus";
import { OpenBadge } from "./OpenBadge";

export function Location() {
  const status = useOpenStatus();
  const [mapReady, setMapReady] = useState(false);

  return (
    <section id="infos" aria-labelledby="infos-titre" className="bg-ink px-5 py-28 text-paper sm:px-8 sm:py-36">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <h2 id="infos-titre" className="font-serif text-5xl font-medium leading-[0.98] tracking-[-0.02em] sm:text-7xl">
            Horaires et accès
          </h2>
          <OpenBadge onDark className="mt-8 text-paper/90" />

          <table className="mt-10 w-full max-w-md">
            <caption className="sr-only">Horaires d&apos;ouverture de la semaine</caption>
            <tbody>
              {WEEK.map((d) => {
                const today = status?.today === d.day;
                return (
                  <tr
                    key={d.day}
                    aria-current={today ? "date" : undefined}
                    className={`border-b border-paper/15 ${today ? "text-paper" : "text-paper/65"}`}
                  >
                    <th scope="row" className="py-3 text-left font-serif text-2xl font-medium">
                      {d.label}
                      {today && <span className="ml-3 align-middle font-sans text-xs font-semibold text-[#e7b48a]">aujourd&apos;hui</span>}
                    </th>
                    <td className="py-3 text-right tabular-nums">{d.hours ?? <span className="italic">fermé</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <address className="mt-12 not-italic">
            <p className="font-serif text-2xl">{site.street}</p>
            <p className="text-paper/70">
              {site.postalCode} {site.city}
            </p>
          </address>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={site.phoneHref} className="btn btn-paper tabular-nums">
              Appeler le {site.phoneDisplay}
            </a>
            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn border border-paper/40 text-paper hover:border-paper hover:bg-paper hover:text-ink"
            >
              Ouvrir l&apos;itinéraire
              <span className="sr-only">(Google Maps, nouvel onglet)</span>
            </a>
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden bg-[#2a2622] lg:col-span-6 lg:col-start-7 lg:min-h-0">
          <div
            className={`absolute inset-0 grid place-items-center text-sm text-paper/50 transition-opacity duration-700 ${
              mapReady ? "opacity-0" : "opacity-100"
            }`}
            aria-hidden="true"
          >
            Chargement de la carte…
          </div>
          <iframe
            title={`Carte : ${site.name}, ${site.street}, ${site.postalCode} ${site.city}`}
            src={site.mapsEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => setMapReady(true)}
            className="absolute inset-0 size-full border-0 [filter:grayscale(1)_contrast(1.05)_sepia(0.15)]"
          />
        </div>
      </div>
    </section>
  );
}
