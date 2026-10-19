export const CATEGORIES = [
  { id: "pains", label: "Pains & baguettes" },
  { id: "patisseries", label: "Pâtisseries & tartes" },
  { id: "snacking", label: "Snacking & sandwichs" },
  { id: "traiteur", label: "Traiteur" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export type Product = {
  id: string;
  category: CategoryId;
  name: string;
  description: string;
  /** Photo dans /public/images ; sans photo, la carte est purement typographique. */
  image?: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "levain",
    category: "pains",
    name: "Pain au levain",
    description: "Croûte épaisse, mie alvéolée et goût légèrement acidulé. Une longue fermentation pour un pain qui se garde.",
    image: "/images/pain-levain.jpg",
  },
  {
    id: "baguettes",
    category: "pains",
    name: "Baguettes & pains spéciaux",
    description: "Baguette, pains aux céréales, complets et de campagne, sortis du four tout au long de la journée.",
    image: "/images/hero-assortiment.jpg",
  },
  {
    id: "viennoiseries",
    category: "pains",
    name: "Croissants & viennoiseries",
    description: "Croissants, pains au chocolat et brioches feuilletés chaque matin, dès 6h45.",
    image: "/images/viennoiseries.jpg",
  },
  {
    id: "campagne",
    category: "pains",
    name: "Pain de campagne",
    description: "Le pain du quotidien, à trancher pour le petit-déjeuner ou à partager à table.",
    image: "/images/pain-tranche.jpg",
  },
  {
    id: "citron",
    category: "patisseries",
    name: "Tarte au citron meringuée",
    description: "Pâte sablée, crème citron acidulée et meringue dorée au chalumeau.",
    image: "/images/tarte-citron.jpg",
  },
  {
    id: "tartelettes",
    category: "patisseries",
    name: "Tartes aux fruits",
    description: "Fruits de saison sur crème pâtissière, en tartelette individuelle ou à partager.",
    image: "/images/tartes-fruits.jpg",
  },
  {
    id: "entremets",
    category: "patisseries",
    name: "Entremets",
    description: "Biscuit, mousse et glaçage : des gâteaux à étages pour les grandes tablées.",
    image: "/images/entremets.jpg",
  },
  {
    id: "chocolat",
    category: "patisseries",
    name: "Gâteau au chocolat",
    description: "Généreux et fondant, disponible en vitrine ou sur commande à la taille voulue.",
    image: "/images/gateau-chocolat.jpg",
  },
  {
    id: "sandwichs",
    category: "snacking",
    name: "Sandwichs du jour",
    description: "Garnis sur pain frais, à emporter pour la pause déjeuner.",
    image: "/images/sandwich.jpg",
  },
  {
    id: "sale",
    category: "snacking",
    name: "Vitrine salée",
    description: "Quiches, feuilletés et pièces chaudes pour un déjeuner sur le pouce.",
    image: "/images/vitrine-sale.jpg",
  },
  {
    id: "boissons",
    category: "snacking",
    name: "Boissons à emporter",
    description: "Café, boissons chaudes et fraîches pour accompagner votre viennoiserie ou votre sandwich.",
  },
  {
    id: "buffets",
    category: "traiteur",
    name: "Buffets & plateaux",
    description: "Pour vos réceptions, repas d'équipe ou fêtes de famille : salé et sucré à partager.",
    image: "/images/traiteur.jpg",
  },
  {
    id: "cocktail",
    category: "traiteur",
    name: "Pièces cocktail",
    description: "Mini-viennoiseries, canapés et petits fours, au nombre de convives.",
  },
  {
    id: "evenements",
    category: "traiteur",
    name: "Gâteaux d'événement",
    description: "Anniversaire, mariage, baptême : un gâteau personnalisé à votre goût et à votre nombre.",
    image: "/images/gateau-perso.jpg",
  },
];
