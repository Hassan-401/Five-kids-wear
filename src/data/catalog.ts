/**
 * Kids catalogue.
 *
 * The photographs are the real product shots supplied in
 * `original products images/` (GEPS line-up). The written fields — prices,
 * descriptions, ratings, review counts, stock flags — are placeholders until
 * the real product data arrives; the images and the categories are real.
 */

export type CategoryId = "boys" | "girls" | "pajamas" | "newborn" | "offers";

export type Category = {
  id: CategoryId;
  slug: string;
  nameAr: string;
  nameEn: string;
  image: string;
  tint: string;
  /** True when the tile art is a product photograph rather than an
   *  illustration — it gets cropped to fill the tile instead of centred. */
  photo?: boolean;
};

export const categories: Category[] = [
  {
    id: "pajamas",
    slug: "pajamas",
    nameAr: "بيجامات",
    nameEn: "Pajamas",
    image: "/images/categories/pajamas.png",
    tint: "from-sky-100 to-pink-100",
  },
  {
    id: "boys",
    slug: "boys",
    nameAr: "ملابس أولاد",
    nameEn: "Boys clothing",
    image: "/images/categories/boys.png",
    tint: "from-sky-100 to-sky-200",
  },
  {
    id: "girls",
    slug: "girls",
    nameAr: "ملابس بنات",
    nameEn: "Girls clothing",
    image: "/images/categories/girls.png",
    tint: "from-pink-100 to-pink-200",
  },
  {
    id: "newborn",
    slug: "newborn",
    nameAr: "مواليد",
    nameEn: "Newborn",
    image: "/images/categories/newborn.jpg",
    tint: "from-pink-100 to-sky-100",
    photo: true,
  },
  {
    id: "offers",
    slug: "offers",
    nameAr: "عروض خاصة",
    nameEn: "Special offers",
    image: "/images/categories/offers.png",
    tint: "from-pink-200 to-sky-100",
  },
];

export type Swatch = { nameAr: string; nameEn: string; hex: string };

/** The minimum shape the cart needs. Kids products and department products
 *  both satisfy it, so `StoreContext` can hold lines from either catalogue. */
export type Purchasable = {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  price: number;
  image: string;
  sizes: string[];
  colors: Swatch[];
  dept?: "men" | "women";
};

export type Product = {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  price: number;
  oldPrice?: number;
  /** Primary shot — always `images[0]`. */
  image: string;
  /** Every shot of this product, primary first. */
  images: string[];
  category: CategoryId;
  gender: "boys" | "girls" | "unisex";
  sizes: string[];
  colors: Swatch[];
  rating: number;
  reviews: number;
  isNew?: boolean;
  popularity: number;
  createdAt: string;
};

/* ---------------------------------------------------------------- colours */

const WHITE: Swatch = { nameAr: "أبيض", nameEn: "White", hex: "#f7f7f5" };
const CREAM: Swatch = { nameAr: "كريمي", nameEn: "Cream", hex: "#f3e7d3" };
const GREY: Swatch = { nameAr: "رمادي", nameEn: "Grey", hex: "#b9b7b2" };
const BLACK: Swatch = { nameAr: "أسود", nameEn: "Black", hex: "#1c1c1c" };
const NAVY: Swatch = { nameAr: "كحلي", nameEn: "Navy", hex: "#1d2a52" };
const BLUE: Swatch = { nameAr: "لبني", nameEn: "Light blue", hex: "#a8cbe8" };
const ROYAL: Swatch = { nameAr: "أزرق", nameEn: "Royal blue", hex: "#2f5fd0" };
const TEAL: Swatch = { nameAr: "أخضر بترولي", nameEn: "Teal", hex: "#1f5f5b" };
const MINT: Swatch = { nameAr: "أخضر فاتح", nameEn: "Mint", hex: "#a9d8cd" };
const SAGE: Swatch = { nameAr: "أخضر زيتي", nameEn: "Sage", hex: "#9fb3a4" };
const OLIVE: Swatch = { nameAr: "زيتي غامق", nameEn: "Olive", hex: "#6f6a3a" };
const PINK: Swatch = { nameAr: "وردي", nameEn: "Pink", hex: "#f5b7ca" };
const ROSE: Swatch = { nameAr: "وردي غامق", nameEn: "Rose", hex: "#e4788f" };
const LILAC: Swatch = { nameAr: "ليلكي", nameEn: "Lilac", hex: "#cfbde2" };
const YELLOW: Swatch = { nameAr: "أصفر", nameEn: "Yellow", hex: "#f4d67a" };
const ORANGE: Swatch = { nameAr: "برتقالي", nameEn: "Orange", hex: "#f38b2a" };
const RED: Swatch = { nameAr: "أحمر", nameEn: "Red", hex: "#d33a3a" };
const MAROON: Swatch = { nameAr: "نبيتي", nameEn: "Maroon", hex: "#7c1f2b" };
const BEIGE: Swatch = { nameAr: "بيج", nameEn: "Beige", hex: "#d9b995" };
const PEACH: Swatch = { nameAr: "مشمشي", nameEn: "Peach", hex: "#f6cdb4" };

/* ----------------------------------------------------------------- sizes */

/** Printed winter pyjamas and raglan sets are cut by age in years. */
const YEARS = ["2", "4", "6", "8", "10", "12", "14", "16"];
/** Some raglan sets run on letter sizes instead. */
const LETTERS = ["M", "L", "XL", "2XL"];
/** Baby line — the pack label prints months. */
const MONTHS = ["NB", "1-3", "3-6", "6-9", "9-12", "12-18", "18-24"];
/** Summer vest + short sets. */
const SUMMER = ["4", "6", "8", "10", "12", "14"];

const img = (slug: string, count: number) =>
  Array.from({ length: count }, (_, i) => `/images/products/${slug}-${i + 1}.jpg`);

/** Every product is written with its shot list; `image` mirrors the first. */
type Draft = Omit<Product, "image" | "images"> & { shots: number };

