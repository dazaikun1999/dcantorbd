import { Perfume, BannerSlide } from '../types';

export const initialPerfumes: Perfume[] = [
  {
    id: 1,
    name: "Afnan 9 PM Rebel",
    brand: "Afnan",
    category: "Sweet & Fruity",
    notes: "Apple, Cinnamon, Wild Lavender, Vanilla",
    inStock: true,
    prices: { "3ml": 280, "5ml": 400, "10ml": 680, "15ml": 1000 },
    concentration: "Eau De Parfum",
    description: "A rebellious, seductive night-out weapon with vibrant apple crunch, spicy cinnamon warmth, and intoxicating Bourbon vanilla."
  },
  {
    id: 2,
    name: "CDNIM Pure Parfum",
    brand: "Armaf",
    category: "Smoky Citrus",
    notes: "Lemon, Pineapple, Birch, Musk, Ambergris",
    inStock: true,
    prices: { "3ml": 230, "5ml": 380, "10ml": 660, "15ml": 970 },
    concentration: "Pure Parfum",
    description: "The gold standard smoky-pineapple power fragrance. Unforgiving sillage with rich birch tar and shimmering citrus."
  },
  {
    id: 3,
    name: "D&G The One",
    brand: "Dolce & Gabbana",
    category: "Warm Spicy & Amber",
    notes: "Tobacco, Amber, Ginger, Cardamom, Cedar",
    inStock: true,
    prices: { "3ml": 380, "5ml": 600, "10ml": 1100, "15ml": 1450 },
    concentration: "Eau De Parfum",
    description: "The quintessential date-night masterpiece. Warm golden tobacco wrapped in spiced ginger, cardamom, and magnetic amber."
  },
  {
    id: 4,
    name: "Dunescape",
    brand: "D'Cantor Exclusives",
    category: "Warm Woody",
    notes: "Sandalwood, Spices, Dry Amber, Cashmere",
    inStock: true,
    prices: { "3ml": 200, "5ml": 340, "10ml": 600, "15ml": 850 },
    concentration: "Extrait De Parfum",
    description: "An exclusive artisanal composition inspired by shifting desert dunes, velvet sandalwood, and sun-baked exotic spices."
  },
  {
    id: 5,
    name: "Dynasty",
    brand: "D'Cantor Exclusives",
    category: "Aromatic Amber",
    notes: "Bergamot, Tonka Bean, Precious Woods",
    inStock: true,
    prices: { "3ml": 190, "5ml": 300, "10ml": 550, "15ml": 760 },
    concentration: "Extrait De Parfum",
    description: "Regal presence in a bottle. Crisp Calabrian bergamot meeting opulent roasted tonka bean and ancient polished woods."
  },
  {
    id: 6,
    name: "Hawas Black",
    brand: "Rasasi",
    category: "Dark Aquatic",
    notes: "Dark Citrus, Driftwood, Black Pepper, Amber",
    inStock: true,
    prices: { "5ml": 280, "10ml": 480, "15ml": 700 },
    concentration: "Eau De Parfum",
    description: "A shadowy, brooding oceanic profile blending stormy marine notes, cracked black peppercorn, and sun-bleached driftwood."
  },
  {
    id: 7,
    name: "Hawas Ice",
    brand: "Rasasi",
    category: "Fresh Aquatic",
    notes: "Frozen Apple, Italian Bergamot, Plum, Musk",
    inStock: true,
    prices: { "5ml": 300, "10ml": 550, "15ml": 800 },
    concentration: "Eau De Parfum",
    description: "Sub-zero freshness. Crisp glacial apple and sparkling Italian bergamot layered with sweet plum and crystalline white musk."
  },
  {
    id: 8,
    name: "Hawas Kobra",
    brand: "Rasasi",
    category: "Spicy Leather",
    notes: "Cardamom, Leather, Smoked Cedar, Vetiver",
    inStock: true,
    prices: { "5ml": 260, "10ml": 450, "15ml": 650 },
    concentration: "Eau De Parfum",
    description: "Intense, dangerous elegance. Saffron and green cardamom biting into dark saddle leather and smoldering Atlas cedar."
  },
  {
    id: 9,
    name: "Hawas Nautilus",
    brand: "Rasasi",
    category: "Oceanic Fresh",
    notes: "Sea Salt, Marine Accord, Crisp Grapefruit",
    inStock: true,
    prices: { "3ml": 200, "5ml": 330 },
    concentration: "Eau De Parfum",
    description: "Deep oceanic mineral spray with bracing sea salt, marine breeze, and zesty bitter grapefruit zest."
  },
  {
    id: 10,
    name: "Hawas Viper",
    brand: "Rasasi",
    category: "Aromatic Green",
    notes: "Mint Leaf, Violet, Green Apple, Ambergris",
    inStock: true,
    prices: { "3ml": 240, "5ml": 350, "10ml": 660, "15ml": 950 },
    concentration: "Eau De Parfum",
    description: "Crushed wild spearmint and powdery violet leaves coiled around crisp granny smith apple and mineral ambergris."
  },
  {
    id: 11,
    name: "Club De Nuit Iconic",
    brand: "Armaf",
    category: "Fresh Blue",
    notes: "Grapefruit, Mint, Ginger, Incense, Cedar",
    inStock: true,
    prices: { "3ml": 260, "5ml": 420, "10ml": 750, "15ml": 1050 },
    concentration: "Eau De Parfum",
    description: "The ultimate blue fragrance archetype with shimmering pink grapefruit, sharp ginger root, smoky incense, and dry cedar."
  },
  {
    id: 12,
    name: "Khadlaj Island Dream / Island",
    brand: "Khadlaj",
    category: "Tropical Gourmand",
    notes: "Coconut, Lime, White Floral, Vanilla Rum",
    inStock: true,
    prices: { "5ml": 290, "10ml": 490, "15ml": 720 },
    concentration: "Eau De Parfum",
    description: "A tropical luxury escape. Creamy coconut water, sun-drenched lime, delicate white tiare petals, and warm aged rum."
  },
  {
    id: 13,
    name: "Mahir Legacy",
    brand: "Lattafa",
    category: "Aromatic Fougere",
    notes: "Lime, Grapefruit, Lavender, Black Pepper",
    inStock: true,
    prices: { "5ml": 280, "10ml": 480, "15ml": 700 },
    concentration: "Eau De Parfum",
    description: "Modern gentleman's aromatic mastery. Sparkling citrus opening fading into crisp French lavender and cracked pepper."
  },
  {
    id: 14,
    name: "N.V (Nautica Voyage)",
    brand: "Nautica",
    category: "Green Aquatic",
    notes: "Green Leaf, Crisp Apple, Water Lotus, Cedarwood",
    inStock: true,
    prices: { "3ml": 130, "5ml": 220, "10ml": 400, "15ml": 550 },
    concentration: "Eau De Toilette",
    description: "The undisputed everyday daytime king. Dewy green leaves, crunchy water-kissed apples, and fresh lotus petals."
  },
  {
    id: 15,
    name: "Qaed Al Fursan",
    brand: "Lattafa",
    category: "Sweet Pineapple & Woody",
    notes: "Smoked Pineapple, Saffron, Balsam Fir, Cedar",
    inStock: true,
    prices: { "5ml": 180, "10ml": 300, "15ml": 400 },
    concentration: "Eau De Parfum",
    description: "Addictive juicy caramelized pineapple roasted over fragrant fir needles, golden saffron threads, and warm woods."
  },
  {
    id: 16,
    name: "Rifaqat",
    brand: "Paris Corner",
    category: "Spicy Vanilla",
    notes: "Black Pepper, Elemi, Saffron, Vanilla Bourbon",
    inStock: true,
    prices: { "5ml": 250, "10ml": 450, "15ml": 650 },
    concentration: "Eau De Parfum",
    description: "Dark, sultry Babycat-style spicy vanilla. Piquant black pepper and sacred elemi melting into luscious Bourbon vanilla."
  },
  {
    id: 17,
    name: "Shiyaka Snow",
    brand: "Khadlaj",
    category: "Crisp Clean",
    notes: "Powdery Musk, White Amber, Aldehydes, Iris",
    inStock: true,
    prices: { "5ml": 290, "10ml": 490, "15ml": 720 },
    concentration: "Eau De Parfum",
    description: "Pristine white linen and fresh morning snow. Powdery Florentine iris, sparkling aldehydes, and velvet white amber."
  },
  {
    id: 18,
    name: "Shurah Elixir",
    brand: "Rasasi",
    category: "Smoky Floral",
    notes: "Tomato Leaf, Rose, Leather, Oud, Oakmoss",
    inStock: true,
    prices: { "5ml": 270, "10ml": 470, "15ml": 700 },
    concentration: "Eau De Parfum",
    description: "A legendary beast-mode olfactory statement. Pungent herbaceous green tomato leaf, velvet Damascus rose, smoky oud, and leather."
  },
  {
    id: 19,
    name: "Supremacy Collector's Edition",
    brand: "Afnan",
    category: "Fruity Birch",
    notes: "Pineapple, Bergamot, Birch, Oakmoss, Amber",
    inStock: true,
    prices: { "3ml": 320, "5ml": 520, "10ml": 950 },
    concentration: "Extrait De Parfum",
    description: "Extrait-grade luxury interpretation of smoky royal pineapple, dry silver birch embers, earthy oakmoss, and amber."
  }
];

