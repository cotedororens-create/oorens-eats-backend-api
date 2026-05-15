<<<<<<< HEAD
# Cafétéria HOMEL — site web

Site de commande en ligne pour la **Cafétéria du CHU Mère & Enfant (HOMEL)** à Cotonou.

## Stack
- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** pour le design
- **localStorage** pour la persistance du panier
- **WhatsApp Business** pour la validation des commandes

## Démarrage

```bash
npm install
npm run dev
```

Puis ouvre http://localhost:3000

## Build production

```bash
npm run build
npm start
```

## Personnalisation rapide

| Quoi | Où |
|---|---|
| Nom, horaires, numéro WhatsApp, adresse | `lib/config.ts` |
| Menu (plats, prix, descriptions, badges) | `lib/menu.ts` |
| Spécialités hebdomadaires | `lib/menu.ts` (`WEEKLY_SPECIALS`) |
| Couleurs et thème | `tailwind.config.ts` |

## Numéro WhatsApp

Le numéro local fourni est `0148345642` (format Bénin).
Dans `lib/config.ts`, il est converti en format international `2290148345642`
(indicatif **+229** pour le Bénin) pour le lien `wa.me`.
Si le pays est différent, modifier `whatsappNumber`.

## Structure

```
app/
  layout.tsx       # Layout racine + provider du panier
  page.tsx         # Page d'accueil (Hero + carte complète)
  globals.css
components/
  Header.tsx       # Logo + navigation par catégories + bouton panier
  Hero.tsx         # Bannière d'accueil
  WeeklySpecials.tsx
  MenuSection.tsx  # Section par catégorie
  MenuCard.tsx     # Carte d'un plat avec contrôle de quantité
  CartDrawer.tsx   # Tiroir panier + bouton WhatsApp
  FloatingCheckout.tsx # Bouton flottant en bas
  Footer.tsx
lib/
  config.ts        # Constantes du site
  menu.ts          # Données du menu (la "base de données")
  cart.tsx         # Contexte du panier (React Context + useReducer)
  whatsapp.ts      # Construction du lien wa.me avec le récap
```

## Comment fonctionne la commande

1. L'utilisateur ajoute des plats au panier (persistant via localStorage).
2. Il clique sur **"Valider la commande sur WhatsApp"**.
3. Un lien `wa.me/2290148345642?text=...` s'ouvre avec le récapitulatif déjà rédigé :
   - liste des plats et quantités
   - total en FCFA
   - date/heure
4. Il n'a plus qu'à appuyer sur "Envoyer" dans WhatsApp.
5. Le paiement et le retrait se font sur place à la cafétéria.
=======
# chu-mel_eats
>>>>>>> 9f1b19ce0bea7030bb6a0b3bab50e67d54830577
