import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import { MotionProvider } from "@/components/MotionProvider";
import { site, WEEK } from "@/lib/site";
import { FAQ } from "@/lib/faq";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const title = "Au Bon Fournil, boulangerie artisanale à Montmagny (95)";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    siteName: site.name,
    title,
    description: site.description,
    images: [{ url: "/images/hero-croissants.jpg", width: 1920, height: 1280, alt: "Croissants dorés saupoudrés de farine" }],
  },
  twitter: { card: "summary_large_image", title, description: site.description, images: ["/images/hero-croissants.jpg"] },
};

export const viewport: Viewport = {
  themeColor: "#faf8f5",
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Bakery",
    "@id": `${site.url}/#bakery`,
    name: site.name,
    description: site.description,
    url: site.url,
    telephone: site.phoneE164,
    image: `${site.url}/images/hero-croissants.jpg`,
    servesCuisine: "Boulangerie-pâtisserie française",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.street,
      postalCode: site.postalCode,
      addressLocality: site.city,
      addressRegion: site.region,
      addressCountry: "FR",
    },
    hasMap: site.mapsUrl,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: WEEK.filter((d) => d.hours).map(
          (d) => ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d.day],
        ),
        opens: "06:45",
        closes: "20:00",
      },
    ],
    makesOffer: ["Pain artisanal", "Pâtisserie sur commande", "Traiteur", "Sandwichs et snacking", "Boissons à emporter"].map(
      (name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } }),
    ),
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${jakarta.variable} antialiased`}>
      <body className="min-h-dvh">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-paper focus:px-4 focus:py-2 focus:font-bold"
        >
          Aller au contenu
        </a>
        <MotionProvider>{children}</MotionProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