const drafts: Draft[] = [
  /* =============================================== printed winter pyjamas */
  {
    id: "p01",
    slug: "lion-king-pajama",
    nameAr: "بيجامة الأسد الملك",
    nameEn: "Lion King Pajama",
    descAr:
      "طقم بيجامة شتوي بلون أخضر بترولي مطبوع برسمات الأسد الملك، من قطن مبطّن من الداخل يدفّي بدون تقل. الأكمام والأساور بضلع مطاطي يحافظ على شكله بعد الغسيل.",
    descEn:
      "A teal winter pajama set printed all over with Lion King characters, in brushed cotton that warms without weight. Ribbed cuffs keep their shape after every wash.",
    price: 365,
    oldPrice: 420,
    category: "pajamas",
    gender: "boys",
    sizes: YEARS,
    colors: [TEAL],
    rating: 4.8,
    reviews: 64,
    isNew: true,
    popularity: 97,
    createdAt: "2026-09-06",
    shots: 4,
  },
  {
    id: "p02",
    slug: "blue-dragon-pajama",
    nameAr: "بيجامة التنين الأزرق",
    nameEn: "Blue Dragon Pajama",
    descAr:
      "بيجامة كحلي بطبعة تنانين وكواكب ونجوم، بأساور وياقة لبني. خامة قطن ثقيل مناسبة لليالي الشتاء.",
    descEn:
      "A navy set covered in dragons, planets and stars, finished with light-blue collar and cuffs. Heavyweight cotton made for winter nights.",
    price: 375,
    category: "pajamas",
    gender: "boys",
    sizes: YEARS,
    colors: [NAVY],
    rating: 4.9,
    reviews: 88,
    isNew: true,
    popularity: 99,
    createdAt: "2026-09-07",
    shots: 4,
  },
  {
    id: "p03",
    slug: "snowman-knit-pajama",
    nameAr: "بيجامة رجل الثلج",
    nameEn: "Snowman Knit Pajama",
    descAr:
      "بيجامة بطبعة رجل الثلج وقلوب حمراء على أرضية شبيهة بالتريكو، بأساور بيضاء. مريحة للنوم وللبيت.",
    descEn:
      "A snowman-and-hearts print on a knit-look ground, trimmed in white. Comfortable for sleeping and for lounging at home.",
    price: 340,
    category: "pajamas",
    gender: "girls",
    sizes: YEARS,
    colors: [GREY, WHITE],
    rating: 4.7,
    reviews: 51,
    popularity: 92,
    createdAt: "2026-09-01",
    shots: 2,
  },
  {
    id: "p04",
    slug: "monster-letters-pajama",
    nameAr: "بيجامة حروف المونسترز",
    nameEn: "Monster Letters Pajama",
    descAr:
      "طقم كحلي بطبعة حروف على شكل مخلوقات مرحة بألوان زاهية، بياقة وأساور لبني. تصميم يحبه الأطفال ويساعدهم على حفظ الحروف.",
    descEn:
      "A navy set printed with bright monster letters and a light-blue rib trim — a playful way to get the alphabet to bedtime.",
    price: 355,
    category: "pajamas",
    gender: "unisex",
    sizes: YEARS,
    colors: [NAVY],
    rating: 4.6,
    reviews: 43,
    popularity: 88,
    createdAt: "2026-08-30",
    shots: 2,
  },
  {
    id: "p05",
    slug: "seven-dwarfs-pajama",
    nameAr: "بيجامة الأقزام السبعة",
    nameEn: "Seven Dwarfs Pajama",
    descAr:
      "بيجامة بلون أخضر فاتح مطبوعة برسمات سنو وايت والأقزام السبعة، بضلع مطاطي على الرقبة والأساور.",
    descEn:
      "A sage-green set printed with Snow White and the Seven Dwarfs, with ribbing at the neck and cuffs.",
    price: 350,
    category: "pajamas",
    gender: "unisex",
    sizes: YEARS,
    colors: [SAGE],
    rating: 4.6,
    reviews: 37,
    popularity: 85,
    createdAt: "2026-08-27",
    shots: 1,
  },
  {
    id: "p06",
    slug: "princess-lilac-pajama",
    nameAr: "بيجامة الأميرات الليلكي",
    nameEn: "Lilac Princess Pajama",
    descAr:
      "بيجامة بناتي بلون ليلكي هادئ مطبوعة برسم أميرات بالأبيض والأسود بأسلوب الرسم اليدوي. خامة ناعمة على البشرة.",
    descEn:
      "A soft lilac girls set with hand-drawn princess sketches in black and white, in a fabric that stays gentle on skin.",
    price: 360,
    oldPrice: 410,
    category: "pajamas",
    gender: "girls",
    sizes: YEARS,
    colors: [LILAC],
    rating: 4.8,
    reviews: 72,
    isNew: true,
    popularity: 95,
    createdAt: "2026-09-05",
    shots: 2,
  },
  {
    id: "p07",
    slug: "tom-jerry-pajama",
    nameAr: "بيجامة توم وجيري",
    nameEn: "Tom & Jerry Pajama",
    descAr:
      "بيجامة وردي فاتح بطبعة توم وجيري في مواقفهم المضحكة، بأساور وردي. من أكثر التصميمات طلباً.",
    descEn:
      "A light-pink set printed with Tom and Jerry mid-chase, with pink rib trims. One of the line's best sellers.",
    price: 365,
    category: "pajamas",
    gender: "girls",
    sizes: YEARS,
    colors: [PINK],
    rating: 4.9,
    reviews: 96,
    popularity: 98,
    createdAt: "2026-09-02",
    shots: 2,
  },
  {
    id: "p08",
    slug: "teddy-bows-pajama",
    nameAr: "بيجامة الدباديب والفيونكات",
    nameEn: "Teddy & Bows Pajama",
    descAr:
      "بيجامة كحلي مطبوعة بدباديب وفيونكات حمراء وبيضاء، بياقة وأساور حمراء. تصميم شتوي دافئ ومبهج.",
    descEn:
      "A navy set scattered with teddies and red-and-white bows, trimmed in red — warm and cheerful for the cold months.",
    price: 370,
    category: "pajamas",
    gender: "girls",
    sizes: YEARS,
    colors: [NAVY, RED],
    rating: 4.8,
    reviews: 79,
    isNew: true,
    popularity: 96,
    createdAt: "2026-09-04",
    shots: 4,
  },
  {
    id: "p09",
    slug: "black-dragon-pajama",
    nameAr: "بيجامة التنين الرمادي",
    nameEn: "Grey Dragon Pajama",
    descAr:
      "طقم أسود بطبعة تنانين رمادية ونجوم، بأساور رمادية. مناسب للأولاد اللي بيحبوا الألوان الغامقة.",
    descEn:
      "A black set printed with grey dragons and stars, trimmed in grey — for boys who prefer the darker palette.",
    price: 375,
    category: "pajamas",
    gender: "boys",
    sizes: YEARS,
    colors: [BLACK, GREY],
    rating: 4.7,
    reviews: 45,
    popularity: 90,
    createdAt: "2026-08-29",
    shots: 1,
  },
  {
    id: "p10",
    slug: "snoopy-pajama",
    nameAr: "بيجامة سنوبي",
    nameEn: "Snoopy Pajama",
    descAr:
      "بيجامة لبني بطبعة سنوبي بالكوفية الحمراء، بياقة وأساور سوداء. خامة قطنية تسمح بمرور الهواء.",
    descEn:
      "A light-blue Snoopy set with black collar and cuffs, in a breathable cotton knit.",
    price: 360,
    oldPrice: 400,
    category: "pajamas",
    gender: "boys",
    sizes: YEARS,
    colors: [BLUE, BLACK],
    rating: 4.8,
    reviews: 83,
    popularity: 94,
    createdAt: "2026-08-31",
    shots: 3,
  },
  {
    id: "p11",
    slug: "airplanes-pajama",
    nameAr: "بيجامة الطيارات",
    nameEn: "Airplanes Pajama",
    descAr:
      "بيجامة سوداء برسومات طيارات وهليكوبتر وقوس قزح بالخط الأبيض، بأساور صفراء لافتة.",
    descEn:
      "A black set line-drawn with planes, helicopters and rainbows, finished with bright yellow ribbing.",
    price: 355,
    category: "pajamas",
    gender: "boys",
    sizes: YEARS,
    colors: [BLACK, YELLOW],
    rating: 4.7,
    reviews: 58,
    popularity: 91,
    createdAt: "2026-08-26",
    shots: 2,
  },
  {
    id: "p12",
    slug: "bart-pajama",
    nameAr: "بيجامة بارت",
    nameEn: "Bart Pajama",
    descAr:
      "طقم أسود بطبعة بارت سيمبسون بالأصفر، بأساور صفراء. تصميم شبابي للأعمار الأكبر.",
    descEn:
      "A black set printed with Bart Simpson in yellow, with matching yellow cuffs — the pick for older kids.",
    price: 365,
    category: "pajamas",
    gender: "boys",
    sizes: YEARS,
    colors: [BLACK, YELLOW],
    rating: 4.6,
    reviews: 39,
    popularity: 87,
    createdAt: "2026-08-24",
    shots: 1,
  },
  {
    id: "p13",
    slug: "minnie-yellow-pajama",
    nameAr: "بيجامة ميني الأصفر",
    nameEn: "Yellow Minnie Pajama",
    descAr:
      "بيجامة بناتي أصفر فاتح بطبعة ميني ماوس والفيونكات، بأساور كريمي. خفيفة ودافئة في نفس الوقت.",
    descEn:
      "A pale-yellow girls set printed with Minnie and her bows, trimmed in cream — light yet warm.",
    price: 360,
    category: "pajamas",
    gender: "girls",
    sizes: YEARS,
    colors: [YELLOW, CREAM],
    rating: 4.7,
    reviews: 55,
    isNew: true,
    popularity: 93,
    createdAt: "2026-09-03",
    shots: 1,
  },

  /* ==================================================== raglan winter sets */
  {
    id: "p14",
    slug: "space-raglan-set",
    nameAr: "طقم رجلان الفضاء",
    nameEn: "Space Raglan Set",
    descAr:
      "طقم شتوي بقصة رجلان: صدر برتقالي سادة وأكمام مطبوعة بكواكب ونجوم على أرضية سوداء، مع بنطلون بنفس الطبعة. كود 001.",
    descEn:
      "A raglan winter set — plain orange body, sleeves printed with planets and stars on black, and matching bottoms. Code 001.",
    price: 395,
    category: "pajamas",
    gender: "boys",
    sizes: YEARS,
    colors: [ORANGE, BLACK],
    rating: 4.7,
    reviews: 47,
    isNew: true,
    popularity: 92,
    createdAt: "2026-09-05",
    shots: 2,
  },
  {
    id: "p15",
    slug: "snow-white-raglan-set",
    nameAr: "طقم رجلان سنو وايت",
    nameEn: "Snow White Raglan Set",
    descAr:
      "طقم رجلان بصدر أخضر مائي سادة وأكمام وبنطلون بطبعة سنو وايت والأقزام على أرضية سوداء. كود 004.",
    descEn:
      "A raglan set with a plain mint body and Snow White sleeves and bottoms on a black ground. Code 004.",
    price: 395,
    category: "pajamas",
    gender: "girls",
    sizes: YEARS,
    colors: [MINT, BLACK],
    rating: 4.6,
    reviews: 34,
    popularity: 86,
    createdAt: "2026-08-28",
    shots: 1,
  },
  {
    id: "p16",
    slug: "teddy-raglan-set",
    nameAr: "طقم رجلان الدباديب",
    nameEn: "Teddy Raglan Set",
    descAr:
      "طقم رجلان بصدر بيج سادة وأكمام وبنطلون بطبعة دباديب وفيونكات على أرضية صفراء فاتحة. كود 005.",
    descEn:
      "A raglan set with a plain beige body and teddy-and-bow sleeves and bottoms on pale yellow. Code 005.",
    price: 390,
    oldPrice: 440,
    category: "pajamas",
    gender: "girls",
    sizes: YEARS,
    colors: [BEIGE, YELLOW],
    rating: 4.7,
    reviews: 41,
    popularity: 89,
    createdAt: "2026-08-25",
    shots: 1,
  },
  {
    id: "p17",
    slug: "snowman-raglan-set",
    nameAr: "طقم رجلان رجل الثلج",
    nameEn: "Snowman Raglan Set",
    descAr:
      "طقم رجلان بصدر أبيض سادة وأكمام وبنطلون بطبعة رجل الثلج على أرضية لبني. كود 006.",
    descEn:
      "A raglan set with a plain white body and snowman sleeves and bottoms on light blue. Code 006.",
    price: 390,
    category: "pajamas",
    gender: "unisex",
    sizes: YEARS,
    colors: [WHITE, BLUE],
    rating: 4.5,
    reviews: 28,
    popularity: 83,
    createdAt: "2026-08-22",
    shots: 1,
  },
  {
    id: "p18",
    slug: "airplane-raglan-set",
    nameAr: "طقم رجلان الطيارات",
    nameEn: "Airplane Raglan Set",
    descAr:
      "طقم رجلان بصدر أحمر سادة وأكمام وبنطلون برسومات طيارات على أرضية سوداء. كود 008.",
    descEn:
      "A raglan set with a plain red body and airplane-drawn sleeves and bottoms on black. Code 008.",
    price: 395,
    category: "pajamas",
    gender: "boys",
    sizes: YEARS,
    colors: [RED, BLACK],
    rating: 4.6,
    reviews: 36,
    popularity: 88,
    createdAt: "2026-08-27",
    shots: 1,
  },
  {
    id: "p19",
    slug: "minnie-leopard-raglan-set",
    nameAr: "طقم رجلان ميني ليوبارد",
    nameEn: "Minnie Leopard Raglan Set",
    descAr:
      "طقم رجلان بناتي بصدر وردي سادة وأكمام وبنطلون بطبعة ميني بنقشة الفهد والقلوب. كود 010، مقاسات M إلى 2XL.",
    descEn:
      "A girls raglan set with a plain pink body and Minnie-in-leopard sleeves and bottoms. Code 010, sizes M to 2XL.",
    price: 410,
    category: "pajamas",
    gender: "girls",
    sizes: LETTERS,
    colors: [PINK, ROSE],
    rating: 4.8,
    reviews: 52,
    isNew: true,
    popularity: 94,
    createdAt: "2026-09-04",
    shots: 1,
  },
  {
    id: "p20",
    slug: "puppy-raglan-set",
    nameAr: "طقم رجلان الكلب الصغير",
    nameEn: "Puppy Raglan Set",
    descAr:
      "طقم رجلان بصدر بني سادة وأكمام وبنطلون بطبعة كلاب بنضارات وفيونكات على أرضية زيتي. كود 011، مقاسات M إلى 2XL.",
    descEn:
      "A raglan set with a plain brown body and sleeves and bottoms printed with bespectacled puppies on olive. Code 011, sizes M to 2XL.",
    price: 410,
    category: "pajamas",
    gender: "unisex",
    sizes: LETTERS,
    colors: [BEIGE, OLIVE],
    rating: 4.5,
    reviews: 24,
    popularity: 82,
    createdAt: "2026-08-21",
    shots: 1,
  },
  {
    id: "p21",
    slug: "rosy-puppy-raglan-set",
    nameAr: "طقم رجلان الكلب الوردي",
    nameEn: "Rosy Puppy Raglan Set",
    descAr:
      "طقم رجلان بصدر وردي فاتح سادة وأكمام وبنطلون بطبعة كلاب على أرضية نبيتي. كود 013، مقاسات M إلى 2XL.",
    descEn:
      "A raglan set with a blush body and puppy-print sleeves and bottoms on maroon. Code 013, sizes M to 2XL.",
    price: 410,
    category: "pajamas",
    gender: "girls",
    sizes: LETTERS,
    colors: [PEACH, MAROON],
    rating: 4.6,
    reviews: 31,
    popularity: 85,
    createdAt: "2026-08-23",
    shots: 1,
  },
  {
    id: "p22",
    slug: "hero-blue-raglan-set",
    nameAr: "طقم رجلان الأبطال",
    nameEn: "Blue Hero Raglan Set",
    descAr:
      "طقم رجلان بصدر أزرق سادة وأكمام وبنطلون بطبعة أبطال كرتونية على أرضية لبني.",
    descEn:
      "A raglan set with a royal-blue body and cartoon-hero sleeves and bottoms on light blue.",
    price: 385,
    category: "pajamas",
    gender: "boys",
    sizes: YEARS,
    colors: [ROYAL, BLUE],
    rating: 4.5,
    reviews: 22,
    popularity: 80,
    createdAt: "2026-08-19",
    shots: 1,
  },
  {
    id: "p23",
    slug: "sunny-patch-raglan-set",
    nameAr: "طقم رجلان الأصفر المبهج",
    nameEn: "Sunny Patch Raglan Set",
    descAr:
      "طقم رجلان بصدر أصفر سادة وأكمام وبنطلون بطبعة مربعات كرتونية بألوان باستيل.",
    descEn:
      "A raglan set with a yellow body and pastel patchwork-cartoon sleeves and bottoms.",
    price: 385,
    category: "pajamas",
    gender: "unisex",
    sizes: YEARS,
    colors: [YELLOW, LILAC],
    rating: 4.4,
    reviews: 19,
    popularity: 78,
    createdAt: "2026-08-17",
    shots: 1,
  },

  /* ======================================================== summer 2-piece */
  {
    id: "p24",
    slug: "spiderman-summer-set",
    nameAr: "طقم صيفي سبايدرمان",
    nameEn: "Spider-Man Summer Set",
    descAr:
      "طقم صيفي قطعتين: تيشيرت بحمالات نبيتي بطبعة سبايدرمان وشورت أسود بنفس الطبعة. خامة قطنية خفيفة للجو الحر.",
    descEn:
      "A two-piece summer set — maroon Spider-Man tank plus matching black shorts, in light cotton for hot days.",
    price: 225,
    category: "boys",
    gender: "boys",
    sizes: SUMMER,
    colors: [MAROON, BLACK],
    rating: 4.6,
    reviews: 48,
    popularity: 90,
    createdAt: "2026-08-14",
    shots: 1,
  },
  {
    id: "p25",
    slug: "sonic-summer-set",
    nameAr: "طقم صيفي سونيك",
    nameEn: "Sonic Summer Set",
    descAr:
      "طقم صيفي قطعتين: تيشيرت بحمالات كحلي بطبعة سونيك وشورت أسود مطبوع. مريح للعب والبيت.",
    descEn:
      "A two-piece summer set — navy Sonic tank and printed black shorts. Easy for play and for home.",
    price: 225,
    category: "boys",
    gender: "boys",
    sizes: SUMMER,
    colors: [NAVY, BLACK],
    rating: 4.5,
    reviews: 33,
    popularity: 86,
    createdAt: "2026-08-12",
    shots: 1,
  },
  {
    id: "p26",
    slug: "minnie-summer-set",
    nameAr: "طقم صيفي ميني",
    nameEn: "Minnie Summer Set",
    descAr:
      "طقم صيفي بناتي قطعتين: تيشيرت بحمالات برتقالي بطبعة ميني وشورت رمادي بخصر مطاط.",
    descEn:
      "A two-piece girls summer set — orange Minnie cami and grey shorts on an elasticated waist.",
    price: 215,
    oldPrice: 260,
    category: "girls",
    gender: "girls",
    sizes: SUMMER,
    colors: [ORANGE, GREY],
    rating: 4.5,
    reviews: 29,
    popularity: 84,
    createdAt: "2026-08-10",
    shots: 1,
  },

  /* ================================================= newborn bodysuit packs */
  {
    id: "p27",
    slug: "newbaby-boy-bodysuit-pack",
    nameAr: "بكيت ٤ بودي أولادي — مواليد",
    nameEn: "New Baby Boy Bodysuit Pack (4)",
    descAr:
      "بكيت من ٤ بودي سوت بأكمام قصيرة بألوان أخضر مائي وأصفر وكحلي، بطبعات ترحيب بالمولود. قطن ١٠٠٪ صناعة مصرية، وكباسين خالية من النيكل.",
    descEn:
      "A pack of four short-sleeve bodysuits in mint, yellow and navy with welcome-baby prints. 100% cotton, made in Egypt, with nickel-free poppers.",
    price: 320,
    category: "newborn",
    gender: "boys",
    sizes: MONTHS,
    colors: [MINT, YELLOW, NAVY],
    rating: 4.8,
    reviews: 67,
    isNew: true,
    popularity: 96,
    createdAt: "2026-09-06",
    shots: 2,
  },
  {
    id: "p28",
    slug: "boy-bodysuit-pack-navy",
    nameAr: "بكيت ٤ بودي أولادي كحلي",
    nameEn: "Navy Boy Bodysuit Pack (4)",
    descAr:
      "بكيت من ٤ بودي سوت بألوان كحلي وكريمي ولبني بطبعات بحرية بسيطة. قطن ١٠٠٪ يتحمل الغسيل المتكرر.",
    descEn:
      "Four bodysuits in navy, cream and light blue with simple nautical prints. 100% cotton that takes repeated washing.",
    price: 320,
    category: "newborn",
    gender: "boys",
    sizes: MONTHS,
    colors: [NAVY, CREAM, BLUE],
    rating: 4.7,
    reviews: 44,
    popularity: 91,
    createdAt: "2026-09-01",
    shots: 1,
  },
  {
    id: "p29",
    slug: "boy-bodysuit-pack-1-3",
    nameAr: "بكيت ٤ بودي أولادي ١-٣ شهور",
    nameEn: "Boy Bodysuit Pack 1–3m (4)",
    descAr:
      "بكيت من ٤ بودي سوت مقاس ١-٣ شهور بألوان كحلي ولبني وكريمي، بطبعات «I love my dad» و«Sleep like a captain».",
    descEn:
      "Four bodysuits in the 1–3 month size, in navy, light blue and cream, printed “I love my dad” and “Sleep like a captain”.",
    price: 310,
    category: "newborn",
    gender: "boys",
    sizes: MONTHS,
    colors: [NAVY, BLUE, CREAM],
    rating: 4.7,
    reviews: 52,
    popularity: 92,
    createdAt: "2026-08-30",
    shots: 1,
  },
  {
    id: "p30",
    slug: "boy-bodysuit-pack-6-9",
    nameAr: "بكيت ٤ بودي أولادي ٦-٩ شهور",
    nameEn: "Boy Bodysuit Pack 6–9m (4)",
    descAr:
      "بكيت من ٤ بودي سوت مقاس ٦-٩ شهور بألوان كحلي وأبيض ولبني بطبعات ولادي.",
    descEn:
      "Four bodysuits in the 6–9 month size — navy, white and light blue with boyish prints.",
    price: 310,
    category: "newborn",
    gender: "boys",
    sizes: MONTHS,
    colors: [NAVY, WHITE, BLUE],
    rating: 4.6,
    reviews: 38,
    popularity: 88,
    createdAt: "2026-08-28",
    shots: 1,
  },
  {
    id: "p31",
    slug: "boy-bodysuit-pack-mint",
    nameAr: "بكيت ٤ بودي أولادي أخضر مائي",
    nameEn: "Mint Boy Bodysuit Pack (4)",
    descAr:
      "بكيت من ٤ بودي سوت بألوان أخضر مائي ولبني وأبيض، بطبعات دبدوب وقبطان. خامة ناعمة للمواليد.",
    descEn:
      "Four bodysuits in mint, light blue and white with teddy and captain prints, in a soft newborn-weight cotton.",
    price: 310,
    category: "newborn",
    gender: "boys",
    sizes: MONTHS,
    colors: [MINT, BLUE, WHITE],
    rating: 4.6,
    reviews: 31,
    popularity: 86,
    createdAt: "2026-08-26",
    shots: 1,
  },
  {
    id: "p32",
    slug: "newbaby-bodysuit-pack",
    nameAr: "بكيت ٤ بودي مواليد — ألوان مشتركة",
    nameEn: "New Baby Bodysuit Pack (4)",
    descAr:
      "بكيت من ٤ بودي سوت بألوان أصفر وأخضر مائي وليموني ووردي بطبعات فواكه وحيوانات. مناسب للولد والبنت.",
    descEn:
      "Four bodysuits in yellow, mint, lemon and pink with fruit and animal prints — works for a boy or a girl.",
    price: 320,
    category: "newborn",
    gender: "unisex",
    sizes: MONTHS,
    colors: [YELLOW, MINT, PINK],
    rating: 4.8,
    reviews: 74,
    isNew: true,
    popularity: 95,
    createdAt: "2026-09-05",
    shots: 1,
  },
  {
    id: "p33",
    slug: "fruits-bodysuit-pack",
    nameAr: "بكيت ٤ بودي بطبعة الفواكه",
    nameEn: "Fruit Print Bodysuit Pack (4)",
    descAr:
      "بكيت من ٤ بودي سوت بطبعات أناناس وبطيخ ودبدوب بألوان أصفر وأخضر مائي ووردي.",
    descEn:
      "Four bodysuits printed with pineapple, watermelon and teddy motifs, in yellow, mint and pink.",
    price: 310,
    category: "newborn",
    gender: "unisex",
    sizes: MONTHS,
    colors: [YELLOW, MINT, PINK],
    rating: 4.7,
    reviews: 46,
    popularity: 90,
    createdAt: "2026-08-29",
    shots: 1,
  },
  {
    id: "p34",
    slug: "girl-bodysuit-pack-1-3",
    nameAr: "بكيت ٤ بودي بناتي ١-٣ شهور",
    nameEn: "Girl Bodysuit Pack 1–3m (4)",
    descAr:
      "بكيت من ٤ بودي سوت مقاس ١-٣ شهور بألوان أصفر وأخضر مائي وليموني ووردي، بطبعات بناتي ناعمة.",
    descEn:
      "Four bodysuits in the 1–3 month size — yellow, mint, lemon and pink with soft girly prints.",
    price: 310,
    category: "newborn",
    gender: "girls",
    sizes: MONTHS,
    colors: [YELLOW, MINT, PINK],
    rating: 4.7,
    reviews: 49,
    popularity: 91,
    createdAt: "2026-08-31",
    shots: 1,
  },
  {
    id: "p35",
    slug: "newbaby-girl-bodysuit-pack",
    nameAr: "بكيت ٤ بودي بناتي — مواليد",
    nameEn: "New Baby Girl Bodysuit Pack (4)",
    descAr:
      "بكيت من ٤ بودي سوت بألوان أصفر وأحمر وليموني ووردي بطبعات أناناس وزرافة و«I love mama».",
    descEn:
      "Four bodysuits in yellow, red, lemon and pink printed with pineapple, giraffe and “I love mama”.",
    price: 320,
    category: "newborn",
    gender: "girls",
    sizes: MONTHS,
    colors: [YELLOW, RED, PINK],
    rating: 4.7,
    reviews: 41,
    popularity: 89,
    createdAt: "2026-08-27",
    shots: 1,
  },
  {
    id: "p36",
    slug: "girl-bodysuit-pack-dreaming",
    nameAr: "بكيت ٤ بودي بناتي ٦-٩ شهور",
    nameEn: "Girl Bodysuit Pack 6–9m (4)",
    descAr:
      "بكيت من ٤ بودي سوت مقاس ٦-٩ شهور بألوان أصفر ووردي وأحمر، بطبعات «Dreaming» و«My super mom».",
    descEn:
      "Four bodysuits in the 6–9 month size — yellow, pink and red, printed “Dreaming” and “My super mom”.",
    price: 310,
    category: "newborn",
    gender: "girls",
    sizes: MONTHS,
    colors: [YELLOW, PINK, RED],
    rating: 4.6,
    reviews: 35,
    popularity: 87,
    createdAt: "2026-08-25",
    shots: 1,
  },
  {
    id: "p37",
    slug: "girl-bodysuit-pack-panda",
    nameAr: "بكيت ٤ بودي بناتي بطبعة الباندا",
    nameEn: "Panda Girl Bodysuit Pack (4)",
    descAr:
      "بكيت من ٤ بودي سوت بألوان أصفر ووردي وأحمر بطبعات باندا و«I love mama». من أكثر البكياتات مبيعاً.",
    descEn:
      "Four bodysuits in yellow, pink and red with panda and “I love mama” prints — one of the best-selling packs.",
    price: 315,
    oldPrice: 360,
    category: "newborn",
    gender: "girls",
    sizes: MONTHS,
    colors: [YELLOW, PINK, RED],
    rating: 4.9,
    reviews: 88,
    isNew: true,
    popularity: 98,
    createdAt: "2026-09-07",
    shots: 3,
  },

  /* ================================================== girls printed tee packs */
  {
    id: "p38",
    slug: "girl-tee-pack-flamingo",
    nameAr: "بكيت ٤ تيشيرت بناتي — فلامنجو",
    nameEn: "Flamingo Girl Tee Pack (4)",
    descAr:
      "بكيت من ٤ تيشيرتات بناتي بألوان أصفر وأحمر وليموني ووردي بطبعات فلامنجو وباندا. مقاس ١٨-٢٤ شهر.",
    descEn:
      "Four girls tees in yellow, red, lemon and pink with flamingo and panda prints. Sized 18–24 months.",
    price: 295,
    category: "girls",
    gender: "girls",
    sizes: MONTHS,
    colors: [YELLOW, RED, PINK],
    rating: 4.6,
    reviews: 37,
    popularity: 88,
    createdAt: "2026-08-24",
    shots: 1,
  },
  {
    id: "p39",
    slug: "girl-tee-pack-cutie",
    nameAr: "بكيت ٤ تيشيرت بناتي — كيوت",
    nameEn: "Cutie Girl Tee Pack (4)",
    descAr:
      "بكيت من ٤ تيشيرتات بألوان أصفر وأخضر مائي وليموني ووردي بطبعات بنات وباندا. مقاس ١٨-٢٤ شهر.",
    descEn:
      "Four tees in yellow, mint, lemon and pink with girl and panda prints. Sized 18–24 months.",
    price: 295,
    category: "girls",
    gender: "girls",
    sizes: MONTHS,
    colors: [YELLOW, MINT, PINK],
    rating: 4.7,
    reviews: 44,
    popularity: 90,
    createdAt: "2026-08-26",
    shots: 2,
  },
  {
    id: "p40",
    slug: "girl-tee-pack-mermaid",
    nameAr: "بكيت ٤ تيشيرت بناتي — حورية",
    nameEn: "Mermaid Girl Tee Pack (4)",
    descAr:
      "بكيت من ٤ تيشيرتات بألوان أصفر وأخضر مائي وليموني ووردي بطبعات حورية وباندا ووحيد القرن.",
    descEn:
      "Four tees in yellow, mint, lemon and pink printed with a mermaid, a panda and a unicorn.",
    price: 295,
    category: "girls",
    gender: "girls",
    sizes: MONTHS,
    colors: [YELLOW, MINT, PINK],
    rating: 4.6,
    reviews: 32,
    popularity: 86,
    createdAt: "2026-08-22",
    shots: 1,
  },
  {
    id: "p41",
    slug: "girl-tee-pack-unicorn",
    nameAr: "بكيت ٤ تيشيرت بناتي — يونيكورن",
    nameEn: "Unicorn Girl Tee Pack (4)",
    descAr:
      "بكيت من ٤ تيشيرتات بطبعات وحيد القرن والباندا والفلامنجو بألوان أصفر وأخضر مائي ووردي.",
    descEn:
      "Four tees printed with a unicorn, a panda and a flamingo, in yellow, mint and pink.",
    price: 295,
    oldPrice: 340,
    category: "girls",
    gender: "girls",
    sizes: MONTHS,
    colors: [YELLOW, MINT, PINK],
    rating: 4.7,
    reviews: 40,
    popularity: 89,
    createdAt: "2026-08-20",
    shots: 1,
  },

  /* ======================================================= newborn vest packs */
  {
    id: "p42",
    slug: "boy-vest-pack",
    nameAr: "بكيت ٤ فانلات أولادي مقلّمة",
    nameEn: "Striped Boy Vest Pack (4)",
    descAr:
      "بكيت من ٤ فانلات داخلية بتقليمات أخضر مائي ولبني على أرضية بيضاء، مقاس ١-٣ شهور. قطن رقيق يمتص العرق.",
    descEn:
      "Four undershirts in mint and blue stripes on white, sized 1–3 months, in a fine cotton that breathes.",
    price: 235,
    category: "newborn",
    gender: "boys",
    sizes: MONTHS,
    colors: [MINT, BLUE, WHITE],
    rating: 4.5,
    reviews: 26,
    popularity: 82,
    createdAt: "2026-08-18",
    shots: 1,
  },
  {
    id: "p43",
    slug: "mixed-vest-pack",
    nameAr: "بكيت ٤ فانلات مواليد — ألوان مشتركة",
    nameEn: "Mixed Newborn Vest Pack (4)",
    descAr:
      "بكيت من ٤ فانلات بتقليمات وردي ولبني على أرضية بيضاء، مقاس ١-٣ شهور. مناسب للولد والبنت.",
    descEn:
      "Four undershirts in pink and blue stripes on white, sized 1–3 months — for a boy or a girl.",
    price: 235,
    category: "newborn",
    gender: "unisex",
    sizes: MONTHS,
    colors: [PINK, BLUE, WHITE],
    rating: 4.5,
    reviews: 21,
    popularity: 80,
    createdAt: "2026-08-16",
    shots: 1,
  },
  {
    id: "p44",
    slug: "girl-vest-pack",
    nameAr: "بكيت ٤ فانلات بناتي مقلّمة",
    nameEn: "Striped Girl Vest Pack (4)",
    descAr:
      "بكيت من ٤ فانلات داخلية بتقليمات وردي على أرضية بيضاء، مقاس ١-٣ شهور. ناعمة على بشرة المولود.",
    descEn:
      "Four undershirts in pink stripes on white, sized 1–3 months, gentle on newborn skin.",
    price: 235,
    category: "newborn",
    gender: "girls",
    sizes: MONTHS,
    colors: [PINK, WHITE],
    rating: 4.6,
    reviews: 29,
    popularity: 84,
    createdAt: "2026-08-19",
    shots: 1,
  },

  /* ============================================================= sleepsuits */
  {
    id: "p45",
    slug: "pink-stripe-sleepsuit",
    nameAr: "رومبير مقلّم وردي",
    nameEn: "Pink Stripe Sleepsuit",
    descAr:
      "رومبير برجل بتقليم وردي وحواف كريمي، بكباسين من الرقبة للرجل تسهّل التغيير. قطن ١٠٠٪.",
    descEn:
      "A footed sleepsuit in pink stripes with cream trims and poppers running neck to foot for easy changes. 100% cotton.",
    price: 185,
    category: "newborn",
    gender: "girls",
    sizes: MONTHS,
    colors: [PINK, CREAM],
    rating: 4.7,
    reviews: 43,
    isNew: true,
    popularity: 92,
    createdAt: "2026-09-04",
    shots: 1,
  },
  {
    id: "p46",
    slug: "peach-stripe-sleepsuit",
    nameAr: "رومبير مقلّم مشمشي",
    nameEn: "Peach Stripe Sleepsuit",
    descAr:
      "رومبير برجل بتقليم مشمشي وحواف كريمي وكباسين معدنية. مناسب للنوم في كل الفصول.",
    descEn:
      "A footed sleepsuit in peach stripes with cream trims and metal poppers — sleeps well in any season.",
    price: 185,
    category: "newborn",
    gender: "girls",
    sizes: MONTHS,
    colors: [PEACH, CREAM],
    rating: 4.6,
    reviews: 34,
    popularity: 88,
    createdAt: "2026-08-30",
    shots: 1,
  },
  {
    id: "p47",
    slug: "blue-stripe-sleepsuit",
    nameAr: "رومبير مقلّم لبني",
    nameEn: "Blue Stripe Sleepsuit",
    descAr:
      "رومبير برجل بتقليم لبني وحواف كريمي، بكباسين طويلة من الرقبة للرجل.",
    descEn:
      "A footed sleepsuit in blue stripes with cream trims and a full-length popper placket.",
    price: 185,
    category: "newborn",
    gender: "boys",
    sizes: MONTHS,
    colors: [BLUE, CREAM],
    rating: 4.7,
    reviews: 39,
    popularity: 90,
    createdAt: "2026-09-02",
    shots: 1,
  },
  {
    id: "p48",
    slug: "mint-stripe-sleepsuit",
    nameAr: "رومبير مقلّم أخضر مائي",
    nameEn: "Mint Stripe Sleepsuit",
    descAr:
      "رومبير برجل بتقليم أخضر مائي وحواف كريمي. خامة رقيقة مناسبة للجو المعتدل.",
    descEn:
      "A footed sleepsuit in mint stripes with cream trims, in a fine knit for milder weather.",
    price: 185,
    oldPrice: 215,
    category: "newborn",
    gender: "boys",
    sizes: MONTHS,
    colors: [MINT, CREAM],
    rating: 4.6,
    reviews: 27,
    popularity: 85,
    createdAt: "2026-08-28",
    shots: 1,
  },

  /* ======================================================= single bodysuits */
  {
    id: "p49",
    slug: "navy-boy-bodysuit",
    nameAr: "بودي أولادي كحلي بأكمام قصيرة",
    nameEn: "Navy Short-Sleeve Bodysuit",
    descAr:
      "بودي سوت كحلي بأكمام قصيرة وطبعة «BOY» صغيرة على الصدر، بثلاث كباسين أسفل. قطن ١٠٠٪.",
    descEn:
      "A navy short-sleeve bodysuit with a small “BOY” chest print and three poppers at the crotch. 100% cotton.",
    price: 115,
    category: "newborn",
    gender: "boys",
    sizes: MONTHS,
    colors: [NAVY],
    rating: 4.5,
    reviews: 23,
    popularity: 79,
    createdAt: "2026-08-15",
    shots: 1,
  },
  {
    id: "p50",
    slug: "navy-longsleeve-bodysuit",
    nameAr: "بودي أولادي كحلي بأكمام طويلة",
    nameEn: "Navy Long-Sleeve Bodysuit",
    descAr:
      "بودي سوت كحلي سادة بأكمام طويلة، رقبته تتسع لتمر بسهولة على رأس الطفل من غير ما تفقد شكلها.",
    descEn:
      "A plain navy long-sleeve bodysuit with a neck that stretches over baby's head without losing its shape.",
    price: 125,
    category: "newborn",
    gender: "boys",
    sizes: MONTHS,
    colors: [NAVY],
    rating: 4.6,
    reviews: 30,
    popularity: 83,
    createdAt: "2026-08-17",
    shots: 1,
  },

  /* ========================================================= girls vest pack */
  {
    id: "p51",
    slug: "girl-vest-2pack",
    nameAr: "بكيت ٢ فانلة بناتي بفيونكة",
    nameEn: "Girl Bow Vest Pack (2)",
    descAr:
      "بكيت من فانلتين بناتي بيضاء بحرف مزركش وفيونكة صغيرة عند الصدر، بألوان فيونكة وردي وبنفسجي. صناعة مصرية.",
    descEn:
      "A two-pack of white girls vests with a picot-edged neckline and a small bow in pink and lilac. Made in Egypt.",
    price: 155,
    category: "girls",
    gender: "girls",
    sizes: ["4", "6", "8", "10"],
    colors: [WHITE, PINK, LILAC],
    rating: 4.5,
    reviews: 18,
    popularity: 77,
    createdAt: "2026-08-13",
    shots: 1,
  },
];

