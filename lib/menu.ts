export type Badge = "nouveau" | "signature";

export type Accompaniment = {
  id: string;
  label: string;
  price: number; // prix TOTAL avec cet accompagnement
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number; // prix de base (ou prix mini si accompagnements)
  badges?: Badge[];
  emoji?: string;
  accompaniments?: Accompaniment[]; // si présent → l'utilisateur doit choisir avant d'ajouter
};

export type Category = {
  id: string;
  name: string;
  emoji: string;
  items: MenuItem[];
};

export const CATEGORIES: Category[] = [
  {
    id: "gouter",
    name: "Goûter & Petit-déjeuner",
    emoji: "🥣",
    items: [
      { id: "tapioca",    name: "Tapioca",              description: "Chaud, nature ou sucré",                price: 300, emoji: "🥥" },
      { id: "arachides",  name: "Arachides grillées",   description: "Portion maison",                        price: 100, emoji: "🥜" },
      { id: "bouillie",   name: "Bouillie maison",      description: "Mil, maïs ou sorgho au lait",           price: 200, emoji: "🍚" },
      { id: "avoine",     name: "Flocon d'avoine",      description: "Porridge chaud (Quaker)",               price: 400, badges: ["nouveau"], emoji: "🥣" },
      { id: "cafe-chaud", name: "Café / Milo chaud",    description: "Servi chaud, au choix",                 price: 200, emoji: "☕" },
      { id: "cafe-froid", name: "Café / Milo froid",    description: "Servi frais, idéal après-midi",         price: 250, badges: ["nouveau"], emoji: "🧊" },
      { id: "fromage",    name: "Fromage portion",      description: "En-cas ou accompagnement",              price: 100, emoji: "🧀" },
    ],
  },
  {
    id: "sandwichs",
    name: "Sandwichs",
    emoji: "🥪",
    items: [
      { id: "sw-poisson", name: "Sandwich au poisson", description: "Pain, poisson grillé, sauce maison",      price: 400, emoji: "🐟" },
      { id: "sw-poulet",  name: "Sandwich au poulet",  description: "Pain, poulet grillé, mayo",               price: 500, emoji: "🐔" },
      { id: "sw-mixte",   name: "Sandwich mixte",      description: "Poisson + poulet, double sauce",          price: 700, emoji: "🥪" },
    ],
  },
  {
    id: "pates-riz",
    name: "Pâtes, Spaghettis & Riz",
    emoji: "🍝",
    items: [
      { id: "spag-nature",    name: "Spaghetti nature",                    description: "Sans accompagnement",                          price: 300,  emoji: "🍝" },
      { id: "spag-legumes",   name: "Spaghetti aux légumes",               description: "Légumes frais sautés",                         price: 500,  emoji: "🥬" },
      { id: "spag-saucisse",  name: "Spaghetti légumes & saucisse",        description: "Saucisse grillée maison",                      price: 700,  emoji: "🌭" },
      { id: "spag-boeuf",     name: "Spaghetti légumes & bœuf",           description: "Légumes sautés et bœuf en sauce",              price: 1000, badges: ["nouveau"], emoji: "🥩" },
      { id: "spag-sardine",   name: "Spaghetti légumes & sardine",        description: "Sardine en sauce",                             price: 1000, emoji: "🐟" },
      { id: "spag-complet",   name: "Spaghetti complet œuf & saucisse",   description: "Légumes, œuf, saucisse",                       price: 1000, badges: ["signature"], emoji: "🍳" },
      { id: "spag-premium",   name: "Spaghetti premium complet",           description: "Œuf, saucisse & sardine",                      price: 1500, badges: ["signature"], emoji: "⭐" },
      { id: "indomie",        name: "Indomie aux légumes",                 description: "Nouilles sautées, légumes frais",               price: 500,  emoji: "🍜" },
      { id: "riz-vermicelle", name: "Riz aux vermicelles",                 description: "Riz et vermicelles sautés, légumes",            price: 700,  badges: ["nouveau"], emoji: "🍚" },
      { id: "coquillettes",   name: "Coquillettes à la française",         description: "Pâtes courtes, sauce béchamel, fromage",        price: 700,  badges: ["nouveau"], emoji: "🧀" },
    ],
  },
  {
    id: "traditionnels",
    name: "Plats traditionnels africains",
    emoji: "🍲",
    items: [
      {
        id: "pate-blanche",
        name: "Pâte blanche sauce graine",
        description: "Sauce palme + crin-crin",
        price: 500, emoji: "🍲",
      },
      {
        id: "pate-rouge",
        name: "Pâte rouge",
        description: "Sauce tomate légère — poisson ou aileron au choix",
        price: 500, emoji: "🍲",
        accompaniments: [
          { id: "poisson",  label: "Poisson grillé",       price: 500  },
          { id: "aileron",  label: "Aileron de poulet",    price: 1200 },
        ],
      },
      {
        id: "pate-noire",
        name: "Pâte noire sauce mouton",
        description: "Maïs fermenté, mouton mijoté",
        price: 800, badges: ["signature"], emoji: "🐑",
      },
      {
        id: "piron",
        name: "Piron",
        description: "Pâte de maïs — poisson ou aileron au choix",
        price: 500, emoji: "🥣",
        accompaniments: [
          { id: "poisson",  label: "Poisson grillé",       price: 500  },
          { id: "aileron",  label: "Aileron de poulet",    price: 1200 },
        ],
      },
      {
        id: "akassa",
        name: "Akassa",
        description: "Pâte fermentée maison — poisson ou poulet/aileron au choix",
        price: 500, emoji: "🫙",
        accompaniments: [
          { id: "poisson",        label: "Poisson grillé",             price: 500  },
          { id: "poulet-aileron", label: "Poulet ou Aileron grillé",   price: 1200 },
        ],
      },
      {
        id: "igname-pilee",
        name: "Igname pilée",
        description: "Igname pilée à la main — sauce au choix",
        price: 500, badges: ["signature"], emoji: "🥔",
        accompaniments: [
          { id: "sauce-4",      label: "4 sauces (graine, arachide, tomate, gombo + crin-crin)", price: 500  },
          { id: "sauce-mouton", label: "Sauce mouton mijotée",                                    price: 1000 },
        ],
      },
      {
        id: "atchieke",
        name: "Atchiéké",
        description: "Semoule de manioc — poisson ou poulet au choix",
        price: 700, badges: ["nouveau"], emoji: "🫘",
        accompaniments: [
          { id: "poisson", label: "Poisson braisé",   price: 700 },
          { id: "poulet",  label: "Poulet grillé",    price: 800 },
        ],
      },
      {
        id: "gombo-enrichi",
        name: "Gombo enrichi",
        description: "Sauce gombo + poisson + légumes",
        price: 700, badges: ["nouveau"], emoji: "🥗",
      },
    ],
  },
  {
    id: "entrees",
    name: "Entrées, salades & spécialités",
    emoji: "🥗",
    items: [
      { id: "salade-russe",   name: "Salade à la russe",       description: "Pommes de terre, légumes, mayo, œuf",         price: 600,  badges: ["nouveau"], emoji: "🥗" },
      { id: "cassoulet",      name: "Cassoulet maison",         description: "Haricots blancs, saucisse, bouillon parfumé", price: 800,  badges: ["nouveau"], emoji: "🫘" },
      { id: "omelette",       name: "Omelette aux légumes",     description: "Œufs frais, légumes sautés",                  price: 400,  emoji: "🍳" },
      { id: "frites-ailettes",name: "Frites + ailettes",        description: "Hors-d'œuvre à chaud (sur commande)",         price: 1500, emoji: "🍟" },
    ],
  },
  {
    id: "festifs",
    name: "Plats festifs (sur commande)",
    emoji: "🎉",
    items: [
      { id: "riz-gras",         name: "Riz gras festif",           description: "Riz complet + poisson, aileron ou poulet au choix", price: 1500, badges: ["signature"], emoji: "🍛" },
      { id: "poulet-bicyclette",name: "Poulet bicyclette + frites", description: "Poulet local, frites maison",                       price: 2000, badges: ["signature"], emoji: "🍗" },
      { id: "escargot",         name: "Escargot frit",              description: "Au morceau, sauce pimentée",                        price: 500,  badges: ["signature"], emoji: "🐌" },
    ],
  },
  {
    id: "boissons-maison",
    name: "Boissons maison",
    emoji: "🥤",
    items: [
      { id: "bissap",       name: "Bissap",               description: "Hibiscus naturel maison",             price: 200, emoji: "🌺" },
      { id: "eau",          name: "Eau minérale",          description: "Plate ou gazeuse",                    price: 200, emoji: "💧" },
      { id: "jus-ananas",   name: "Jus d'ananas",          description: "Pressé frais",                        price: 300, emoji: "🍍" },
      { id: "tamarin",      name: "Tamarin",               description: "Acidulé et frais",                    price: 300, emoji: "🟤" },
      { id: "gingembre",    name: "Jus de gingembre",      description: "Tonique et frais",                    price: 300, emoji: "🫚" },
      { id: "yaourt",       name: "Yaourt fait maison",    description: "Nature ou sucré",                     price: 500, emoji: "🥛" },
      { id: "lait-caille",  name: "Lait caillé",           description: "Lait fermenté traditionnel",          price: 500, emoji: "🥛" },
      { id: "degue",        name: "Dèguè",                 description: "Mil fermenté et lait",                price: 500, emoji: "🥣" },
      { id: "cocktail",     name: "Cocktail maison",       description: "Pastèque + ananas OU mangue + ananas", price: 500, emoji: "🍹" },
      { id: "pamplemousse", name: "Pamplemousse pressé",   description: "Jus frais",                           price: 500, emoji: "🍊" },
      { id: "ahweyo",       name: "Ahweyo",                description: "Boisson végétale locale",             price: 700, emoji: "🌿" },
    ],
  },
  {
    id: "boissons-industrielles",
    name: "Boissons industrielles",
    emoji: "🍺",
    items: [
      { id: "ira-cola",  name: "IRA / Cola World", description: "Soda",           price: 500, emoji: "🥤" },
      { id: "beninoise", name: "Béninoise",         description: "Bière locale",   price: 600, emoji: "🍺" },
      { id: "beaufort",  name: "Beaufort",          description: "Bière",          price: 600, emoji: "🍺" },
      { id: "doppel",    name: "Doppel",            description: "Bière",          price: 600, emoji: "🍺" },
      { id: "flag",      name: "Flag",              description: "Bière",          price: 600, emoji: "🍺" },
      { id: "guinness",  name: "Guinness",          description: "Bière brune",    price: 700, emoji: "🍺" },
    ],
  },
];

