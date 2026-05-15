require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // 1. Créer le Superadmin
  const hashedPassword = await bcrypt.hash('Orens@2026', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'laurelbonou@gmail.com' },
    update: {
      password: hashedPassword,
      name: 'Laurel Bonou',
      role: 'SUPERADMIN',
    },
    create: {
      email: 'laurelbonou@gmail.com',
      name: 'Laurel Bonou',
      password: hashedPassword,
      role: 'SUPERADMIN',
    },
  });
  console.log('Superadmin synced:', admin.email);

  // 2. Créer le compte Caissier
  const cashierAccount = await prisma.user.upsert({
    where: { email: 'cotedorens@gmail.com' },
    update: {
      password: hashedPassword,
      name: "Côté d'Or Orens",
      role: 'CASHIER',
    },
    create: {
      email: 'cotedorens@gmail.com',
      password: hashedPassword,
      name: "Côté d'Or Orens",
      role: 'CASHIER',
    },
  });
  console.log('Cashier account synced:', cashierAccount.email);

  // 3. Créer les profils de caissiers
  const hashedPin = await bcrypt.hash('1234', 10);
  const profiles = ["Caissier 1", "Caissier 2", "Caissier 3"];
  for (const name of profiles) {
    await prisma.cashierProfile.upsert({
      where: { id: `${cashierAccount.id}-${name.replace(/\s/g, "")}` },
      update: { name, pin: hashedPin },
      create: {
        id: `${cashierAccount.id}-${name.replace(/\s/g, "")}`,
        name,
        pin: hashedPin,
        userId: cashierAccount.id,
      },
    });
  }
  console.log('Cashier profiles synced');

  // 4. Catégories et Produits depuis lib/menu.ts
  const categoriesData = [
    {
      id: "gouter",
      name: "Goûter & Petit-déjeuner",
      emoji: "🥣",
      items: [
        { id: "tapioca",    name: "Tapioca",              description: "Chaud, nature ou sucré",                price: 300, emoji: "🥥" },
        { id: "arachides",  name: "Arachides grillées",   description: "Portion maison",                        price: 100, emoji: "🥜" },
        { id: "bouillie",   name: "Bouillie maison",      description: "Mil, maïs ou sorgho au lait",           price: 200, emoji: "🍚" },
        { id: "avoine",     name: "Flocon d'avoine",      description: "Porridge chaud (Quaker)",               price: 400, emoji: "🥣" },
        { id: "cafe-chaud", name: "Café / Milo chaud",    description: "Servi chaud, au choix",                 price: 200, emoji: "☕" },
        { id: "cafe-froid", name: "Café / Milo froid",    description: "Servi frais, idéal après-midi",         price: 250, emoji: "🧊" },
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
        { id: "spag-boeuf",     name: "Spaghetti légumes & bœuf",           description: "Légumes sautés et bœuf en sauce",              price: 1000, emoji: "🥩" },
        { id: "spag-sardine",   name: "Spaghetti légumes & sardine",        description: "Sardine en sauce",                             price: 1000, emoji: "🐟" },
        { id: "spag-complet",   name: "Spaghetti complet œuf & saucisse",   description: "Légumes, œuf, saucisse",                       price: 1000, emoji: "🍳", isDailySpecial: true },
        { id: "spag-premium",   name: "Spaghetti premium complet",           description: "Œuf, saucisse & sardine",                      price: 1500, emoji: "⭐" },
        { id: "indomie",        name: "Indomie aux légumes",                 description: "Nouilles sautées, légumes frais",               price: 500,  emoji: "🍜" },
        { id: "riz-vermicelle", name: "Riz aux vermicelles",                 description: "Riz et vermicelles sautés, légumes",            price: 700,  emoji: "🍚" },
        { id: "coquillettes",   name: "Coquillettes à la française",         description: "Pâtes courtes, sauce béchamel, fromage",        price: 700,  emoji: "🧀" },
      ],
    },
    {
      id: "traditionnels",
      name: "Plats traditionnels africains",
      emoji: "🍲",
      items: [
        { id: "pate-blanche",   name: "Pâte blanche sauce graine", description: "Sauce palme + crin-crin", price: 500, emoji: "🍲" },
        { 
          id: "pate-rouge",     name: "Pâte rouge",                description: "Sauce tomate légère — poisson ou aileron au choix", price: 500, emoji: "🍲",
          accompaniments: [
            { id: "poisson",  label: "Poisson grillé",       price: 500  },
            { id: "aileron",  label: "Aileron de poulet",    price: 1200 },
          ]
        },
        { id: "pate-noire",     name: "Pâte noire sauce mouton",   description: "Maïs fermenté, mouton mijoté", price: 800, emoji: "🐑" },
        { 
          id: "piron",          name: "Piron",                     description: "Pâte de maïs — poisson ou aileron au choix", price: 500, emoji: "🥣",
          accompaniments: [
            { id: "poisson",  label: "Poisson grillé",       price: 500  },
            { id: "aileron",  label: "Aileron de poulet",    price: 1200 },
          ]
        },
        { 
          id: "akassa",         name: "Akassa",                    description: "Pâte fermentée maison — poisson ou poulet/aileron au choix", price: 500, emoji: "🫙",
          accompaniments: [
            { id: "poisson",        label: "Poisson grillé",             price: 500  },
            { id: "poulet-aileron", label: "Poulet ou Aileron grillé",   price: 1200 },
          ]
        },
        { 
          id: "igname-pilee",   name: "Igname pilée",              description: "Igname pilée à la main — sauce au choix", price: 500, emoji: "🥔", isDailySpecial: true,
          accompaniments: [
            { id: "sauce-4",      label: "4 sauces (graine, arachide, tomate, gombo + crin-crin)", price: 500  },
            { id: "sauce-mouton", label: "Sauce mouton mijotée",                                    price: 1000 },
          ]
        },
        { 
          id: "atchieke",       name: "Atchiéké",                  description: "Semoule de manioc — poisson ou poulet au choix", price: 700, emoji: "🫘",
          accompaniments: [
            { id: "poisson", label: "Poisson braisé",   price: 700 },
            { id: "poulet",  label: "Poulet grillé",    price: 800 },
          ]
        },
        { id: "gombo-enrichi",  name: "Gombo enrichi",             description: "Sauce gombo + poisson + légumes", price: 700, emoji: "🥗" },
      ],
    },
    {
      id: "entrees",
      name: "Entrées, salades & spécialités",
      emoji: "🥗",
      items: [
        { id: "salade-russe",   name: "Salade à la russe",       description: "Pommes de terre, légumes, mayo, œuf",         price: 600,  emoji: "🥗" },
        { id: "cassoulet",      name: "Cassoulet maison",         description: "Haricots blancs, saucisse, bouillon parfumé", price: 800,  emoji: "🫘" },
        { id: "omelette",       name: "Omelette aux légumes",     description: "Œufs frais, légumes sautés",                  price: 400,  emoji: "🍳" },
        { id: "frites-ailettes",name: "Frites + ailettes",        description: "Hors-d'œuvre à chaud (sur commande)",         price: 1500, emoji: "🍟" },
      ],
    },
    {
      id: "festifs",
      name: "Plats festifs (sur commande)",
      emoji: "🎉",
      items: [
        { id: "riz-gras",         name: "Riz gras festif",           description: "Riz complet + poisson, aileron ou poulet au choix", price: 1500, emoji: "🍛" },
        { id: "poulet-bicyclette",name: "Poulet bicyclette + frites", description: "Poulet local, frites maison",                       price: 2000, emoji: "🍗" },
        { id: "escargot",         name: "Escargot frit",              description: "Au morceau, sauce pimentée",                        price: 500,  emoji: "🐌" },
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

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: { name: cat.name, emoji: cat.emoji },
      create: {
        id: cat.id,
        name: cat.name,
        emoji: cat.emoji,
      }
    });

    for (const item of cat.items) {
      const { accompaniments, ...itemData } = item as any;
      await prisma.product.upsert({
        where: { id: item.id },
        update: {
          name: item.name,
          description: item.description,
          price: item.price,
          emoji: item.emoji,
          isDailySpecial: item.isDailySpecial || false,
          categoryId: cat.id,
        },
        create: {
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          emoji: item.emoji,
          stock: 100,
          isDailySpecial: item.isDailySpecial || false,
          categoryId: cat.id,
        }
      });

      if (accompaniments) {
        // Clear existing accompaniments for this product
        await prisma.accompaniment.deleteMany({ where: { productId: item.id } });
        // Create new ones
        for (const acc of accompaniments) {
          await prisma.accompaniment.create({
            data: {
              label: acc.label,
              price: acc.price,
              productId: item.id,
            }
          });
        }
      }
    }
    console.log(`Category and products synced: ${cat.name}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
