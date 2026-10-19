import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="overflow-hidden bg-flour px-5 pt-20 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 text-sm sm:grid-cols-3">
        <address className="not-italic">
          <p className="font-semibold">Adresse</p>
          <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="link mt-2 inline-block text-ink-soft decoration-rule hover:decoration-crust">
            {site.street}
            <br />
            {site.postalCode} {site.city}
          </a>
        </address>
        <div>
          <p className="font-semibold">Horaires</p>
          <p className="mt-2 text-ink-soft">
            Lundi, mardi, jeudi à dimanche
            <br />
            6h45 – 20h00, fermé le mercredi
          </p>
        </div>
        <div>
          <p className="font-semibold">Téléphone</p>
          <a href={site.phoneHref} className="link mt-2 inline-block tabular-nums text-ink-soft decoration-rule hover:decoration-crust">
            {site.phoneDisplay}
          </a>
        </div>
      </div>
      <p
        aria-hidden="true"
        translate="no"
        className="mx-auto mt-20 max-w-7xl select-none whitespace-nowrap font-serif text-[clamp(3.5rem,13.2vw,12rem)] font-medium leading-[0.8] tracking-[-0.04em] text-ink"
      >
        Au Bon Fournil
      </p>
    </footer>
  );
}