export const products: Product[] = drafts.map(({ shots, ...rest }) => {
  const images = img(rest.slug, shots);
  return { ...rest, image: images[0], images };
});

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getRelated(product: Product, limit = 4) {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .concat(
      products.filter(
        (p) => p.id !== product.id && p.category !== product.category,
      ),
    )
    .slice(0, limit);
}

export const onSale = products.filter((p) => p.oldPrice);

export const governorates = [
  { ar: "القاهرة", en: "Cairo" },
  { ar: "الجيزة", en: "Giza" },
  { ar: "الإسكندرية", en: "Alexandria" },
  { ar: "القليوبية", en: "Qalyubia" },
  { ar: "الدقهلية", en: "Dakahlia" },
  { ar: "الشرقية", en: "Sharqia" },
  { ar: "الغربية", en: "Gharbia" },
  { ar: "المنوفية", en: "Monufia" },
  { ar: "البحيرة", en: "Beheira" },
  { ar: "أسيوط", en: "Asyut" },
  { ar: "المنيا", en: "Minya" },
  { ar: "سوهاج", en: "Sohag" },
  { ar: "الأقصر", en: "Luxor" },
  { ar: "أسوان", en: "Aswan" },
  { ar: "بورسعيد", en: "Port Said" },
];

/** Resolves a cart line's stored (English) colour name to the active language. */
export function colorLabel(
  product: { colors: Swatch[] },
  storedName: string,
  pick: <T>(ar: T, en: T) => T,
) {
  const c = product.colors.find((x) => x.nameEn === storedName);
  return c ? pick(c.nameAr, c.nameEn) : storedName;
}
