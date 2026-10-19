# Au Bon Fournil

Site vitrine de la boulangerie-pâtisserie **Au Bon Fournil**, 2 Rue de Sprimont, 95360 Montmagny.

Next.js 16 (App Router) · Tailwind CSS 4 · Framer Motion · Lucide.

## Démarrer

```bash
npm install
npm run dev
```

## Structure

| Fichier | Rôle |
| --- | --- |
| `src/lib/site.ts` | Coordonnées, horaires, calcul du statut « ouvert / fermé » (heure de Paris) |
| `src/lib/products.ts` | Spécialités affichées dans la vitrine filtrable |
| `src/lib/faq.ts` | Questions fréquentes (affichées + données structurées FAQPage) |
| `src/lib/order.ts` | Validation du formulaire de commande (partagée client / serveur) |
| `src/app/api/commande/route.ts` | Réception des demandes de commande |
| `src/components/*` | Sections de la page |

## Formulaire de commande

Par défaut, une demande validée affiche un récapitulatif et invite le client à appeler pour confirmer.
Pour recevoir les demandes par email, créez un compte [Resend](https://resend.com) et définissez dans Vercel :

```
RESEND_API_KEY=...
ORDER_EMAIL_TO=adresse@boulangerie.fr
ORDER_EMAIL_FROM=Au Bon Fournil <commandes@votre-domaine.fr>
```

## À faire avant la mise en ligne définitive

- Remplacer les photos (Unsplash, dans `public/images/`) par de vraies photos de la boutique.
- Relire les descriptions de produits et le délai de commande (48 h) avec le commerçant.
- Définir `NEXT_PUBLIC_SITE_URL` si un nom de domaine est ajouté.