export type DailySpecial = {
  day: string;
  main: { name: string; price: number; itemId: string; accompId?: string };
  side: { name: string; price: number; itemId: string; accompId?: string };
};

export const WEEKLY_SPECIALS: DailySpecial[] = [
  { day: "Lundi",    main: { name: "Igname pilée (4 sauces)",            price: 500,  itemId: "igname-pilee",     accompId: "sauce-4"       }, side: { name: "Gombo enrichi",                price: 700,  itemId: "gombo-enrichi"  } },
  { day: "Mardi",    main: { name: "Escargot frit au morceau",           price: 500,  itemId: "escargot"                                     }, side: { name: "Salade à la russe",            price: 600,  itemId: "salade-russe"   } },
  { day: "Mercredi", main: { name: "Poulet bicyclette + frites",         price: 2000, itemId: "poulet-bicyclette"                             }, side: { name: "Coquillettes à la française",  price: 700,  itemId: "coquillettes"   } },
  { day: "Jeudi",    main: { name: "Akassa + poulet sauce arachide",     price: 1200, itemId: "akassa",           accompId: "poulet-aileron" }, side: { name: "Cassoulet maison",             price: 800,  itemId: "cassoulet"      } },
  { day: "Vendredi", main: { name: "Riz gras festif + aileron",          price: 1500, itemId: "riz-gras"                                     }, side: { name: "Atchiéké + poisson braisé",    price: 700,  itemId: "atchieke",       accompId: "poisson" } },
  { day: "Samedi",   main: { name: "Pâte noire sauce mouton spéciale",   price: 1000, itemId: "pate-noire"                                   }, side: { name: "Riz aux vermicelles",          price: 700,  itemId: "riz-vermicelle" } },
  { day: "Dimanche", main: { name: "Grand riz gras + poulet bicyclette", price: 2000, itemId: "riz-gras"                                     }, side: { name: "Igname pilée sauce mouton",    price: 1000, itemId: "igname-pilee",   accompId: "sauce-mouton" } },
];

