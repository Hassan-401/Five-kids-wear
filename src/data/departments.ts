/**
 * Men's + Women's departments.
 *
 * These two sections run on their own design system (see `.dept-men` /
 * `.dept-women` in `index.css`) and therefore keep their own catalogue,
 * separate from the kids catalogue in `catalog.ts`. Demo data only — the
 * six supplied photographs are cycled across the fake line-up.
 */

import type { Swatch } from "./catalog";

export type Dept = "men" | "women";

export type Bilingual = { ar: string; en: string };

export type SubCategory = {
  slug: string;
  name: Bilingual;
  blurb: Bilingual;
  image: string;
};

export type DeptProduct = {
  id: string;
  slug: string;
  dept: Dept;
  sub: string;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  price: number;
  oldPrice?: number;
  /** Renders the price as "starting from …" — used for multi-variant lines. */
  fromPrice?: boolean;
  image: string;
  sizes: string[];
  colors: Swatch[];
  rating: number;
  reviews: number;
  isNew?: boolean;
  popularity: number;
  createdAt: string;
};

/* ------------------------------------------------------------------ */
/* palettes                                                            */
/* ------------------------------------------------------------------ */

const BLACK: Swatch = { nameAr: "أسود", nameEn: "Black", hex: "#1b1b1b" };
const CHARCOAL: Swatch = { nameAr: "رمادي غامق", nameEn: "Charcoal", hex: "#3f4247" };
const HEATHER: Swatch = { nameAr: "رمادي فاتح", nameEn: "Heather grey", hex: "#c9c7c2" };
const IVORY: Swatch = { nameAr: "عاجي", nameEn: "Ivory", hex: "#efe9df" };
const SAND: Swatch = { nameAr: "بيج", nameEn: "Sand", hex: "#d8c8b2" };
const ESPRESSO: Swatch = { nameAr: "بني داكن", nameEn: "Espresso", hex: "#4a3c31" };
const DENIM: Swatch = { nameAr: "دنيم", nameEn: "Denim", hex: "#7d92a8" };
const DUSTY_BLUE: Swatch = { nameAr: "أزرق باهت", nameEn: "Dusty blue", hex: "#7b93ac" };
const OLIVE: Swatch = { nameAr: "زيتي", nameEn: "Olive", hex: "#6b7257" };

const BUTTER: Swatch = { nameAr: "أصفر فاتح", nameEn: "Butter", hex: "#f2e2b6" };
const PORCELAIN: Swatch = { nameAr: "أزرق بورسلين", nameEn: "Porcelain blue", hex: "#a8bcd8" };
const MINT: Swatch = { nameAr: "أخضر مائي", nameEn: "Mint", hex: "#9fcfc4" };
const BLUSH: Swatch = { nameAr: "وردي هادئ", nameEn: "Blush", hex: "#e8c4c0" };
const ROSEWOOD: Swatch = { nameAr: "خمري", nameEn: "Rosewood", hex: "#8f5f61" };
const SAGE: Swatch = { nameAr: "سيچ", nameEn: "Sage", hex: "#a9b5a0" };
const CREAM: Swatch = { nameAr: "كريمي", nameEn: "Cream", hex: "#f3ece1" };
const TAUPE: Swatch = { nameAr: "بيج داكن", nameEn: "Taupe", hex: "#b39c88" };

/* size runs */
const TOP = ["S", "M", "L", "XL", "2XL", "3XL"];
const WAIST = ["30", "32", "34", "36", "38", "40"];
const SHOE_M = ["40", "41", "42", "43", "44", "45"];
const SHOE_W = ["36", "37", "38", "39", "40", "41"];
const DRESS = ["XS", "S", "M", "L", "XL"];
const EU_W = ["36", "38", "40", "42", "44"];
const ONE = ["One size"];

/* photography — three frames per department, reused across the demo line-up */
const M1 = "/images/men/men-1.jpg";
const M2 = "/images/men/men-2.jpg";
const M3 = "/images/men/men-3.jpg";
const W1 = "/images/women/women-1.jpg";
const W2 = "/images/women/women-2.jpg";
const W3 = "/images/women/women-3.jpg";

