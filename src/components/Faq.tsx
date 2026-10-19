import { FAQ } from "@/lib/faq";

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-titre" className="px-5 py-28 sm:px-8 sm:py-36">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:gap-8">
        <h2
          id="faq-titre"
          className="font-serif text-5xl font-medium leading-[0.98] tracking-[-0.02em] sm:text-7xl lg:col-span-4"
        >
          Questions fréquentes
        </h2>
        <div className="border-t border-ink lg:col-span-7 lg:col-start-6">
          {FAQ.map((f) => (
            <details key={f.q} className="group border-b border-rule">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 font-serif text-2xl leading-snug transition-colors hover:text-crust [&::-webkit-details-marker]:hidden">
                {f.q}
                <span
                  aria-hidden="true"
                  className="relative size-4 shrink-0 before:absolute before:left-0 before:top-1/2 before:h-px before:w-4 before:bg-current after:absolute after:left-1/2 after:top-0 after:h-4 after:w-px after:bg-current after:transition-transform after:duration-300 group-open:after:scale-y-0"
                />
              </summary>
              <p className="max-w-2xl pb-7 pr-10 leading-relaxed text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