export const initialBannerSlides: BannerSlide[] = [
  {
    id: 1,
    title: "Wear the Luxury, Not the Price Tag.",
    subtitle: "100% authentic designer and niche decants from 3ml to 15ml.",
    badge: "AUTHENTIC DECANTS",
    accentText: "DHAKA'S BOUTIQUE PERFUMERY",
    buttonText: "Explore The Collection"
  },
  {
    id: 2,
    title: "Never Regret a Blind Buy Again.",
    subtitle: "Test a 5ml pour before committing to a full bottle.",
    badge: "SMART LUXURY",
    accentText: "CONNOISSEUR'S CHOICE",
    buttonText: "Discover Scent Pours"
  },
  {
    id: 3,
    title: "Pure Original Juice. Zero Compromises.",
    subtitle: "Decanted with medical-grade laboratory precision into glass atomizers.",
    badge: "LAB-GRADE PRECISION",
    accentText: "STERILE ATOMIZERS & SEALS",
    buttonText: "View Vault Catalog"
  },
  {
    id: 4,
    title: "Your Invisible Signature.",
    subtitle: "From boardroom freshness to midnight seduction. Find your scent.",
    badge: "OLFACTORY ARTISTRY",
    accentText: "CURATED SCENT PROFILES",
    buttonText: "Find Your Signature"
  }
];