export const ALL_ITEMS: MenuItem[] = CATEGORIES.flatMap((c) => c.items);

export const ITEM_BY_ID: Record<string, MenuItem> = Object.fromEntries(
  ALL_ITEMS.map((it) => [it.id, it])
);

// Catégorie de chaque article (pour les suggestions de boissons)
export const ITEM_CATEGORY: Record<string, string> = {};
CATEGORIES.forEach((cat) => {
  cat.items.forEach((item) => {
    ITEM_CATEGORY[item.id] = cat.id;
  });
});

// Boissons suggérées par catégorie de plat
export const DRINK_PAIRINGS: Record<string, string[]> = {
  "gouter":       ["cafe-chaud", "cafe-froid", "yaourt", "eau"],
  "sandwichs":    ["jus-ananas", "bissap", "ira-cola", "eau"],
  "pates-riz":    ["bissap", "gingembre", "tamarin", "eau"],
  "traditionnels":["bissap", "gingembre", "ahweyo", "tamarin", "eau"],
  "entrees":      ["pamplemousse", "jus-ananas", "bissap", "eau"],
  "festifs":      ["cocktail", "bissap", "gingembre", "beninoise", "eau"],
};

export function formatPrice(amount: number): string {
  return amount.toLocaleString("fr-FR").replace(/,/g, " ") + " FCFA";
}
