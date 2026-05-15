// Configuration centrale — modifie ici si nécessaire
export const SITE_CONFIG = {
  name: "Caféteria Orens-Eats",
  fullName: "Caféteria Orens-Eats — CHU Mère & Enfant",
  tagline: "Cuisine maison, faite avec soin · Ingrédients frais quotidiens",
  hours: "Ouvert 7h00 — 22h00 · 7 jours sur 7",
  location: "Hall principal du CHU-MEL, Cotonou",
  // WhatsApp Business — format international sans le « + »
  // Numéro local fourni : 0148345642 (Bénin → indicatif 229)
  whatsappNumber: "2290148345642",
  whatsappDisplay: "+229 01 48 34 56 42",
  email: "cotedororens@gmail.com",
  currency: "FCFA",
  // FeexPay configuration
  feexpay: {
    id: process.env.NEXT_PUBLIC_FEEXPAY_ID || "",
    token: process.env.NEXT_PUBLIC_FEEXPAY_TOKEN || "",
    mode: (process.env.NEXT_PUBLIC_FEEXPAY_MODE as "LIVE" | "SANDBOX") || "SANDBOX",
  },
  // Database placeholder for reference
  databaseUrl: process.env.DATABASE_URL || "",
};