/* ------------------------------------------------------------------ */
/* departments                                                         */
/* ------------------------------------------------------------------ */

export const departments: Record<
  Dept,
  {
    slug: Dept;
    name: Bilingual;
    tagline: Bilingual;
    heroTitle: Bilingual;
    heroLead: Bilingual;
    heroImage: string;
    heroAside: string;
    editorial: { title: Bilingual; body: Bilingual; image: string };
    marquee: Bilingual;
    subs: SubCategory[];
  }
> = {
  men: {
    slug: "men",
    name: { ar: "رجالي", en: "Men" },
    tagline: { ar: "خزانة يومية بخامات تفضل معاك", en: "An everyday wardrobe built to last" },
    heroTitle: { ar: "أساسيات الرجل العصري", en: "Modern Essentials" },
    heroLead: {
      ar: "قطع هادئة الألوان، قصّات مضبوطة، وخامات ثقيلة تتحمّل الاستخدام اليومي. اختر القطعة ورَكِّبها كما تحب.",
      en: "Quiet colours, considered cuts and heavyweight fabrics made for daily wear. Pick a piece, build the fit.",
    },
    heroImage: M2,
    heroAside: M1,
    editorial: {
      title: { ar: "طبقات الخريف", en: "The Layering Edit" },
      body: {
        ar: "أوفر شيرت صوف فوق تيشيرت قطن ثقيل وجينز مغسول — تركيبة واحدة تنفع من الصبح للمساء.",
        en: "A wool overshirt over a heavyweight tee and washed denim — one formula that carries you from morning to night.",
      },
      image: M3,
    },
    marquee: {
      ar: "قطن ثقيل · قصّات مضبوطة · شحن سريع · خامات مستوردة",
      en: "Heavyweight cotton · Considered cuts · Fast delivery · Premium fabrics",
    },
    subs: [
      {
        slug: "tshirts",
        name: { ar: "تيشيرتات وقمصان", en: "T-shirts & Shirts" },
        blurb: { ar: "قطن مُمشّط بأوزان مختلفة", en: "Combed cotton in every weight" },
        image: M1,
      },
      {
        slug: "hoodies",
        name: { ar: "هوديز وسويت شيرت", en: "Hoodies & Sweats" },
        blurb: { ar: "وزن ثقيل ووبر داخلي ناعم", en: "Heavy loopback, brushed inside" },
        image: M3,
      },
      {
        slug: "pants",
        name: { ar: "بناطيل وجينز", en: "Trousers & Denim" },
        blurb: { ar: "من الجينز المغسول للشينو", en: "From washed denim to chino" },
        image: M3,
      },
      {
        slug: "outerwear",
        name: { ar: "جاكيتات", en: "Outerwear" },
        blurb: { ar: "أوفر شيرت وجاكيتات صوف", en: "Overshirts and wool jackets" },
        image: M2,
      },
      {
        slug: "shoes",
        name: { ar: "أحذية", en: "Footwear" },
        blurb: { ar: "سنيكرز جلد وسويد", en: "Leather and suede sneakers" },
        image: M1,
      },
      {
        slug: "accessories",
        name: { ar: "إكسسوارات", en: "Accessories" },
        blurb: { ar: "كابات، ساعات، نضارات", en: "Caps, watches, eyewear" },
        image: M2,
      },
    ],
  },

  women: {
    slug: "women",
    name: { ar: "نسائي", en: "Women" },
    tagline: { ar: "قطع ناعمة لأيام هادئة", en: "Soft pieces for slow days" },
    heroTitle: { ar: "تشكيلة الصيف", en: "The Summer Edit" },
    heroLead: {
      ar: "فساتين خفيفة، أقمشة تتنفّس، وألوان مستوحاة من ضوء الصباح. تشكيلة صُنعت لتلبسيها كل يوم.",
      en: "Airy dresses, breathable cloth and colours borrowed from early light — made to be worn every day.",
    },
    heroImage: W1,
    heroAside: W3,
    editorial: {
      title: { ar: "حكاية الفستان المزهّر", en: "A Story in Florals" },
      body: {
        ar: "طبعات صغيرة على قماش خفيف، كشكش هادئ، وخصر مضبوط — الفستان اللي بيشتغل مع الصندل الجلد والكعب الأبيض بنفس السهولة.",
        en: "Ditsy prints on featherweight cloth, a soft ruffle and a defined waist — the dress that works with leather sandals and white heels alike.",
      },
      image: W2,
    },
    marquee: {
      ar: "أقمشة تتنفّس · طبعات محدودة · شحن سريع · قصّات مريحة",
      en: "Breathable cloth · Limited prints · Fast delivery · Easy cuts",
    },
    subs: [
      {
        slug: "dresses",
        name: { ar: "فساتين", en: "Dresses" },
        blurb: { ar: "ميدي وميني بطبعات صيفية", en: "Midi and mini in summer prints" },
        image: W1,
      },
      {
        slug: "tops",
        name: { ar: "توبات وبلوزات", en: "Tops & Blouses" },
        blurb: { ar: "شيفون وقطن مطبوع", en: "Chiffon and printed cotton" },
        image: W2,
      },
      {
        slug: "bottoms",
        name: { ar: "تنانير وبناطيل", en: "Skirts & Trousers" },
        blurb: { ar: "قصّات واسعة ومريحة", en: "Relaxed, roomy cuts" },
        image: W3,
      },
      {
        slug: "outerwear",
        name: { ar: "كارديجان وجاكيتات", en: "Cardigans & Jackets" },
        blurb: { ar: "طبقات خفيفة للمساء", en: "Light layers for the evening" },
        image: W3,
      },
      {
        slug: "shoes",
        name: { ar: "أحذية وشنط", en: "Shoes & Bags" },
        blurb: { ar: "صنادل جلد وكعب مربّع", en: "Leather sandals, block heels" },
        image: W1,
      },
      {
        slug: "accessories",
        name: { ar: "إكسسوارات", en: "Accessories" },
        blurb: { ar: "لمسات صغيرة تكمّل الإطلالة", en: "The small finishing touches" },
        image: W2,
      },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* demo catalogue                                                      */
/* ------------------------------------------------------------------ */

export const deptProducts: DeptProduct[] = [
  /* ---------------------------- MEN ---------------------------- */
  {
    id: "m1",
    slug: "ribbed-knit-polo",
    dept: "men",
    sub: "tshirts",
    nameAr: "بولو تريكو مضلّع",
    nameEn: "Ribbed Knit Polo",
    descAr:
      "بولو تريكو مضلّع بياقة مفتوحة وحواف بلون متباين، خامة قطنية خفيفة تنفع للصيف كله.",
    descEn:
      "A ribbed knit polo with an open collar and contrast trims, in a light cotton yarn made for the whole summer.",
    price: 1290,
    image: M1,
    sizes: TOP,
    colors: [DUSTY_BLUE, IVORY, BLACK],
    rating: 4.7,
    reviews: 64,
    isNew: true,
    popularity: 96,
    createdAt: "2026-09-02",
  },
  {
    id: "m2",
    slug: "heavyweight-boxy-tee",
    dept: "men",
    sub: "tshirts",
    nameAr: "تيشيرت قطن ثقيل واسع",
    nameEn: "Heavyweight Boxy Tee",
    descAr: "تيشيرت قطن ٢٤٠ جرام بقصّة واسعة وكتف منسدل، يحافظ على شكله بعد الغسيل.",
    descEn: "A 240gsm cotton tee with a boxy body and dropped shoulder that holds its shape wash after wash.",
    price: 690,
    oldPrice: 850,
    image: M3,
    sizes: TOP,
    colors: [IVORY, BLACK, OLIVE],
    rating: 4.6,
    reviews: 118,
    popularity: 93,
    createdAt: "2026-08-24",
  },
  {
    id: "m3",
    slug: "oxford-camp-shirt",
    dept: "men",
    sub: "tshirts",
    nameAr: "قميص أوكسفورد بياقة كامب",
    nameEn: "Oxford Camp Shirt",
    descAr: "قميص أوكسفورد بياقة كامب وأزرار صدف، قصّة مريحة تنفع مفتوح فوق تيشيرت.",
    descEn: "An oxford camp-collar shirt with shell buttons and a relaxed cut — great worn open over a tee.",
    price: 980,
    fromPrice: true,
    image: M1,
    sizes: TOP,
    colors: [IVORY, DUSTY_BLUE],
    rating: 4.5,
    reviews: 41,
    popularity: 84,
    createdAt: "2026-08-19",
  },
  {
    id: "m4",
    slug: "loopback-zip-hoodie",
    dept: "men",
    sub: "hoodies",
    nameAr: "هودي بسوستة قطن ثقيل",
    nameEn: "Loopback Zip Hoodie",
    descAr: "هودي بسوستة كاملة من قطن لوب باك ثقيل، بكابوشون مبطّن ورباط مطفي.",
    descEn: "A full-zip hoodie in heavy loopback cotton, with a lined hood and matte drawcords.",
    price: 1450,
    image: M3,
    sizes: TOP,
    colors: [HEATHER, BLACK, ESPRESSO],
    rating: 4.9,
    reviews: 152,
    isNew: true,
    popularity: 99,
    createdAt: "2026-09-04",
  },
  {
    id: "m5",
    slug: "crewneck-sweatshirt",
    dept: "men",
    sub: "hoodies",
    nameAr: "سويت شيرت رقبة دائرية",
    nameEn: "Crewneck Sweatshirt",
    descAr: "سويت شيرت برقبة دائرية مضلّعة ووبر داخلي ناعم يدفّي من غير تقل.",
    descEn: "A crewneck sweat with a ribbed collar and a brushed inside that warms without weight.",
    price: 1150,
    oldPrice: 1390,
    image: M3,
    sizes: TOP,
    colors: [HEATHER, IVORY],
    rating: 4.6,
    reviews: 87,
    popularity: 90,
    createdAt: "2026-08-21",
  },
  {
    id: "m6",
    slug: "washed-straight-jeans",
    dept: "men",
    sub: "pants",
    nameAr: "جينز مغسول قصّة مستقيمة",
    nameEn: "Washed Straight Jeans",
    descAr: "جينز بغسلة فاتحة وقصّة مستقيمة من فوق لتحت، دنيم ١٣ أونصة بلمسة قاسية جميلة.",
    descEn: "A light-wash, straight-through-the-leg jean in 13oz denim with a satisfying dry hand.",
    price: 1390,
    image: M2,
    sizes: WAIST,
    colors: [DENIM, CHARCOAL],
    rating: 4.7,
    reviews: 96,
    popularity: 95,
    createdAt: "2026-08-30",
  },
  {
    id: "m7",
    slug: "relaxed-black-denim",
    dept: "men",
    sub: "pants",
    nameAr: "جينز أسود قصّة واسعة",
    nameEn: "Relaxed Black Denim",
    descAr: "جينز أسود مغسول بقصّة واسعة من الفخذ للأسفل، مريح في المشي والقعدة.",
    descEn: "Washed black denim cut roomy from the thigh down — easy to walk in, easier to sit in.",
    price: 1290,
    image: M3,
    sizes: WAIST,
    colors: [BLACK, CHARCOAL],
    rating: 4.5,
    reviews: 53,
    popularity: 86,
    createdAt: "2026-08-16",
  },
  {
    id: "m8",
    slug: "drawstring-linen-trousers",
    dept: "men",
    sub: "pants",
    nameAr: "بنطلون كتان برباط",
    nameEn: "Drawstring Linen Trousers",
    descAr: "بنطلون كتان بخصر مطاط ورباط، أخف اختيار في أيام الحر.",
    descEn: "Linen trousers on an elasticated drawstring waist — the lightest thing to wear in the heat.",
    price: 890,
    fromPrice: true,
    image: M1,
    sizes: TOP,
    colors: [IVORY, SAND],
    rating: 4.4,
    reviews: 38,
    popularity: 79,
    createdAt: "2026-08-11",
  },
  {
    id: "m9",
    slug: "wool-overshirt",
    dept: "men",
    sub: "outerwear",
    nameAr: "أوفر شيرت صوف",
    nameEn: "Wool Overshirt",
    descAr: "أوفر شيرت من خلطة صوف بجيبين بغطاء وسوستة مخفية، يلبس كقميص أو كجاكيت خفيف.",
    descEn: "A wool-blend overshirt with flapped chest pockets and a concealed zip — shirt or light jacket, your call.",
    price: 2350,
    oldPrice: 2790,
    image: M2,
    sizes: TOP,
    colors: [ESPRESSO, CHARCOAL, OLIVE],
    rating: 4.8,
    reviews: 74,
    isNew: true,
    popularity: 97,
    createdAt: "2026-09-01",
  },
  {
    id: "m10",
    slug: "quilted-liner-jacket",
    dept: "men",
    sub: "outerwear",
    nameAr: "جاكيت مبطّن خفيف",
    nameEn: "Quilted Liner Jacket",
    descAr: "جاكيت مبطّن بوزن خفيف ينفع تحت الكوت أو لوحده في أول البرد.",
    descEn: "A lightly quilted liner that layers under a coat, or stands alone when the cold first arrives.",
    price: 1890,
    image: M2,
    sizes: TOP,
    colors: [BLACK, OLIVE],
    rating: 4.5,
    reviews: 29,
    popularity: 81,
    createdAt: "2026-08-14",
  },
  {
    id: "m11",
    slug: "suede-court-sneakers",
    dept: "men",
    sub: "shoes",
    nameAr: "سنيكرز سويد كلاسيك",
    nameEn: "Suede Court Sneakers",
    descAr: "سنيكرز سويد بنعل مطاط منخفض وخط بسيط، بيروق مع الوقت.",
    descEn: "Suede court sneakers on a low rubber sole with a clean line that ages well.",
    price: 1690,
    image: M1,
    sizes: SHOE_M,
    colors: [SAND, IVORY],
    rating: 4.6,
    reviews: 61,
    popularity: 92,
    createdAt: "2026-08-27",
  },
  {
    id: "m12",
    slug: "leather-high-tops",
    dept: "men",
    sub: "shoes",
    nameAr: "سنيكرز جلد رقبة عالية",
    nameEn: "Leather High-Tops",
    descAr: "سنيكرز جلد برقبة عالية وبطانة ناعمة ونعل يمتص الصدمة.",
    descEn: "Leather high-tops with a padded lining and a shock-absorbing sole unit.",
    price: 2190,
    oldPrice: 2490,
    image: M2,
    sizes: SHOE_M,
    colors: [ESPRESSO, IVORY],
    rating: 4.7,
    reviews: 45,
    popularity: 88,
    createdAt: "2026-08-23",
  },
  {
    id: "m13",
    slug: "wool-baseball-cap",
    dept: "men",
    sub: "accessories",
    nameAr: "كاب صوف بتطريز",
    nameEn: "Wool Baseball Cap",
    descAr: "كاب من خلطة صوف بتطريز أمامي وحزام خلفي معدني قابل للضبط.",
    descEn: "A wool-blend cap with a front embroidery and an adjustable metal strap.",
    price: 490,
    image: M2,
    sizes: ONE,
    colors: [ESPRESSO, BLACK],
    rating: 4.4,
    reviews: 33,
    popularity: 76,
    createdAt: "2026-08-09",
  },
  {
    id: "m14",
    slug: "steel-link-watch",
    dept: "men",
    sub: "accessories",
    nameAr: "ساعة ستانلس بسوار معدني",
    nameEn: "Steel Link Watch",
    descAr: "ساعة بميناء أسود وسوار ستانلس ستيل، مقاومة للماء حتى ٥ بار.",
    descEn: "A black-dial watch on a stainless link bracelet, water resistant to 5 bar.",
    price: 3450,
    fromPrice: true,
    image: M2,
    sizes: ONE,
    colors: [CHARCOAL, BLACK],
    rating: 4.8,
    reviews: 22,
    popularity: 83,
    createdAt: "2026-08-06",
  },
  {
    id: "m15",
    slug: "round-frame-sunglasses",
    dept: "men",
    sub: "accessories",
    nameAr: "نضارة شمس إطار دائري",
    nameEn: "Round Frame Sunglasses",
    descAr: "نضارة بإطار أسيتات دائري وعدسات مستقطبة بحماية كاملة من الأشعة.",
    descEn: "Round acetate frames with polarised lenses and full UV protection.",
    price: 760,
    image: M1,
    sizes: ONE,
    colors: [BLACK, ESPRESSO],
    rating: 4.5,
    reviews: 40,
    isNew: true,
    popularity: 80,
    createdAt: "2026-08-31",
  },

  /* --------------------------- WOMEN --------------------------- */
  {
    id: "w1",
    slug: "daisy-print-mini-dress",
    dept: "women",
    sub: "dresses",
    nameAr: "فستان ميني بطبعة الأقحوان",
    nameEn: "Daisy Print Mini Dress",
    descAr:
      "فستان ميني بحمّالات رفيعة وعقدة أمامية وفتحة صغيرة عند الصدر، بطبعة أقحوان صغيرة على قماش خفيف.",
    descEn:
      "A strappy mini with a twisted front knot and a small keyhole, in a ditsy daisy print on featherweight cloth.",
    price: 1490,
    image: W1,
    sizes: DRESS,
    colors: [MINT, BUTTER, BLUSH],
    rating: 4.9,
    reviews: 143,
    isNew: true,
    popularity: 99,
    createdAt: "2026-09-04",
  },
  {
    id: "w2",
    slug: "buttercup-tiered-sundress",
    dept: "women",
    sub: "dresses",
    nameAr: "فستان صيفي بكشكش متدرّج",
    nameEn: "Buttercup Tiered Sundress",
    descAr: "فستان صيفي بثلاث طبقات كشكش وخصر مطاط وحمّالات قابلة للضبط، بطبعة زهور صغيرة.",
    descEn: "A three-tier sundress with a smocked waist and adjustable straps, scattered with tiny flowers.",
    price: 1290,
    oldPrice: 1590,
    image: W2,
    sizes: DRESS,
    colors: [BUTTER, CREAM],
    rating: 4.8,
    reviews: 96,
    popularity: 96,
    createdAt: "2026-08-29",
  },
  {
    id: "w3",
    slug: "porcelain-halter-dress",
    dept: "women",
    sub: "dresses",
    nameAr: "فستان هالتر بطبعة بورسلين",
    nameEn: "Porcelain Halter Dress",
    descAr: "فستان برقبة هالتر وربطة خلفية وكشكش متدرّج، بطبعة زرقاء مستوحاة من نقش البورسلين.",
    descEn: "A halter-neck dress that ties at the back, with tiered ruffles and a blue porcelain-inspired print.",
    price: 1690,
    fromPrice: true,
    image: W3,
    sizes: DRESS,
    colors: [PORCELAIN, CREAM],
    rating: 4.7,
    reviews: 71,
    isNew: true,
    popularity: 94,
    createdAt: "2026-09-02",
  },
  {
    id: "w4",
    slug: "ruffle-chiffon-blouse",
    dept: "women",
    sub: "tops",
    nameAr: "بلوزة شيفون بكشكش",
    nameEn: "Ruffle Chiffon Blouse",
    descAr: "بلوزة شيفون بأكمام كشكش ورقبة مطاطية، خفيفة على البشرة في الجو الحر.",
    descEn: "A chiffon blouse with ruffled sleeves and an elasticated neckline — barely there in the heat.",
    price: 850,
    image: W2,
    sizes: DRESS,
    colors: [CREAM, BLUSH, BUTTER],
    rating: 4.6,
    reviews: 58,
    popularity: 89,
    createdAt: "2026-08-25",
  },
  {
    id: "w5",
    slug: "smocked-crop-top",
    dept: "women",
    sub: "tops",
    nameAr: "توب قصير بخصر مطاط",
    nameEn: "Smocked Crop Top",
    descAr: "توب قصير بحمّالات رفيعة وظهر مطاط يتمدّد مع الحركة.",
    descEn: "A cropped top on thin straps with a smocked back that moves with you.",
    price: 590,
    oldPrice: 720,
    image: W1,
    sizes: DRESS,
    colors: [MINT, CREAM],
    rating: 4.5,
    reviews: 47,
    popularity: 84,
    createdAt: "2026-08-18",
  },
  {
    id: "w6",
    slug: "tiered-midi-skirt",
    dept: "women",
    sub: "bottoms",
    nameAr: "تنورة ميدي متدرّجة",
    nameEn: "Tiered Midi Skirt",
    descAr: "تنورة ميدي بثلاث طبقات وخصر مطاط مخفي، تتحرك بشكل جميل مع المشي.",
    descEn: "A three-tier midi on a hidden elastic waist that moves beautifully as you walk.",
    price: 990,
    image: W3,
    sizes: EU_W,
    colors: [PORCELAIN, SAGE],
    rating: 4.6,
    reviews: 39,
    popularity: 82,
    createdAt: "2026-08-20",
  },
  {
    id: "w7",
    slug: "wide-leg-linen-pants",
    dept: "women",
    sub: "bottoms",
    nameAr: "بنطلون كتان واسع",
    nameEn: "Wide-Leg Linen Trousers",
    descAr: "بنطلون كتان واسع بخصر عالي وجيوب جانبية، أنيق ومريح في نفس الوقت.",
    descEn: "High-waisted wide-leg linen with side pockets — smart and comfortable at once.",
    price: 1190,
    fromPrice: true,
    image: W1,
    sizes: EU_W,
    colors: [CREAM, TAUPE, SAGE],
    rating: 4.7,
    reviews: 63,
    popularity: 91,
    createdAt: "2026-08-28",
  },
  {
    id: "w8",
    slug: "open-knit-cardigan",
    dept: "women",
    sub: "outerwear",
    nameAr: "كارديجان تريكو مفتوح",
    nameEn: "Open Knit Cardigan",
    descAr: "كارديجان تريكو خفيف بقصّة طويلة، الطبقة المثالية على الفستان في المساء.",
    descEn: "A lightweight longline knit — the layer a dress asks for once the sun goes down.",
    price: 1090,
    image: W3,
    sizes: DRESS,
    colors: [CREAM, BLUSH, SAGE],
    rating: 4.7,
    reviews: 52,
    popularity: 88,
    createdAt: "2026-08-26",
  },
  {
    id: "w9",
    slug: "cropped-denim-jacket",
    dept: "women",
    sub: "outerwear",
    nameAr: "جاكيت جينز قصير",
    nameEn: "Cropped Denim Jacket",
    descAr: "جاكيت جينز بقصّة قصيرة وغسلة فاتحة، يكسر نعومة الفستان بشكل ظريف.",
    descEn: "A cropped, light-wash denim jacket that cuts the softness of a dress just right.",
    price: 1390,
    oldPrice: 1650,
    image: W3,
    sizes: DRESS,
    colors: [PORCELAIN, CREAM],
    rating: 4.5,
    reviews: 34,
    popularity: 80,
    createdAt: "2026-08-13",
  },
  {
    id: "w10",
    slug: "square-toe-block-heels",
    dept: "women",
    sub: "shoes",
    nameAr: "صندل بكعب مربّع",
    nameEn: "Square Toe Block Heels",
    descAr: "صندل بأربطة رفيعة وكعب مربّع ٦ سم، مريح لسهرة كاملة.",
    descEn: "Strappy sandals on a 6cm block heel — comfortable enough for a full evening.",
    price: 1290,
    image: W1,
    sizes: SHOE_W,
    colors: [CREAM, BLACK],
    rating: 4.6,
    reviews: 68,
    isNew: true,
    popularity: 93,
    createdAt: "2026-09-01",
  },
  {
    id: "w11",
    slug: "leather-slide-sandals",
    dept: "women",
    sub: "shoes",
    nameAr: "صندل جلد سهل اللبس",
    nameEn: "Leather Slide Sandals",
    descAr: "صندل جلد طبيعي بنعل مبطّن، اللبسة اليومية اللي بتنفع مع أي حاجة.",
    descEn: "Full-grain leather slides on a cushioned footbed — the daily pair that goes with anything.",
    price: 890,
    image: W2,
    sizes: SHOE_W,
    colors: [TAUPE, ROSEWOOD],
    rating: 4.8,
    reviews: 81,
    popularity: 95,
    createdAt: "2026-08-22",
  },
  {
    id: "w12",
    slug: "woven-top-handle-bag",
    dept: "women",
    sub: "shoes",
    nameAr: "شنطة يد بمقبض مجدول",
    nameEn: "Woven Top-Handle Bag",
    descAr: "شنطة يد صغيرة بمقبض مجدول وقفل معدني، تتسع للأساسيات بالظبط.",
    descEn: "A compact top-handle bag with a braided grip and a metal clasp — the essentials, exactly.",
    price: 1590,
    fromPrice: true,
    image: W1,
    sizes: ONE,
    colors: [CREAM, TAUPE],
    rating: 4.7,
    reviews: 44,
    popularity: 87,
    createdAt: "2026-08-17",
  },
  {
    id: "w13",
    slug: "pearl-drop-earrings",
    dept: "women",
    sub: "accessories",
    nameAr: "حلق لؤلؤ متدلّي",
    nameEn: "Pearl Drop Earrings",
    descAr: "حلق متدلّي بحبة لؤلؤ صناعي وقاعدة مطلية بالذهب، خفيف على الأذن.",
    descEn: "Drop earrings with a faux pearl on a gold-plated post — light enough to forget.",
    price: 390,
    image: W2,
    sizes: ONE,
    colors: [CREAM, BLUSH],
    rating: 4.6,
    reviews: 57,
    popularity: 78,
    createdAt: "2026-08-10",
  },
  {
    id: "w14",
    slug: "silk-hair-scarf",
    dept: "women",
    sub: "accessories",
    nameAr: "إيشارب شعر حرير",
    nameEn: "Silk Hair Scarf",
    descAr: "إيشارب حرير مربّع بطبعة زهور، يلبس على الشعر أو حول الشنطة.",
    descEn: "A square silk scarf in a floral print — wear it in your hair or knotted on a bag.",
    price: 340,
    oldPrice: 420,
    image: W2,
    sizes: ONE,
    colors: [BUTTER, PORCELAIN, BLUSH],
    rating: 4.4,
    reviews: 26,
    popularity: 74,
    createdAt: "2026-08-07",
  },
  {
    id: "w15",
    slug: "slim-leather-belt",
    dept: "women",
    sub: "accessories",
    nameAr: "حزام جلد رفيع",
    nameEn: "Slim Leather Belt",
    descAr: "حزام جلد رفيع بإبزيم ذهبي صغير، يضبط خصر الفستان في ثانية.",
    descEn: "A slim leather belt with a small gold buckle that defines a dress waist in one move.",
    price: 450,
    image: W3,
    sizes: ["S", "M", "L"],
    colors: [TAUPE, BLACK],
    rating: 4.5,
    reviews: 31,
    popularity: 77,
    createdAt: "2026-08-05",
  },
];

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

export const deptProductsOf = (dept: Dept) =>
  deptProducts.filter((p) => p.dept === dept);

export const subCategory = (dept: Dept, slug: string) =>
  departments[dept].subs.find((s) => s.slug === slug);

export const getDeptProduct = (dept: Dept, slug: string) =>
  deptProducts.find((p) => p.dept === dept && p.slug === slug);

export function relatedDeptProducts(product: DeptProduct, limit = 4) {
  const pool = deptProductsOf(product.dept).filter((p) => p.id !== product.id);
  return [
    ...pool.filter((p) => p.sub === product.sub),
    ...pool.filter((p) => p.sub !== product.sub),
  ].slice(0, limit);
}

/** Cart/wishlist links have to know which department a product lives in. */
export function productHref(p: { slug: string; dept?: Dept }) {
  return p.dept ? `/${p.dept}/product/${p.slug}` : `/product/${p.slug}`;
}

/** "One size" is stored in English (it ends up in cart lines) but shown localised. */
export function sizeLabel(size: string, pick: <T>(ar: T, en: T) => T) {
  return size === "One size" ? pick("مقاس واحد", "One size") : size;
}

export type DeptSort = "newest" | "priceAsc" | "priceDesc" | "popular";

export function sortDeptProducts(list: DeptProduct[], sort: DeptSort) {
  const out = list.slice();
  switch (sort) {
    case "priceAsc":
      return out.sort((a, b) => a.price - b.price);
    case "priceDesc":
      return out.sort((a, b) => b.price - a.price);
    case "popular":
      return out.sort((a, b) => b.popularity - a.popularity);
    default:
      return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}
